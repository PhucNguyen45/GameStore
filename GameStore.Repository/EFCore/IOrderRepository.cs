// GameStore.Repository/EFCore/IOrderRepository.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameStore.Entities.Store;

namespace GameStore.Repository.EFCore;

public interface IOrderRepository : IRepository<Order>
{
    Task<List<Order>> GetByUserAsync(int userId);
    Task<List<Order>> GetByUserWithDetailsAsync(int userId);  // thêm
    Task<(List<Order> Orders, int TotalCount)> SearchOrdersAsync(
        string? keyword, DateTime? fromDate, DateTime? toDate,
        string? status, int page, int pageSize);
    Task<Order?> GetOrderWithDetailsAsync(int orderId);
}
