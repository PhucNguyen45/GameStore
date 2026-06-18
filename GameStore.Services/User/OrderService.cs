// GameStore.Services/OrderService.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using GameStore.Entities.Store;
using GameStore.Entities.Games;
using GameStore.Repository.EFCore;
using GameStore.DTOs.Orders;
using GameStore.Services;
using GameStore.Repository;

namespace GameStore.Services;

public class OrderService : IOrderService
{
    private readonly IOrderRepository _orderRepository;
    private readonly IGameRepository _gameRepository;
    private readonly IUserRepository _userRepository;
    private readonly GameStoreDbContext _context;
    private readonly INotificationService _notificationService;

    public OrderService(IOrderRepository orderRepository, IGameRepository gameRepository, IUserRepository userRepository, GameStoreDbContext context,
    INotificationService notificationService)
    {
        _orderRepository = orderRepository;
        _gameRepository = gameRepository;
        _userRepository = userRepository;
        _context = context;
        _notificationService = notificationService;
    }

    public async Task<Order?> GetById(int id) =>
        await _context.Orders
            .Include(o => o.OrderDetails)
            .ThenInclude(od => od.Game)
            .Include(o => o.OrderDetails)
            .ThenInclude(od => od.GameKeys)
            .FirstOrDefaultAsync(o => o.Id == id);

    public async Task<List<Order>> GetByUser(int userId) =>
        await _orderRepository.GetByUserAsync(userId);

    public async Task<(List<Order> Items, int TotalCount)> GetAll(int page, int pageSize)
    {
        var (items, totalCount) = await _orderRepository.GetPagedAsync(
            page, pageSize,
            orderBy: o => (object)o.OrderDate,
            descending: true);
        return (items.ToList(), totalCount);
    }

    public async Task<List<OrderHistoryDto>> GetOrderHistoryAsync(int userId)
    {
        var orders = await _context.Orders
            .Where(o => o.UserId == userId)
            .Include(o => o.OrderDetails)
                .ThenInclude(od => od.Game)
            .OrderByDescending(o => o.OrderDate)
            .ToListAsync();

        return orders.Select(o => new OrderHistoryDto
        {
            Id = o.Id,
            OrderDate = o.OrderDate,
            TotalAmount = o.TotalAmount,
            Status = o.Status,
            PaymentMethod = o.PaymentMethod,
            Items = o.OrderDetails.Select(od => new OrderHistoryItemDto
            {
                GameId = od.GameId,
                GameTitle = od.Game?.Title ?? "Unknown",
                Quantity = od.Quantity,
                UnitPrice = od.UnitPrice
            }).ToList()
        }).ToList();
    }

    public async Task<Order> CreateOrder(int userId, List<(int GameId, int Quantity)> items, string paymentMethod = "Wallet", string? email = null, string? phone = null)
    {
        // Ép buộc chỉ dùng Wallet
        if (!paymentMethod.Equals("Wallet", StringComparison.OrdinalIgnoreCase))
            throw new Exception("Only Wallet payment method is accepted.");

        long totalAmount = 0;
        var orderDetails = new List<OrderDetail>();
        var user = await _userRepository.GetByIdAsync(userId);

        // Kiểm tra số lượng key có sẵn
        foreach (var (gameId, quantity) in items)
        {
            var game = await _gameRepository.GetByIdAsync(gameId)
                       ?? throw new Exception($"Game {gameId} not found");

            int availableKeys = await _context.GameKeys
                .CountAsync(k => k.GameId == gameId && !k.IsUsed && (k.ExpiresAt == null || k.ExpiresAt > DateTime.UtcNow));
            if (availableKeys < quantity)
                throw new Exception($"Not enough keys for '{game.Title}'. Available: {availableKeys}");

            var price = game.DiscountPrice ?? game.Price;
            totalAmount += price * quantity;
            orderDetails.Add(new OrderDetail
            {
                GameId = gameId,
                Quantity = quantity,
                UnitPrice = price
            });
        }

        // Kiểm tra số dư
        if (user == null || user.Wallet < totalAmount)
            throw new Exception("Insufficient wallet balance");

        // Trừ tiền
        user.Wallet -= totalAmount;
        _context.Users.Update(user);

        // Tạo order
        var order = new Order
        {
            UserId = userId,
            TotalAmount = totalAmount,
            Status = "Pending",                PaymentMethod = "Wallet",
            Email = email,
            Phone = phone,
            OrderDate = DateTime.UtcNow,
            OrderDetails = orderDetails
        };
        _context.Orders.Add(order);

        // Lưu tất cả
        await _context.SaveChangesAsync();

        return order;
    }

