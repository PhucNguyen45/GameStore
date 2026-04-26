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
        await _dbSet.Where(o => o.UserId == userId).OrderByDescending(o => o.OrderDate).ToListAsync();
}
