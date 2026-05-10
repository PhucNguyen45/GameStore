// GameStore.Services/OrderService.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using GameStore.Entities.Store;
using GameStore.Entities.Games;
using GameStore.Repository.EFCore;
using GameStore.Services;

namespace GameStore.Services;

public class OrderService : IOrderService
{
    private readonly IOrderRepository _orderRepository;
    private readonly IGameRepository _gameRepository;
    private readonly IUserRepository _userRepository;
    private readonly GameStore.Repository.GameStoreDbContext _context;
    private readonly INotificationService _notificationService;

    public OrderService(IOrderRepository orderRepository, IGameRepository gameRepository, IUserRepository userRepository, GameStore.Repository.GameStoreDbContext context,
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

    public async Task<List<Order>> GetAll(int page, int pageSize) =>
        (await _orderRepository.GetAllAsync()).ToList();

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

    public async Task<(List<Order> Items, int TotalCount)> SearchOrders(int page, int pageSize, string? keyword, DateTime? fromDate, DateTime? toDate, string? status)
    {
        var query = _context.Orders.Include(o => o.User).AsQueryable();

        if (!string.IsNullOrEmpty(keyword))
        {
            var isNumeric = int.TryParse(keyword, out int orderId);
            query = query.Where(o => o.User.Username.Contains(keyword) || (isNumeric && o.Id == orderId));
        }
        if (fromDate.HasValue) query = query.Where(o => o.OrderDate >= fromDate.Value);
        if (toDate.HasValue) query = query.Where(o => o.OrderDate <= toDate.Value);
        if (!string.IsNullOrEmpty(status)) query = query.Where(o => o.Status == status);

        int totalCount = await query.CountAsync();
        var items = await query.OrderByDescending(o => o.OrderDate)
                               .Skip((page - 1) * pageSize)
                               .Take(pageSize)
                               .ToListAsync();
        return (items, totalCount);
    }

    public async Task<Order> CreateOrder(int userId, List<(int GameId, int Quantity)> items, string paymentMethod = "Wallet", string? email = null, string? phone = null)
    {
        // Ép buộc chỉ dùng Wallet
        if (!paymentMethod.Equals("Wallet", StringComparison.OrdinalIgnoreCase))
            throw new Exception("Only Wallet payment method is accepted.");

        decimal totalAmount = 0;
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
            Status = "Pending",
            PaymentMethod = "Wallet",
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
            // Gán key cho từng game
            foreach (var detail in order.OrderDetails)
            {
                for (int i = 0; i < detail.Quantity; i++)
                {
                    var key = await _context.GameKeys
                        .FirstOrDefaultAsync(k => k.GameId == detail.GameId && !k.IsUsed && (k.ExpiresAt == null || k.ExpiresAt > DateTime.UtcNow));
                    if (key == null)
                        throw new Exception($"No available keys for game: {detail.Game?.Title}");

                    key.IsUsed = true;
                    key.UsedAt = DateTime.UtcNow;
                    key.OrderDetailId = detail.Id;
                    _context.GameKeys.Update(key);
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
            await _notificationService.CreateNotificationAsync(order.UserId, "Đơn hàng đã bị hủy", $"Đơn hàng #{order.Id} đã bị hủy. Nếu bạn đã thanh toán, tiền sẽ được hoàn vào ví.", $"/invoice/{order.Id}"
    );
        }

        order.Status = status;
        _context.Orders.Update(order);
        await _context.SaveChangesAsync();
        return order;
    }

    public async Task CancelOrder(int orderId)
    {
        var order = await _orderRepository.GetByIdAsync(orderId) ?? throw new Exception("Order not found");
        if (order.Status == "Completed") throw new Exception("Cannot cancel completed order");

        var user = await _userRepository.GetByIdAsync(order.UserId);
        if (user != null)
        {
            user.Wallet += order.TotalAmount;
            await _userRepository.UpdateAsync(user);
        }
        order.Status = "Cancelled";
        await _orderRepository.UpdateAsync(order);
    }
}
