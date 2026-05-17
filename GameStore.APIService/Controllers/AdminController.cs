// GameStore.APIService/Controllers/AdminController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using GameStore.DTOs.Admin;
using GameStore.Services.Admin;
using GameStore.Services; // For IGameService, IOrderService, INotificationService if needed

namespace GameStore.APIService.Controllers;

[Authorize(Roles = "Admin")]
[Route("api/admin")]
[ApiController]
public class AdminController : ControllerBase
{
    private readonly IAdminDashboardService _dashboardService;
    private readonly IAdminGameService _adminGameService;
    private readonly IAdminUserService _adminUserService;
    private readonly IAdminOrderService _adminOrderService;
    private readonly IAdminCategoryService _adminCategoryService;
    private readonly IAdminGameKeyService _adminGameKeyService;
    private readonly IAdminPaymentService _adminPaymentService;
    private readonly IAdminRoleService _adminRoleService;
    private readonly IAdminStaffService _adminStaffService;

    public AdminController(
        IAdminDashboardService dashboardService,
        IAdminGameService adminGameService,
        IAdminUserService adminUserService,
        IAdminOrderService adminOrderService,
        IAdminCategoryService adminCategoryService,
        IAdminGameKeyService adminGameKeyService,
        IAdminPaymentService adminPaymentService,
        IAdminRoleService adminRoleService,
        IAdminStaffService adminStaffService)
    {
        _dashboardService = dashboardService;
        _adminGameService = adminGameService;
        _adminUserService = adminUserService;
        _adminOrderService = adminOrderService;
        _adminCategoryService = adminCategoryService;
        _adminGameKeyService = adminGameKeyService;
        _adminPaymentService = adminPaymentService;
        _adminRoleService = adminRoleService;
        _adminStaffService = adminStaffService;
    }

    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboard() => Ok(await _dashboardService.GetDashboardAsync());

    // Games
    [HttpGet("games")]
    public async Task<IActionResult> GetGames([FromQuery] string? keyword, [FromQuery] int? genreId,
        [FromQuery] decimal? minPrice, [FromQuery] decimal? maxPrice, [FromQuery] string? sortBy,
        [FromQuery] bool desc = false, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        var (games, totalCount) = await _adminGameService.GetGamesAsync(keyword, genreId, minPrice, maxPrice, sortBy, desc, page, pageSize);
        return Ok(new { data = games, totalCount });
    }

    [HttpPost("games")]
    public async Task<IActionResult> CreateGame([FromBody] AdminGameCreateDto dto)
    {
        var game = await _adminGameService.CreateGameAsync(dto);
        return Ok(game);
    }

    [HttpPut("games/{id}")]
    public async Task<IActionResult> UpdateGame(int id, [FromBody] AdminGameUpdateDto dto)
    {
        await _adminGameService.UpdateGameAsync(id, dto);
        return Ok(new { message = "Game updated" });
    }

    [HttpDelete("games/{id}")]
    public async Task<IActionResult> DeleteGame(int id)
    {
        await _adminGameService.DeleteGameAsync(id);
        return Ok(new { message = "Game deleted" });
    }

    // Users
    [HttpGet("users")]
    public async Task<IActionResult> GetUsers([FromQuery] string? keyword,
        [FromQuery] bool? isActive, [FromQuery] DateTime? fromDate, [FromQuery] DateTime? toDate,
        [FromQuery] string? sortBy, [FromQuery] bool desc = false,
        [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        var (users, totalCount) = await _adminUserService.GetUsersAsync(keyword, isActive, fromDate, toDate, sortBy, desc, page, pageSize);
        return Ok(new { data = users, totalCount });
    }

    [HttpPut("users/{id}")]
    public async Task<IActionResult> UpdateUser(int id, [FromBody] AdminUserUpdateDto dto)
    {
        await _adminUserService.UpdateUserAsync(id, dto);
        return Ok(new { message = "User updated" });
    }

    [HttpDelete("users/{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        await _adminUserService.DeleteUserAsync(id);
        return Ok(new { message = "User deleted" });
    }

    // Orders
    [HttpGet("orders")]
    public async Task<IActionResult> GetOrders([FromQuery] string? keyword, [FromQuery] DateTime? fromDate,
        [FromQuery] DateTime? toDate, [FromQuery] string? status, [FromQuery] string? sortBy,
        [FromQuery] bool desc = false, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        var (orders, totalCount) = await _adminOrderService.GetOrdersAsync(keyword, fromDate, toDate, status, sortBy, desc, page, pageSize);
        return Ok(new { data = orders, totalCount });
    }

    [HttpPut("orders/{id}/status")]
    public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] AdminUpdateStatusDto dto)
    {
        await _adminOrderService.UpdateOrderStatusAsync(id, dto.Status);
        return Ok(new { message = "Status updated" });
    }

    // Categories
    [HttpGet("categories")]
    public async Task<IActionResult> GetCategories([FromQuery] string? keyword, [FromQuery] string? status,
        [FromQuery] bool? hasGames, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        return Ok(await _adminCategoryService.GetCategoriesAsync(keyword, status, hasGames, page, pageSize));
    }

