// GameStore.Services/Admin/IAdminOrderService.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameStore.Entities.Store;

namespace GameStore.Services.Admin;

public interface IAdminOrderService
{
    Task<(IEnumerable<Order> Orders, int TotalCount)> GetOrdersAsync(
        string? keyword, DateTime? fromDate, DateTime? toDate, string? status,
        string? sortBy, bool desc, int page, int pageSize);
    Task UpdateOrderStatusAsync(int orderId, string status);
}