    public async Task<Order> UpdateStatus(int orderId, string status)
    {
        var order = await _context.Orders
            .Include(o => o.OrderDetails)
            .ThenInclude(od => od.Game)
            .FirstOrDefaultAsync(o => o.Id == orderId) ?? throw new Exception("Order not found");

        if (status.Equals("Completed", StringComparison.OrdinalIgnoreCase) && order.Status != "Completed")
        {
            // Gán key cho từng game + tạo Library entries
            foreach (var detail in order.OrderDetails)
            {
                // Lấy tất cả key sẵn có cùng lúc để tránh lấy trùng key
                var availableKeys = await _context.GameKeys
                    .Where(k => k.GameId == detail.GameId && !k.IsUsed && (k.ExpiresAt == null || k.ExpiresAt > DateTime.UtcNow))
                    .Take(detail.Quantity)
                    .ToListAsync();

                if (availableKeys.Count < detail.Quantity)
                    throw new Exception($"Not enough keys for '{detail.Game?.Title}'. Need {detail.Quantity}, available {availableKeys.Count}");

                foreach (var key in availableKeys)
                {
                    key.IsUsed = true;
                    key.UsedAt = DateTime.UtcNow;
                    key.OrderDetailId = detail.Id;
                    _context.GameKeys.Update(key);
                }

                // Tạo Library entry nếu user chưa sở hữu game này
                var owned = await _context.Libraries.AnyAsync(l => l.UserId == order.UserId && l.GameId == detail.GameId);
                if (!owned)
                {
                    _context.Libraries.Add(new Library
                    {
                        UserId = order.UserId,
                        GameId = detail.GameId,
                        AcquiredAt = DateTime.UtcNow
                    });
                }
            }
            await _notificationService.CreateNotificationAsync(order.UserId, "Đơn hàng đã được duyệt", $"Đơn hàng #{order.Id} đã được phê duyệt. Kiểm tra email để nhận key game.", $"/invoice/{order.Id}");
        }

        if (status.Equals("Cancelled", StringComparison.OrdinalIgnoreCase) && order.Status != "Cancelled")
        {
            var user = await _userRepository.GetByIdAsync(order.UserId);
            if (user != null && order.PaymentMethod.Equals("Wallet", StringComparison.OrdinalIgnoreCase))
            {
                user.Wallet += order.TotalAmount;
                _context.Users.Update(user);
            }
            await _notificationService.CreateNotificationAsync(order.UserId, "Đơn hàng đã bị hủy", $"Đơn hàng #{order.Id} đã bị hủy. Nếu bạn đã thanh toán, tiền sẽ được hoàn vào ví.", $"/invoice/{order.Id}");
        }

        order.Status = status;
        _context.Orders.Update(order);
        await _context.SaveChangesAsync();
        return order;
    }

    public async Task CancelOrder(int orderId)
    {
        // Delegate to UpdateStatus to ensure WalletTransaction Refund + notification are recorded.
        // Guard: không cho hủy đơn đã hoàn thành (đã gán key)
        var order = await _context.Orders.FindAsync(orderId) ?? throw new Exception("Order not found");
        if (order.Status == "Completed") throw new Exception("Cannot cancel completed order");
        await UpdateStatus(orderId, "Cancelled");
    }
}
