// GameStore.Services/Admin/AdminOrderService.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameStore.Entities.Store;
using GameStore.Repository.EFCore;
using GameStore.Services;

namespace GameStore.Services.Admin;

public class AdminOrderService : IAdminOrderService
{
    private readonly IOrderRepository _orderRepo;
    private readonly IOrderService _orderService;
    private readonly INotificationService _notificationService;

    public AdminOrderService(IOrderRepository orderRepo, IOrderService orderService,
        INotificationService notificationService)
    {
        _orderRepo = orderRepo;
        _orderService = orderService;
        _notificationService = notificationService;
    }

    public async Task<(IEnumerable<Order> Orders, int TotalCount)> GetOrdersAsync(
        string? keyword, DateTime? fromDate, DateTime? toDate, string? status,
        string? sortBy, bool desc, int page, int pageSize)
    {
        return await _orderRepo.SearchOrdersAsync(keyword, fromDate, toDate, status, page, pageSize);
    }

    public async Task UpdateOrderStatusAsync(int orderId, string status)
    {
        await _orderService.UpdateStatus(orderId, status);
        // Notify user nếu completed (đã có trong UpdateStatus)
    }
}
