using GameStore.Services.Interfaces.Users;
// GameStore.Services/OrderService.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using GameStore.Entities.Store;
using GameStore.Entities.Games;
using GameStore.Repository.Interfaces;
using GameStore.DTOs.Orders;
using GameStore.Services;
using GameStore.Repository;

namespace GameStore.Services.Implementations.Users;
public class OrderService : IOrderService
{
    private const int MaxPurchasePerUser = 5;

    private readonly IOrderRepository _orderRepository;
    private readonly IGameRepository _gameRepository;
    private readonly IUserRepository _userRepository;
    private readonly GameStoreDbContext _context;
    private readonly INotificationService _notificationService;
    private readonly IWalletTransactionService _walletTransactionService;

    public OrderService(IOrderRepository orderRepository, IGameRepository gameRepository, IUserRepository userRepository, GameStoreDbContext context,
    INotificationService notificationService, IWalletTransactionService walletTransactionService)
    {
        _orderRepository = orderRepository;
        _gameRepository = gameRepository;
        _userRepository = userRepository;
        _context = context;
        _notificationService = notificationService;
        _walletTransactionService = walletTransactionService;
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
        var user = await _userRepository.GetByIdAsync(userId);
        var userEmail = user?.Email;

        var orders = await _context.Orders
            .Where(o => o.UserId == userId
                     || (userEmail != null
                         && o.RecipientEmail != null
                         && o.RecipientEmail.ToLower() == userEmail.ToLower()))
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

    public async Task<Order> CreateOrder(int userId, List<(int GameId, int Quantity)> items, string paymentMethod = "Wallet", string? email = null, string? phone = null, string? recipientEmail = null)
    {
        // Ép buộc chỉ dùng Wallet
        if (!paymentMethod.Equals("Wallet", StringComparison.OrdinalIgnoreCase))
            throw new Exception("Only Wallet payment method is accepted.");

        // Validate người nhận quà trước khi làm bất cứ điều gì
        if (!string.IsNullOrEmpty(recipientEmail))
        {
            var recipient = await _userRepository.GetByEmailAsync(recipientEmail);
            if (recipient == null)
                throw new Exception($"Không tìm thấy tài khoản với email '{recipientEmail}'.");
            if (recipient.Id == userId)
                throw new Exception("Không thể tặng game cho chính mình.");
        }

        long totalAmount = 0;
        var orderDetails = new List<OrderDetail>();
        var user = await _userRepository.GetByIdAsync(userId);

        // Kiểm tra số lượng key có sẵn & giới hạn mua tối đa/người
        foreach (var (gameId, quantity) in items)
        {
            var game = await _gameRepository.GetByIdAsync(gameId)
                       ?? throw new Exception($"Game {gameId} not found");

            // Kiểm tra giới hạn mua tối đa/người (tính cả đơn đã hoàn thành + đang chờ)
            var alreadyPurchased = await _context.OrderDetails
                .Where(od => od.Order.UserId == userId && od.GameId == gameId && od.Order.Status != "Cancelled")
                .SumAsync(od => (int?)od.Quantity) ?? 0;
            if (alreadyPurchased + quantity > MaxPurchasePerUser)
                throw new Exception($"You can only purchase up to {MaxPurchasePerUser} copies of '{game.Title}'. You have already purchased {alreadyPurchased} copies.");

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
            RecipientEmail = recipientEmail,
            OrderDate = DateTime.UtcNow,
            OrderDetails = orderDetails
        };
        _context.Orders.Add(order);

        // Lưu tất cả
        await _context.SaveChangesAsync();

        // Ghi log WalletTransaction cho chi tiêu
        await _walletTransactionService.LogTransactionAsync(
            userId, -totalAmount,
            user.Wallet + totalAmount, user.Wallet,
            "Purchase", $"Thanh toán đơn hàng #{order.Id}", order.Id);

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

                // Xử lý Library entry
                if (!string.IsNullOrEmpty(order.RecipientEmail))
                {
                    // Quà tặng: thêm vào thư viện người nhận (nếu họ có tài khoản)
                    var recipient = await _userRepository.GetByEmailAsync(order.RecipientEmail);
                    if (recipient != null)
                    {
                        var recipientOwned = await _context.Libraries.AnyAsync(l => l.UserId == recipient.Id && l.GameId == detail.GameId);
                        if (recipientOwned)
                            throw new Exception($"Người nhận đã sở hữu '{detail.Game?.Title}'. Hủy đơn để hoàn tiền cho người tặng.");

                        _context.Libraries.Add(new Library
                        {
                            UserId = recipient.Id,
                            GameId = detail.GameId,
                            AcquiredAt = DateTime.UtcNow
                        });
                        // Gửi thông báo cho người nhận
                        await _notificationService.CreateNotificationAsync(recipient.Id,
                            "Bạn nhận được quà tặng! 🎁",
                            $"Bạn vừa được tặng game '{detail.Game?.Title}'! Key đã có trong hóa đơn #{order.Id}.",
                            $"/invoice/{order.Id}");
                    }
                }
                else
                {
                    // Mua cho bản thân: thêm vào thư viện người mua
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
            }

            if (!string.IsNullOrEmpty(order.RecipientEmail))
            {
                await _notificationService.CreateNotificationAsync(order.UserId,
                    "Đơn hàng quà tặng đã được duyệt ✓",
                    $"Đơn hàng #{order.Id} đã được phê duyệt. Key game đã được gửi đến {order.RecipientEmail}.",
                    $"/invoice/{order.Id}");
            }
            else
            {
                await _notificationService.CreateNotificationAsync(order.UserId,
                    "Đơn hàng đã được duyệt",
                    $"Đơn hàng #{order.Id} đã được phê duyệt. Kiểm tra email để nhận key game.",
                    $"/invoice/{order.Id}");
            }
        }

        if (status.Equals("Cancelled", StringComparison.OrdinalIgnoreCase) && order.Status != "Cancelled")
        {
            var user = await _userRepository.GetByIdAsync(order.UserId);
            if (user != null && order.PaymentMethod.Equals("Wallet", StringComparison.OrdinalIgnoreCase))
            {
                var balanceBefore = user.Wallet;
                user.Wallet += order.TotalAmount;
                _context.Users.Update(user);

                // Ghi log WalletTransaction cho hoàn tiền
                await _walletTransactionService.LogTransactionAsync(
                    order.UserId, order.TotalAmount, balanceBefore, user.Wallet,
                    "Refund", $"Hoàn tiền hủy đơn #{order.Id}", order.Id);
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
