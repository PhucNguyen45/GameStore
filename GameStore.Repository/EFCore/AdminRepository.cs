// GameStore.Repository/EFCore/AdminRepository.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using GameStore.Entities.Auth;
using GameStore.Entities.Store;
using GameStore.Entities.Users;

namespace GameStore.Repository.EFCore;

public class AdminRepository : IAdminRepository
{
    private readonly GameStoreDbContext _context;

    public AdminRepository(GameStoreDbContext context)
    {
        _context = context;
    }

    // ---- Roles ----
    public async Task<(List<Role> Roles, int TotalCount)> GetRolesAsync(string? keyword, bool? isActive, bool? hasUsers,
        int page, int pageSize)
    {
        var query = _context.Roles.Where(r => !r.IsDeleted).AsQueryable();
        if (!string.IsNullOrEmpty(keyword))
            query = query.Where(r => r.Name.Contains(keyword) || r.Description.Contains(keyword));
        if (isActive.HasValue)
            query = query.Where(r => r.IsActive == isActive.Value);
        if (hasUsers == true)
            query = query.Where(r => _context.UserRoles.Any(ur => ur.RoleId == r.Id && !ur.IsDeleted));
        else if (hasUsers == false)
            query = query.Where(r => !_context.UserRoles.Any(ur => ur.RoleId == r.Id && !ur.IsDeleted));

        var totalCount = await query.CountAsync();
        var roles = await query.OrderBy(r => r.Name)
                               .Skip((page - 1) * pageSize)
                               .Take(pageSize)
                               .ToListAsync();
        return (roles, totalCount);
    }

    public async Task<(List<(Role Role, int UserCount)> RolesWithCount, int TotalCount)> GetRolesWithUserCountAsync(
        string? keyword, bool? isActive, bool? hasUsers, int page, int pageSize)
    {
        var query = _context.Roles.Where(r => !r.IsDeleted).AsQueryable();
        if (!string.IsNullOrEmpty(keyword))
            query = query.Where(r => r.Name.Contains(keyword) || r.Description.Contains(keyword));
        if (isActive.HasValue)
            query = query.Where(r => r.IsActive == isActive.Value);
        if (hasUsers == true)
            query = query.Where(r => _context.UserRoles.Any(ur => ur.RoleId == r.Id && !ur.IsDeleted));
        else if (hasUsers == false)
            query = query.Where(r => !_context.UserRoles.Any(ur => ur.RoleId == r.Id && !ur.IsDeleted));

        var totalCount = await query.CountAsync();
        var roles = await query.OrderBy(r => r.Name)
                               .Skip((page - 1) * pageSize)
                               .Take(pageSize)
                               .ToListAsync();

        var roleIds = roles.Select(r => r.Id).ToList();
        var userCounts = await _context.UserRoles
            .Where(ur => roleIds.Contains(ur.RoleId) && !ur.IsDeleted)
            .GroupBy(ur => ur.RoleId)
            .Select(g => new { RoleId = g.Key, Count = g.Count() })
            .ToListAsync();

        var result = roles.Select(r => (
            r,
            userCounts.FirstOrDefault(uc => uc.RoleId == r.Id)?.Count ?? 0
        )).ToList();

        return (result, totalCount);
    }

    public async Task<Role?> GetRoleByIdAsync(int id) =>
        await _context.Roles.Include(r => r.RolePermissions)
                           .FirstOrDefaultAsync(r => r.Id == id && !r.IsDeleted);

    public async Task<bool> RoleExistsAsync(string name, int? excludeId = null) =>
        await _context.Roles.AnyAsync(r => r.Name == name && !r.IsDeleted &&
                                          (!excludeId.HasValue || r.Id != excludeId.Value));

    public async Task<Role> AddRoleAsync(Role role)
    {
        _context.Roles.Add(role);
        await _context.SaveChangesAsync();
        return role;
    }

    public async Task UpdateRoleAsync(Role role)
    {
        _context.Roles.Update(role);
        await _context.SaveChangesAsync();
    }

    public async Task SoftDeleteRoleAsync(int id)
    {
        var role = await _context.Roles.FindAsync(id);
        if (role != null)
        {
            role.IsDeleted = true;
            role.Modified = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }
    }

    public async Task AddRolePermissionsAsync(int roleId, List<string> permissions)
    {
        foreach (var perm in permissions)
            _context.RolePermissions.Add(new RolePermission { RoleId = roleId, Permission = perm });
        await _context.SaveChangesAsync();
    }

    public async Task RemoveAllRolePermissionsAsync(int roleId)
    {
        var perms = await _context.RolePermissions.Where(rp => rp.RoleId == roleId).ToListAsync();
        _context.RolePermissions.RemoveRange(perms);
        await _context.SaveChangesAsync();
    }

    public async Task<int> GetUserCountInRoleAsync(int roleId) =>
        await _context.UserRoles.CountAsync(ur => ur.RoleId == roleId && !ur.IsDeleted);

    // ---- Staff ----
    public async Task<(List<User> Users, int TotalCount)> GetStaffUsersAsync(string? keyword, int? roleId, bool? isActive,
        int page, int pageSize)
    {
        var query = _context.Users
            .Where(u => u.UserRoles.Any(ur => !ur.IsDeleted && ur.Role.Name != "User"))
            .AsQueryable();
        if (roleId.HasValue)
            query = query.Where(u => u.UserRoles.Any(ur => ur.RoleId == roleId.Value && !ur.IsDeleted));
        if (!string.IsNullOrEmpty(keyword))
            query = query.Where(u => u.Username.Contains(keyword) ||
                                     u.DisplayName.Contains(keyword) ||
                                     u.Email.Contains(keyword));
        if (isActive.HasValue)
            query = query.Where(u => u.IsActive == isActive.Value);

        var totalCount = await query.CountAsync();
        var users = await query.OrderBy(u => u.Username)
                               .Skip((page - 1) * pageSize)
                               .Take(pageSize)
                               .Include(u => u.UserRoles)
                                   .ThenInclude(ur => ur.Role)
                               .ToListAsync();
        return (users, totalCount);
    }

    public async Task AssignRoleAsync(int userId, int roleId)
    {
        var existing = await _context.UserRoles
            .FirstOrDefaultAsync(ur => ur.UserId == userId && ur.RoleId == roleId);
        if (existing != null)
        {
            if (existing.IsDeleted) existing.IsDeleted = false;
            existing.Modified = DateTime.UtcNow;
        }
        else
        {
            _context.UserRoles.Add(new UserRole
            {
                UserId = userId,
                RoleId = roleId,
                Guid = Guid.NewGuid(),
                CreatedBy = "admin",
                Created = DateTime.UtcNow,
                ModifiedBy = "admin",
                Modified = DateTime.UtcNow
            });
        }
        await _context.SaveChangesAsync();
    }

    public async Task RevokeRoleAsync(int userId, int roleId)
    {
        var userRole = await _context.UserRoles
            .FirstOrDefaultAsync(ur => ur.UserId == userId && ur.RoleId == roleId && !ur.IsDeleted);
        if (userRole != null)
        {
            userRole.IsDeleted = true;
            userRole.Modified = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }
    }
}
