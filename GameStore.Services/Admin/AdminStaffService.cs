// GameStore.Services/Admin/AdminStaffService.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameStore.DTOs.Admin;
using GameStore.Repository.EFCore;

namespace GameStore.Services.Admin;

public class AdminStaffService : IAdminStaffService
{
    private readonly IAdminRepository _adminRepo;

    public AdminStaffService(IAdminRepository adminRepo) => _adminRepo = adminRepo;

    public async Task<object> GetStaffAsync(string? keyword, int? roleId, bool? isActive, int page, int pageSize)
    {
        var (users, totalCount) = await _adminRepo.GetStaffUsersAsync(keyword, roleId, isActive, page, pageSize);
        var data = users.Select(u => new
        {
            u.Id,
            u.Username,
            u.DisplayName,
            u.Email,
            u.IsActive,
            u.CreatedAt,
            roles = u.UserRoles.Where(ur => !ur.IsDeleted).Select(ur => new { ur.RoleId, roleName = ur.Role?.Name }).ToList()
        }).ToList();
        return new { data, totalCount };
    }

    public Task AssignRoleAsync(AssignRoleDto dto) => _adminRepo.AssignRoleAsync(dto.UserId, dto.RoleId);
    public Task RevokeRoleAsync(AssignRoleDto dto) => _adminRepo.RevokeRoleAsync(dto.UserId, dto.RoleId);
}
