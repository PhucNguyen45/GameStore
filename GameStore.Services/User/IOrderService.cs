// GameStore.Services/IOrderService.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameStore.Entities.Store;
using GameStore.DTOs.Orders;

namespace GameStore.Services;

public interface IOrderService
{
    Task<Order?> GetById(int id);
    Task<List<Order>> GetByUser(int userId);
    Task<(List<Order> Items, int TotalCount)> GetAll(int page, int pageSize);

    // Đồng bộ signature với DTO checkout (có email, phone, paymentMethod)
    Task<Order> CreateOrder(int userId, List<(int GameId, int Quantity)> items, string paymentMethod = "Wallet", string? email = null, string? phone = null);

    Task<Order> UpdateStatus(int orderId, string status);
    Task CancelOrder(int orderId);

    // Thêm method lịch sử mua hàng
    Task<List<OrderHistoryDto>> GetOrderHistoryAsync(int userId);
}