    [HttpPost("categories")]
    public async Task<IActionResult> CreateCategory([FromBody] CategoryDto dto)
    {
        await _adminCategoryService.CreateCategoryAsync(dto);
        return Ok(new { message = "Category created" });
    }

    [HttpPut("categories/{id}")]
    public async Task<IActionResult> UpdateCategory(int id, [FromBody] CategoryDto dto)
    {
        await _adminCategoryService.UpdateCategoryAsync(id, dto);
        return Ok(new { message = "Category updated" });
    }

    [HttpDelete("categories/{id}")]
    public async Task<IActionResult> DeleteCategory(int id)
    {
        await _adminCategoryService.DeleteCategoryAsync(id);
        return Ok(new { message = "Category deleted" });
    }

    // Game Keys
    [HttpGet("gamekeys")]
    public async Task<IActionResult> GetGameKeys([FromQuery] string? keyword, [FromQuery] int? gameId,
        [FromQuery] string? status, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        return Ok(await _adminGameKeyService.GetGameKeysAsync(keyword, gameId, status, page, pageSize));
    }

    [HttpPost("gamekeys")]
    public async Task<IActionResult> CreateGameKey([FromBody] GameKeyDto dto)
    {
        await _adminGameKeyService.CreateGameKeyAsync(dto);
        return Ok(new { message = "Key created" });
    }

    [HttpPost("gamekeys/batch")]
    public async Task<IActionResult> CreateBatchGameKeys([FromBody] BatchGameKeyDto dto)
    {
        await _adminGameKeyService.CreateBatchGameKeysAsync(dto);
        return Ok(new { message = "Batch keys created" });
    }

    [HttpPut("gamekeys/{id}")]
    public async Task<IActionResult> UpdateGameKey(int id, [FromBody] UpdateGameKeyDto dto)
    {
        await _adminGameKeyService.UpdateGameKeyAsync(id, dto);
        return Ok(new { message = "Key updated" });
    }

    [HttpDelete("gamekeys/{id}")]
    public async Task<IActionResult> DeleteGameKey(int id)
    {
        await _adminGameKeyService.DeleteGameKeyAsync(id);
        return Ok(new { message = "Key deleted" });
    }

    // Payments
    [HttpGet("payments")]
    public async Task<IActionResult> GetPayments([FromQuery] string? keyword, [FromQuery] string? status,
        [FromQuery] string? method, [FromQuery] DateTime? fromDate, [FromQuery] DateTime? toDate,
        [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        return Ok(await _adminPaymentService.GetPaymentsAsync(keyword, status, method, fromDate, toDate, page, pageSize));
    }

    [HttpGet("payments/order/{orderId}")]
    public async Task<IActionResult> GetOrderPayments(int orderId)
    {
        return Ok(await _adminPaymentService.GetOrderPaymentsAsync(orderId));
    }

    [HttpPost("payments/refund/{paymentId}")]
    public async Task<IActionResult> RefundPayment(int paymentId, [FromBody] RefundDto? dto)
    {
        await _adminPaymentService.RefundPaymentAsync(paymentId, dto);
        return Ok(new { message = "Payment refunded" });
    }

    // Roles
    [HttpGet("roles")]
    public async Task<IActionResult> GetRoles([FromQuery] string? keyword, [FromQuery] bool? isActive,
        [FromQuery] bool? hasUsers, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        return Ok(await _adminRoleService.GetRolesAsync(keyword, isActive, hasUsers, page, pageSize));
    }

    [HttpPost("roles")]
    public async Task<IActionResult> CreateRole([FromBody] RoleDto dto)
    {
        await _adminRoleService.CreateRoleAsync(dto);
        return Ok(new { message = "Role created" });
    }

    [HttpPut("roles/{id}")]
    public async Task<IActionResult> UpdateRole(int id, [FromBody] RoleDto dto)
    {
        await _adminRoleService.UpdateRoleAsync(id, dto);
        return Ok(new { message = "Role updated" });
    }

    [HttpDelete("roles/{id}")]
    public async Task<IActionResult> DeleteRole(int id)
    {
        await _adminRoleService.DeleteRoleAsync(id);
        return Ok(new { message = "Role deleted" });
    }

    // Staff
    [HttpGet("staff")]
    public async Task<IActionResult> GetStaff([FromQuery] string? keyword, [FromQuery] int? roleId,
        [FromQuery] bool? isActive, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        return Ok(await _adminStaffService.GetStaffAsync(keyword, roleId, isActive, page, pageSize));
    }

    [HttpPost("staff/assign")]
    public async Task<IActionResult> AssignRole([FromBody] AssignRoleDto dto)
    {
        await _adminStaffService.AssignRoleAsync(dto);
        return Ok(new { message = "Role assigned" });
    }

    [HttpDelete("staff/revoke")]
    public async Task<IActionResult> RevokeRole([FromBody] AssignRoleDto dto)
    {
        await _adminStaffService.RevokeRoleAsync(dto);
        return Ok(new { message = "Role revoked" });
    }

    [HttpGet("permissions")]
    public IActionResult GetPermissions() => Ok(_adminRoleService.GetPermissions());
}
