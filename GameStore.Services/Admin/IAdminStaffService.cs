// GameStore.Services/Admin/IAdminStaffService.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameStore.DTOs.Admin;

namespace GameStore.Services.Admin;

public interface IAdminStaffService
{
    Task<object> GetStaffAsync(string? keyword, int? roleId, bool? isActive, int page, int pageSize);
    Task AssignRoleAsync(AssignRoleDto dto);
    Task RevokeRoleAsync(AssignRoleDto dto);
}
