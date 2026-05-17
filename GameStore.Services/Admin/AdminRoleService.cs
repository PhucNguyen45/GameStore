// GameStore.Services/Admin/AdminRoleService.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameStore.DTOs.Admin;
using GameStore.Entities.Auth;
using GameStore.Repository.EFCore;

namespace GameStore.Services.Admin;

public class AdminRoleService : IAdminRoleService
{
    private readonly IAdminRepository _adminRepo;

    public AdminRoleService(IAdminRepository adminRepo) => _adminRepo = adminRepo;

    public async Task<object> GetRolesAsync(string? keyword, bool? isActive, bool? hasUsers, int page, int pageSize)
    {
        var (rolesWithCount, totalCount) = await _adminRepo.GetRolesWithUserCountAsync(keyword, isActive, hasUsers, page, pageSize);
        var data = rolesWithCount.Select(r => new
        {
            r.Role.Id,
            r.Role.Name,
            r.Role.Description,
            r.Role.IsActive,
            r.Role.Created,
            userCount = r.UserCount,
            permissions = r.Role.RolePermissions.Select(rp => rp.Permission).ToList()
        }).ToList();
        return new { data, totalCount };
    }

    public async Task CreateRoleAsync(RoleDto dto)
    {
        if (await _adminRepo.RoleExistsAsync(dto.Name))
            throw new Exception("Role name already exists");

        var role = new Role
        {
            Name = dto.Name,
            Description = dto.Description ?? "",
            IsActive = true,
            Guid = Guid.NewGuid(),
            CreatedBy = "admin",
            Created = DateTime.UtcNow,
            ModifiedBy = "admin",
            Modified = DateTime.UtcNow
        };
        role = await _adminRepo.AddRoleAsync(role);

        if (dto.Permissions != null && dto.Permissions.Any())
            await _adminRepo.AddRolePermissionsAsync(role.Id, dto.Permissions);
    }

    public async Task UpdateRoleAsync(int id, RoleDto dto)
    {
        var role = await _adminRepo.GetRoleByIdAsync(id) ?? throw new Exception("Role not found");
        if (await _adminRepo.RoleExistsAsync(dto.Name, excludeId: id))
            throw new Exception("Role name already exists");

        role.Name = dto.Name;
        role.Description = dto.Description ?? "";
        role.IsActive = dto.IsActive;
        role.ModifiedBy = "admin";
        role.Modified = DateTime.UtcNow;
        await _adminRepo.UpdateRoleAsync(role);

        await _adminRepo.RemoveAllRolePermissionsAsync(id);
        if (dto.Permissions != null)
            await _adminRepo.AddRolePermissionsAsync(id, dto.Permissions);
    }

    public async Task DeleteRoleAsync(int id)
    {
        var role = await _adminRepo.GetRoleByIdAsync(id) ?? throw new Exception("Role not found");
        if (role.Name == "Admin" || role.Name == "User")
            throw new Exception("Cannot delete built-in roles");

        var userCount = await _adminRepo.GetUserCountInRoleAsync(id);
        if (userCount > 0)
            throw new Exception($"Cannot delete: {userCount} users have this role");

        await _adminRepo.SoftDeleteRoleAsync(id);
    }

    public IEnumerable<string> GetPermissions() => new[]
    {
        "games.view", "games.create", "games.edit", "games.delete",
        "users.view", "users.edit", "users.ban",
        "orders.view", "orders.edit",
        "categories.view", "categories.create", "categories.edit", "categories.delete",
        "gamekeys.view", "gamekeys.create", "gamekeys.delete",
        "payments.view", "payments.refund",
        "roles.view", "roles.create", "roles.edit", "roles.delete",
        "staff.view", "staff.assign"
    };
}
