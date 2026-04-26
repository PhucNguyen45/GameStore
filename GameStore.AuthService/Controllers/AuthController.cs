using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using GameStore.Common.Auth;
using GameStore.Services.Authen;
using GameStore.Entities.Users;

namespace GameStore.AuthService.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly IConfiguration _configuration;

    public AuthController(IUserService userService, IConfiguration configuration)
    {
        _userService = userService;
        _configuration = configuration;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        if (string.IsNullOrEmpty(request.Username) || string.IsNullOrEmpty(request.Password))
            return BadRequest(new { message = "Username and password are required" });

        var user = await _userService.Authenticate(request.Username, request.Password);
        if (user == null) return Unauthorized(new { message = "Invalid username or password" });

        var secretKey = _configuration["Jwt:SecretKey"]!;
        var expireMinutes = int.Parse(_configuration["Jwt:ExpireMinutes"] ?? "480");
        var token = TokenHelper.GenerateToken(secretKey, expireMinutes,
            user.Id.ToString(), user.Username, user.UserRoles?.FirstOrDefault()?.Role?.Name ?? "User");

        return Ok(new
        {
            token, userId = user.Id, username = user.Username,
            displayName = user.DisplayName, email = user.Email,
            wallet = user.Wallet, expiresIn = expireMinutes * 60
        });
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        if (string.IsNullOrEmpty(request.Username) || string.IsNullOrEmpty(request.Password))
            return BadRequest(new { message = "Username and password are required" });
        if (request.Password.Length < 6)
            return BadRequest(new { message = "Password must be at least 6 characters" });
        if (await _userService.IsUsernameExists(request.Username))
            return BadRequest(new { message = "Username already exists" });
        if (!string.IsNullOrEmpty(request.Email) && await _userService.IsEmailExists(request.Email))
            return BadRequest(new { message = "Email already exists" });

        var user = new User { Username = request.Username, DisplayName = request.DisplayName ?? request.Username,
            Email = request.Email ?? "", Phone = request.Phone ?? "" };
        var createdUser = await _userService.Register(user, request.Password);
        return Ok(new { message = "Registration successful", userId = createdUser.Id });
    }
}

public class LoginRequest { public string Username { get; set; } = ""; public string Password { get; set; } = ""; }
public class RegisterRequest { public string Username { get; set; } = ""; public string Password { get; set; } = "";
    public string? DisplayName { get; set; } public string? Email { get; set; } public string? Phone { get; set; } }
