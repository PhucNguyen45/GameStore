// GameStore.Services/Admin/AdminUserService.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameStore.DTOs.Admin;
using GameStore.Entities.Users;
using GameStore.Repository.EFCore;
using GameStore.Services.Authen;

namespace GameStore.Services.Admin;

public class AdminUserService : IAdminUserService
{
    private readonly IUserRepository _userRepo;
    private readonly IUserService _userService;

    public AdminUserService(IUserRepository userRepo, IUserService userService)
    {
        _userRepo = userRepo;
        _userService = userService;
    }

    public async Task<(IEnumerable<User> Users, int TotalCount)> GetUsersAsync(
        string? keyword, bool? isActive, DateTime? fromDate, DateTime? toDate,
        string? sortBy, bool desc, int page, int pageSize)
    {
        return await _userRepo.AdminSearchAsync(keyword, isActive, fromDate, toDate, sortBy, desc, page, pageSize);
    }

    public async Task UpdateUserAsync(int id, AdminUserUpdateDto dto)
    {
        var user = await _userService.GetById(id) ?? throw new Exception("User not found");
        user.DisplayName = dto.DisplayName ?? user.DisplayName;
        user.Email = dto.Email ?? user.Email;
        if (dto.Phone != null) user.Phone = dto.Phone;
        if (dto.AvatarUrl != null) user.AvatarUrl = dto.AvatarUrl;
        if (dto.Wallet.HasValue) user.Wallet = dto.Wallet.Value;
        if (dto.IsActive.HasValue) user.IsActive = dto.IsActive.Value;
        await _userService.Update(user);
    }

    public async Task DeleteUserAsync(int id)
    {
        await _userService.Delete(id);
    }
}
