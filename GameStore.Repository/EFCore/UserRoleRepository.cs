// GameStore.Repository/EFCore/UserRoleRepository.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using GameStore.Entities.Users;

namespace GameStore.Repository.EFCore;

public class UserRoleRepository : Repository<UserRole>, IUserRoleRepository
{
    public UserRoleRepository(GameStoreDbContext context) : base(context) { }

    public async Task<UserRole?> GetActiveRoleByUserIdAsync(int userId) =>
        await _dbSet
            .Include(ur => ur.Role)
            .FirstOrDefaultAsync(ur => ur.UserId == userId && !ur.IsDeleted);

    public async Task AddRoleToUserAsync(int userId, int roleId)
    {
        var existing = await _dbSet
            .FirstOrDefaultAsync(ur => ur.UserId == userId && ur.RoleId == roleId);
        if (existing != null)
        {
            if (existing.IsDeleted) existing.IsDeleted = false;
        }
        else
        {
            await _dbSet.AddAsync(new UserRole
            {
                UserId = userId,
                RoleId = roleId,
                Guid = Guid.NewGuid(),
                CreatedBy = "system",
                Created = DateTime.UtcNow,
                ModifiedBy = "system",
                Modified = DateTime.UtcNow
            });
        }
        await _context.SaveChangesAsync();
    }
}
