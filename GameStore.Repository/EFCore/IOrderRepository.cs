using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameStore.Entities.Store;

namespace GameStore.Repository.EFCore;

public interface IOrderRepository : IRepository<Order>
{
    Task<List<Order>> GetByUserAsync(int userId);
}
