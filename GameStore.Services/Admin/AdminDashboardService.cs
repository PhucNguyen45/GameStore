// GameStore.Services/Admin/AdminDashboardService.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameStore.Repository.EFCore;
using Microsoft.EntityFrameworkCore;

namespace GameStore.Services.Admin;

public class AdminDashboardService : IAdminDashboardService
{
    private readonly IGameRepository _gameRepo;
    private readonly IUserRepository _userRepo;
    private readonly IOrderRepository _orderRepo;

    public AdminDashboardService(
        IGameRepository gameRepo,
        IUserRepository userRepo,
        IOrderRepository orderRepo)
    {
        _gameRepo = gameRepo;
        _userRepo = userRepo;
        _orderRepo = orderRepo;
    }

    public async Task<object> GetDashboardAsync()
    {
        var totalGames = await _gameRepo.GetAllAsync().ContinueWith(t => t.Result.Count());
        var totalUsers = await _userRepo.GetAllAsync().ContinueWith(t => t.Result.Count());
        var allOrders = await _orderRepo.GetAllAsync();
        var totalOrders = allOrders.Count();
        var revenue = allOrders.Where(o => o.Status == "Completed").Sum(o => o.TotalAmount);

        var currentYear = DateTime.UtcNow.Year;
        var completedOrders = allOrders
            .Where(o => o.Status == "Completed" && o.OrderDate.Year == currentYear)
            .ToList();

        var monthlyRevenue = Enumerable.Range(0, 12).Select(m => new
        {
            month = m + 1,
            value = (double)completedOrders.Where(o => o.OrderDate.Month == m + 1).Sum(o => o.TotalAmount),
            count = completedOrders.Count(o => o.OrderDate.Month == m + 1)
        }).ToList();

        var recentOrders = allOrders
            .OrderByDescending(o => o.OrderDate)
            .Take(20)
            .Select(o => new
            {
                o.Id,
                o.UserId,
                username = o.User?.Username,
                o.TotalAmount,
                o.Status,
                o.PaymentMethod,
                o.OrderDate
            }).ToList();

        return new
        {
            totalGames,
            totalUsers,
            totalOrders,
            totalRevenue = revenue,
            monthlyRevenue,
            recentOrders
        };
    }
}
