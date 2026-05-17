// GameStore.Services/Admin/IAdminRoleService.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameStore.DTOs.Admin;

namespace GameStore.Services.Admin;

public interface IAdminRoleService
{
    Task<object> GetRolesAsync(string? keyword, bool? isActive, bool? hasUsers, int page, int pageSize);
    Task CreateRoleAsync(RoleDto dto);
    Task UpdateRoleAsync(int id, RoleDto dto);
    Task DeleteRoleAsync(int id);
    IEnumerable<string> GetPermissions();
}
