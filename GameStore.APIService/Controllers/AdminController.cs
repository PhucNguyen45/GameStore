// GameStore.APIService/Controllers/AdminController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GameStore.Repository;
using GameStore.Services;
using GameStore.Entities.Games;
using GameStore.DTOs.Admin;

namespace GameStore.APIService.Controllers;

[Authorize(Roles = "Admin")]
[Route("api/admin")]
[ApiController]
public class AdminController : ControllerBase
{
    private readonly IAdminService _adminService;

    public AdminController(IAdminService adminService) => _adminService = adminService;

    // Dashboard
    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboard() => Ok(await _adminService.GetDashboardAsync());

    // Games Admin
    [HttpGet("games")]
    public async Task<IActionResult> GetGames([FromQuery] string? keyword, [FromQuery] int? genreId,
        [FromQuery] decimal? minPrice, [FromQuery] decimal? maxPrice, [FromQuery] string? sortBy,
        [FromQuery] bool desc = false, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        var (games, totalCount) = await _adminService.GetGamesAsync(keyword, genreId, minPrice, maxPrice, sortBy, desc, page, pageSize);
        return Ok(new { data = games, totalCount });
    }

    [HttpPost("games")]
    public async Task<IActionResult> CreateGame([FromBody] AdminGameCreateDto dto)
    {
        var game = await _adminService.CreateGameAsync(dto);
        return Ok(game);
    }

    [HttpPut("games/{id}")]
    public async Task<IActionResult> UpdateGame(int id, [FromBody] AdminGameUpdateDto dto)
    {
        await _adminService.UpdateGameAsync(id, dto);
        return Ok(new { message = "Game updated" });
    }

    [HttpDelete("games/{id}")]
    public async Task<IActionResult> DeleteGame(int id)
    {
        await _adminService.DeleteGameAsync(id);
        return Ok(new { message = "Game deleted" });
    }

    // Users
    [HttpGet("users")]
    public async Task<IActionResult> GetUsers([FromQuery] string? keyword,
        [FromQuery] bool? isActive, [FromQuery] DateTime? fromDate, [FromQuery] DateTime? toDate,
        [FromQuery] string? sortBy, [FromQuery] bool desc = false,
        [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        var (users, totalCount) = await _adminService.GetUsersAsync(keyword, isActive, fromDate, toDate, sortBy, desc, page, pageSize);
        return Ok(new { data = users, totalCount });
    }

    [HttpPut("users/{id}")]
    public async Task<IActionResult> UpdateUser(int id, [FromBody] AdminUserUpdateDto dto)
    {
        await _adminService.UpdateUserAsync(id, dto);
        return Ok(new { message = "User updated" });
    }

    [HttpDelete("users/{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        await _adminService.DeleteUserAsync(id);
        return Ok(new { message = "User deleted" });
    }

    // Orders
    [HttpGet("orders")]
    public async Task<IActionResult> GetOrders([FromQuery] string? keyword, [FromQuery] DateTime? fromDate,
        [FromQuery] DateTime? toDate, [FromQuery] string? status, [FromQuery] string? sortBy,
        [FromQuery] bool desc = false, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        var (orders, totalCount) = await _adminService.GetOrdersAsync(keyword, fromDate, toDate, status, sortBy, desc, page, pageSize);
        return Ok(new { data = orders, totalCount });
    }

    [HttpPut("orders/{id}/status")]
    public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] AdminUpdateStatusDto dto)
    {
        await _adminService.UpdateOrderStatusAsync(id, dto.Status);
        return Ok(new { message = "Status updated" });
    }

    // Categories
    [HttpGet("categories")]
    public async Task<IActionResult> GetCategories([FromQuery] string? keyword, [FromQuery] string? status,
        [FromQuery] bool? hasGames, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        return Ok(await _adminService.GetCategoriesAsync(keyword, status, hasGames, page, pageSize));
    }

    [HttpPost("categories")]
    public async Task<IActionResult> CreateCategory([FromBody] CategoryDto dto)
    {
        await _adminService.CreateCategoryAsync(dto);
        return Ok(new { message = "Category created" });
    }

    [HttpPut("categories/{id}")]
    public async Task<IActionResult> UpdateCategory(int id, [FromBody] CategoryDto dto)
    {
        await _adminService.UpdateCategoryAsync(id, dto);
        return Ok(new { message = "Category updated" });
    }

