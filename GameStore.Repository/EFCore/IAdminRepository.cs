// GameStore.Repository/EFCore/IAdminRepository.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameStore.Entities.Auth;
using GameStore.Entities.Store;
using GameStore.Entities.Users;

namespace GameStore.Repository.EFCore;

public interface IAdminRepository
{
    // Roles
    Task<(List<Role> Roles, int TotalCount)> GetRolesAsync(string? keyword, bool? isActive, bool? hasUsers,
        int page, int pageSize);
    Task<Role?> GetRoleByIdAsync(int id);
    Task<bool> RoleExistsAsync(string name, int? excludeId = null);
    Task<Role> AddRoleAsync(Role role);
    Task UpdateRoleAsync(Role role);
    Task SoftDeleteRoleAsync(int id);
    Task AddRolePermissionsAsync(int roleId, List<string> permissions);
    Task RemoveAllRolePermissionsAsync(int roleId);
    Task<int> GetUserCountInRoleAsync(int roleId);
    Task<(List<(Role Role, int UserCount)> RolesWithCount, int TotalCount)> GetRolesWithUserCountAsync(
        string? keyword, bool? isActive, bool? hasUsers, int page, int pageSize);

    // Staff
    Task<(List<User> Users, int TotalCount)> GetStaffUsersAsync(string? keyword, int? roleId, bool? isActive,
        int page, int pageSize);
    Task AssignRoleAsync(int userId, int roleId);
    Task RevokeRoleAsync(int userId, int roleId);
}
