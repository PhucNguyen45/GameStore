// GameStore.Services/IAdminService.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameStore.DTOs.Admin;
using GameStore.Entities.Games;
using GameStore.Entities.Store;
using GameStore.Entities.Users;

namespace GameStore.Services;

public interface IAdminService
{
    // Dashboard
    Task<object> GetDashboardAsync();

    // Games
    Task<(IEnumerable<Game> Games, int TotalCount)> GetGamesAsync(
        string? keyword, int? genreId, decimal? minPrice, decimal? maxPrice,
        string? sortBy, bool desc, int page, int pageSize);
    Task<Game> CreateGameAsync(AdminGameCreateDto dto);
    Task UpdateGameAsync(int id, AdminGameUpdateDto dto);
    Task DeleteGameAsync(int id);

    // Users
    Task<(IEnumerable<User> Users, int TotalCount)> GetUsersAsync(
        string? keyword, bool? isActive, DateTime? fromDate, DateTime? toDate,
        string? sortBy, bool desc, int page, int pageSize);
    Task UpdateUserAsync(int id, AdminUserUpdateDto dto);
    Task DeleteUserAsync(int id);

    // Orders
    Task<(IEnumerable<Order> Orders, int TotalCount)> GetOrdersAsync(
        string? keyword, DateTime? fromDate, DateTime? toDate, string? status,
        string? sortBy, bool desc, int page, int pageSize);
    Task UpdateOrderStatusAsync(int orderId, string status);

    // Categories (Genres)
    Task<object> GetCategoriesAsync(string? keyword, string? status, bool? hasGames, int page, int pageSize);
    Task CreateCategoryAsync(CategoryDto dto);
    Task UpdateCategoryAsync(int id, CategoryDto dto);
    Task DeleteCategoryAsync(int id);

    // Game Keys
    Task<object> GetGameKeysAsync(string? keyword, int? gameId, string? status, int page, int pageSize);
    Task CreateGameKeyAsync(GameKeyDto dto);
    Task CreateBatchGameKeysAsync(BatchGameKeyDto dto);
    Task UpdateGameKeyAsync(int id, UpdateGameKeyDto dto);
    Task DeleteGameKeyAsync(int id);

    // Payments
    Task<object> GetPaymentsAsync(string? keyword, string? status, string? method,
        DateTime? fromDate, DateTime? toDate, int page, int pageSize);
    Task<object> GetOrderPaymentsAsync(int orderId);
    Task RefundPaymentAsync(int paymentId, RefundDto? dto);

    // Roles
    Task<object> GetRolesAsync(string? keyword, bool? isActive, bool? hasUsers, int page, int pageSize);
    Task CreateRoleAsync(RoleDto dto);
    Task UpdateRoleAsync(int id, RoleDto dto);
    Task DeleteRoleAsync(int id);

    // Staff
    Task<object> GetStaffAsync(string? keyword, int? roleId, bool? isActive, int page, int pageSize);
    Task AssignRoleAsync(AssignRoleDto dto);
    Task RevokeRoleAsync(AssignRoleDto dto);

    // Permissions
    IEnumerable<string> GetPermissions();
}
