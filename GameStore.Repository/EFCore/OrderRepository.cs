// GameStore.Repository/EFCore/OrderRepository.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using GameStore.Entities.Store;

namespace GameStore.Repository.EFCore;

public class OrderRepository : Repository<Order>, IOrderRepository
{
    public OrderRepository(GameStoreDbContext context) : base(context) { }

    public async Task<List<Order>> GetByUserAsync(int userId) =>
        await _dbSet.Where(o => o.UserId == userId)
                    .OrderByDescending(o => o.OrderDate)
                    .ToListAsync();

    public async Task<List<Order>> GetByUserWithDetailsAsync(int userId) =>
        await _dbSet.Where(o => o.UserId == userId)
                    .Include(o => o.OrderDetails)
                        .ThenInclude(od => od.Game)
                    .OrderByDescending(o => o.OrderDate)
                    .ToListAsync();

    public async Task<(List<Order> Orders, int TotalCount)> SearchOrdersAsync(
        string? keyword, DateTime? fromDate, DateTime? toDate,
        string? status, int page, int pageSize)
    {
        var query = _dbSet.Include(o => o.User).AsQueryable();

        if (!string.IsNullOrEmpty(keyword))
        {
            var isNumeric = int.TryParse(keyword, out int orderId);
            query = query.Where(o => o.User.Username.Contains(keyword) ||
                                     (isNumeric && o.Id == orderId));
        }
        if (fromDate.HasValue)
            query = query.Where(o => o.OrderDate >= fromDate.Value);
        if (toDate.HasValue)
            query = query.Where(o => o.OrderDate <= toDate.Value);
        if (!string.IsNullOrEmpty(status))
            query = query.Where(o => o.Status == status);

        int totalCount = await query.CountAsync();
        var orders = await query.OrderByDescending(o => o.OrderDate)
                                .Skip((page - 1) * pageSize)
                                .Take(pageSize)
                                .ToListAsync();
        return (orders, totalCount);
    }

    public async Task<Order?> GetOrderWithDetailsAsync(int orderId) =>
        await _dbSet.Include(o => o.OrderDetails)
                        .ThenInclude(od => od.Game)
                    .Include(o => o.OrderDetails)
                        .ThenInclude(od => od.GameKeys)
                    .FirstOrDefaultAsync(o => o.Id == orderId);
}
