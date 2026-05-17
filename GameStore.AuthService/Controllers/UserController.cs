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

namespace GameStore.AuthService.Controllers;

[Route("api/users")]
[ApiController]
[Authorize]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;
    public UserController(IUserService userService) => _userService = userService;

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
        user.AvatarUrl = request.AvatarUrl ?? user.AvatarUrl;
        await _userService.Update(user, request.Password);
        return Ok(new { message = "Profile updated" });
    }

    [HttpGet("wallet")]
    public async Task<IActionResult> GetWallet()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var balance = await _userService.GetWalletBalance(userId);
        return Ok(new { balance });
    }

    [HttpPost("wallet/topup")]
    public async Task<IActionResult> TopUp([FromBody] TopUpRequest request)
    {
        if (request.Amount <= 0) return BadRequest(new { message = "Amount must be positive" });
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        await _userService.AddToWallet(userId, request.Amount);
        var balance = await _userService.GetWalletBalance(userId);
        return Ok(new { message = "Wallet topped up", balance });
    }
}
