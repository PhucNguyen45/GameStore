using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using GameStore.Entities.Auth;

namespace GameStore.Repository.EFCore;

public class RoleRepository : Repository<Role>, IRoleRepository
{
    public RoleRepository(GameStoreDbContext context) : base(context) { }

    public async Task<Role?> GetByNameAsync(string name) =>
        await _dbSet.FirstOrDefaultAsync(r => r.Name == name && !r.IsDeleted);
}
