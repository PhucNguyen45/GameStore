// GameStore.AuthService/Controllers/UserController.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using GameStore.Services.Authen;
using GameStore.DTOs.Users;
using GameStore.DTOs.Common;

namespace GameStore.AuthService.Controllers;

[Route("api/users")]
[ApiController]
[Authorize]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;

    public UserController(IUserService userService) => _userService = userService;

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAll([FromQuery] string? keyword, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        var (users, totalCount) = await _userService.Search(keyword, page, pageSize);
        var mappedUsers = users.Select(u => new { u.Id, u.Username, u.DisplayName, u.Email, u.Wallet, u.IsActive, u.CreatedAt }).ToList();
        return Ok(PagedResponse<object>.Create(mappedUsers, totalCount, page, pageSize));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        if (!User.IsInRole("Admin") && id != currentUserId)
            return Forbid();

        var user = await _userService.GetById(id);
        if (user == null) return NotFound(new { message = "User not found" });
        return Ok(new { user.Id, user.Username, user.DisplayName, user.Email, user.Phone, user.AvatarUrl, user.Wallet, user.IsActive, user.CreatedAt });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateUserRequest request)
    {
        var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        if (!User.IsInRole("Admin") && id != currentUserId)
            return Forbid();

        var user = await _userService.GetById(id);
        if (user == null) return NotFound(new { message = "User not found" });
        user.DisplayName = request.DisplayName ?? user.DisplayName;
        user.Email = request.Email ?? user.Email;
        user.Phone = request.Phone ?? user.Phone;
        user.AvatarUrl = !string.IsNullOrEmpty(request.AvatarUrl) ? request.AvatarUrl : user.AvatarUrl;
        try
        {
            await _userService.Update(user, request.Password, request.CurrentPassword);
            return Ok(new { message = "User updated" });
        }
        catch (UnauthorizedAccessException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        await _userService.Delete(id);
        return Ok(new { message = "User deactivated" });
    }

    [HttpGet("wallet")]
    public async Task<IActionResult> GetWallet()
    {
        var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);
        var balance = await _userService.GetWalletBalance(userId);
        return Ok(new { balance });
    }

    [HttpPost("wallet/topup")]
    public async Task<IActionResult> TopUp([FromBody] TopUpRequest request)
    {
        if (request.Amount <= 0) return BadRequest(new { message = "Amount must be positive" });
        var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);
        await _userService.AddToWallet(userId, request.Amount);
        var balance = await _userService.GetWalletBalance(userId);
        return Ok(new { message = "Wallet topped up", balance });
    }

    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var user = await _userService.GetById(userId);
        if (user == null) return NotFound();
        return Ok(new { user.Id, user.Username, user.DisplayName, user.Email, user.Phone, user.AvatarUrl, user.Wallet, user.IsActive, user.CreatedAt });
    }

    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateUserRequest request)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var user = await _userService.GetById(userId);
        if (user == null) return NotFound(new { message = "User not found" });

        user.DisplayName = request.DisplayName ?? user.DisplayName;
        user.Email = request.Email ?? user.Email;
        user.Phone = request.Phone ?? user.Phone;
        user.AvatarUrl = !string.IsNullOrEmpty(request.AvatarUrl) ? request.AvatarUrl : user.AvatarUrl;

        try
        {
            await _userService.Update(user, request.Password, request.CurrentPassword);
            return Ok(new { message = "Profile updated" });
        }
        catch (UnauthorizedAccessException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
