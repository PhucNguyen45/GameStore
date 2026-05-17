// GameStore.Services/Admin/IAdminUserService.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameStore.DTOs.Admin;
using GameStore.Entities.Users;

namespace GameStore.Services.Admin;

public interface IAdminUserService
{
    Task<(IEnumerable<User> Users, int TotalCount)> GetUsersAsync(
        string? keyword, bool? isActive, DateTime? fromDate, DateTime? toDate,
        string? sortBy, bool desc, int page, int pageSize);
    Task UpdateUserAsync(int id, AdminUserUpdateDto dto);
    Task DeleteUserAsync(int id);
}
