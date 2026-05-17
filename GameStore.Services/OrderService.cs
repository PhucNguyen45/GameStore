// GameStore.Services/OrderService.cs
using Microsoft.EntityFrameworkCore.Storage;
using GameStore.Entities.Store;
using GameStore.Entities.Games;
using GameStore.Repository.EFCore;
using GameStore.DTOs.Orders;

namespace GameStore.Services;

public class OrderService : IOrderService
{
    private readonly IOrderRepository _orderRepo;
    private readonly IGameRepository _gameRepo;
    private readonly IUserRepository _userRepo;
    private readonly IGameKeyRepository _gameKeyRepo;
    private readonly INotificationRepository _notiRepo;
    private readonly ILibraryRepository _libraryRepo;
    private readonly GameStore.Repository.GameStoreDbContext _context; // chỉ dùng cho transaction

    public OrderService(
        IOrderRepository orderRepo,
        IGameRepository gameRepo,
        IUserRepository userRepo,
        IGameKeyRepository gameKeyRepo,
        INotificationRepository notiRepo,
        ILibraryRepository libraryRepo,
        GameStore.Repository.GameStoreDbContext context)
    {
        _orderRepo = orderRepo;
        _gameRepo = gameRepo;
        _userRepo = userRepo;
        _gameKeyRepo = gameKeyRepo;
        _notiRepo = notiRepo;
        _libraryRepo = libraryRepo;
        _context = context;
    }

    public async Task<Order?> GetById(int id) =>
        await _orderRepo.GetOrderWithDetailsAsync(id);

    public async Task<List<Order>> GetByUser(int userId) =>
        await _orderRepo.GetByUserWithDetailsAsync(userId);

    public async Task<List<OrderHistoryDto>> GetOrderHistoryAsync(int userId)
    {
        var orders = await _orderRepo.GetByUserWithDetailsAsync(userId);
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

    public async Task<Order> CreateOrder(int userId, List<(int GameId, int Quantity)> items,
        string paymentMethod = "Wallet", string? email = null, string? phone = null)
    {
        if (!paymentMethod.Equals("Wallet", StringComparison.OrdinalIgnoreCase))
            throw new Exception("Only Wallet payment method is accepted.");

        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            decimal totalAmount = 0;
            var orderDetails = new List<OrderDetail>();
            var user = await _userRepo.GetByIdAsync(userId)
                       ?? throw new Exception("User not found");

            foreach (var (gameId, quantity) in items)
            {
                var game = await _gameRepo.GetByIdAsync(gameId)
                           ?? throw new Exception($"Game {gameId} not found");

                var availableKeys = await _gameKeyRepo.GetAvailableKeysAsync(gameId, quantity);
                if (availableKeys.Count < quantity)
                    throw new Exception($"Not enough keys for '{game.Title}'. Available: {availableKeys.Count}");

                var price = game.DiscountPrice ?? game.Price;
                totalAmount += price * quantity;
                orderDetails.Add(new OrderDetail
                {
                    GameId = gameId,
                    Quantity = quantity,
                    UnitPrice = price
                });
            }

            if (user.Wallet < totalAmount)
                throw new Exception("Insufficient wallet balance");

            user.Wallet -= totalAmount;
            await _userRepo.UpdateAsync(user);

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
            await _orderRepo.AddAsync(order);

            await transaction.CommitAsync();
            return order;
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task<Order> UpdateStatus(int orderId, string status)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            var order = await _orderRepo.GetOrderWithDetailsAsync(orderId)
                        ?? throw new Exception("Order not found");

            // Chặn chuyển sang trạng thái không hợp lệ
            if (order.Status == "Completed")
                throw new Exception("Cannot change status of a completed order");
            if (order.Status == "Cancelled")
                throw new Exception("Cannot change status of a cancelled order");

            if (status.Equals("Completed", StringComparison.OrdinalIgnoreCase) && order.Status != "Completed")
            {
                foreach (var detail in order.OrderDetails)
                {
                    var keys = await _gameKeyRepo.GetAvailableKeysAsync(detail.GameId, detail.Quantity);
                    if (keys.Count < detail.Quantity)
                        throw new Exception($"Not enough keys for game {detail.GameId}");

                    foreach (var key in keys)
                    {
                        key.IsUsed = true;
                        key.UsedAt = DateTime.UtcNow;
                        key.OrderDetailId = detail.Id;
                        await _gameKeyRepo.UpdateAsync(key);
                    }
                    // Thêm vào library, kiểm tra trùng để tránh duplicate key
                    for (int i = 0; i < detail.Quantity; i++)
                    {
                        bool alreadyOwned = await _libraryRepo.IsOwnedAsync(order.UserId, detail.GameId);
                        if (!alreadyOwned)
                        {
                            await _libraryRepo.AddAsync(new Library
                            {
                                UserId = order.UserId,
                                GameId = detail.GameId,
                                AcquiredAt = DateTime.UtcNow
                            });
                        }
                    }
                }
                await _notiRepo.AddAsync(new Notification
                {
                    UserId = order.UserId,
                    Title = "Đơn hàng đã được duyệt",
                    Message = $"Đơn hàng #{order.Id} đã được phê duyệt. Kiểm tra email để nhận key game.",
                    Link = $"/invoice/{order.Id}",
                    CreatedAt = DateTime.UtcNow
                });
            }
            else if (status.Equals("Cancelled", StringComparison.OrdinalIgnoreCase) && order.Status != "Cancelled")
            {
                var user = await _userRepo.GetByIdAsync(order.UserId);
                if (user != null && order.PaymentMethod.Equals("Wallet", StringComparison.OrdinalIgnoreCase))
                {
                    user.Wallet += order.TotalAmount;
                    await _userRepo.UpdateAsync(user);
                }
                await _notiRepo.AddAsync(new Notification
                {
                    UserId = order.UserId,
                    Title = "Đơn hàng đã bị hủy",
                    Message = $"Đơn hàng #{order.Id} đã bị hủy. Tiền đã được hoàn vào ví.",
                    Link = $"/invoice/{order.Id}",
                    CreatedAt = DateTime.UtcNow
                });
            }
            else
            {
                throw new Exception("Invalid status transition");
            }

            order.Status = status;
            await _orderRepo.UpdateAsync(order);
            await transaction.CommitAsync();
            return order;
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task CancelOrder(int orderId)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            var order = await _orderRepo.GetByIdAsync(orderId) ?? throw new Exception("Order not found");
            if (order.Status == "Completed")
                throw new Exception("Cannot cancel completed order");
            if (order.Status == "Cancelled")
                throw new Exception("Order already cancelled");

            var user = await _userRepo.GetByIdAsync(order.UserId);
            if (user != null)
            {
                user.Wallet += order.TotalAmount;
                await _userRepo.UpdateAsync(user);
            }
            order.Status = "Cancelled";
            await _orderRepo.UpdateAsync(order);
            await transaction.CommitAsync();
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }
}