    [HttpDelete("categories/{id}")]
    public async Task<IActionResult> DeleteCategory(int id)
    {
        await _adminService.DeleteCategoryAsync(id);
        return Ok(new { message = "Category deleted" });
    }

    // Game Keys
    [HttpGet("gamekeys")]
    public async Task<IActionResult> GetGameKeys([FromQuery] string? keyword, [FromQuery] int? gameId,
        [FromQuery] string? status, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        return Ok(await _adminService.GetGameKeysAsync(keyword, gameId, status, page, pageSize));
    }

    [HttpPost("gamekeys")]
    public async Task<IActionResult> CreateGameKey([FromBody] GameKeyDto dto)
    {
        await _adminService.CreateGameKeyAsync(dto);
        return Ok(new { message = "Key created" });
    }

    [HttpPost("gamekeys/batch")]
    public async Task<IActionResult> CreateBatchGameKeys([FromBody] BatchGameKeyDto dto)
    {
        await _adminService.CreateBatchGameKeysAsync(dto);
        return Ok(new { message = "Batch keys created" });
    }

    [HttpPut("gamekeys/{id}")]
    public async Task<IActionResult> UpdateGameKey(int id, [FromBody] UpdateGameKeyDto dto)
    {
        await _adminService.UpdateGameKeyAsync(id, dto);
        return Ok(new { message = "Key updated" });
    }

    [HttpDelete("gamekeys/{id}")]
    public async Task<IActionResult> DeleteGameKey(int id)
    {
        await _adminService.DeleteGameKeyAsync(id);
        return Ok(new { message = "Key deleted" });
    }

    // Payments
    [HttpGet("payments")]
    public async Task<IActionResult> GetPayments([FromQuery] string? keyword, [FromQuery] string? status,
        [FromQuery] string? method, [FromQuery] DateTime? fromDate, [FromQuery] DateTime? toDate,
        [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        return Ok(await _adminService.GetPaymentsAsync(keyword, status, method, fromDate, toDate, page, pageSize));
    }

    [HttpGet("payments/order/{orderId}")]
    public async Task<IActionResult> GetOrderPayments(int orderId)
    {
        return Ok(await _adminService.GetOrderPaymentsAsync(orderId));
    }

    [HttpPost("payments/refund/{paymentId}")]
    public async Task<IActionResult> RefundPayment(int paymentId, [FromBody] RefundDto? dto)
    {
        await _adminService.RefundPaymentAsync(paymentId, dto);
        return Ok(new { message = "Payment refunded" });
    }

    // Roles
    [HttpGet("roles")]
    public async Task<IActionResult> GetRoles([FromQuery] string? keyword, [FromQuery] bool? isActive,
        [FromQuery] bool? hasUsers, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        return Ok(await _adminService.GetRolesAsync(keyword, isActive, hasUsers, page, pageSize));
    }

    [HttpPost("roles")]
    public async Task<IActionResult> CreateRole([FromBody] RoleDto dto)
    {
        await _adminService.CreateRoleAsync(dto);
        return Ok(new { message = "Role created" });
    }

    [HttpPut("roles/{id}")]
    public async Task<IActionResult> UpdateRole(int id, [FromBody] RoleDto dto)
    {
        await _adminService.UpdateRoleAsync(id, dto);
        return Ok(new { message = "Role updated" });
    }

    [HttpDelete("roles/{id}")]
    public async Task<IActionResult> DeleteRole(int id)
    {
        await _adminService.DeleteRoleAsync(id);
        return Ok(new { message = "Role deleted" });
    }

    // Staff
    [HttpGet("staff")]
    public async Task<IActionResult> GetStaff([FromQuery] string? keyword, [FromQuery] int? roleId,
        [FromQuery] bool? isActive, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        return Ok(await _adminService.GetStaffAsync(keyword, roleId, isActive, page, pageSize));
    }

    [HttpPost("staff/assign")]
    public async Task<IActionResult> AssignRole([FromBody] AssignRoleDto dto)
    {
        await _adminService.AssignRoleAsync(dto);
        return Ok(new { message = "Role assigned" });
    }

    [HttpPost("staff/revoke")]
    public async Task<IActionResult> RevokeRole([FromBody] AssignRoleDto dto)
    {
        await _adminService.RevokeRoleAsync(dto);
        return Ok(new { message = "Role revoked" });
    }

    [HttpGet("permissions")]
    public IActionResult GetPermissions()
    {
        return Ok(_adminService.GetPermissions());
    }
}
