// GameStore.AuthService/Controllers/AuthController.cs
using Microsoft.AspNetCore.Mvc;
using GameStore.Common.Auth;
using GameStore.Services.Authen;
using GameStore.Entities.Users;
using GameStore.Repository;
using GameStore.DTOs.Auth;

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
            return BadRequest(new { message = "Tên người dùng và mật khẩu là bắt buộc" });

        var user = await _userService.Authenticate(request.Username, request.Password);
        if (user == null) return Unauthorized(new { message = "Tên người dùng và mật khẩu không hợp lệ" });

        var roleName = await _userService.GetRoleNameAsync(user.Id) ?? "User";

        var secretKey = _configuration["Jwt:SecretKey"]!;
        var expireMinutes = int.Parse(_configuration["Jwt:ExpireMinutes"] ?? "480");
        var token = TokenHelper.GenerateToken(secretKey, expireMinutes,
            user.Id.ToString(), user.Username, roleName);

        return Ok(new
        {
            token,
            userId = user.Id,
            username = user.Username,
            displayName = user.DisplayName,
            email = user.Email,
            wallet = user.Wallet,
            role = roleName,
            expiresIn = expireMinutes * 60
        });
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        if (string.IsNullOrEmpty(request.Username) || string.IsNullOrEmpty(request.Password))
            return BadRequest(new { message = "Tên người dùng và mật khẩu là bắt buộc" });
        if (request.Password.Length < 6)
            return BadRequest(new { message = "Mật khẩu phải ít nhất 6 chữ, số" });

        var user = new User
        {
            Username = request.Username,
            DisplayName = request.DisplayName ?? request.Username,
            Email = request.Email ?? "",
            Phone = request.Phone ?? ""
        };
        var createdUser = await _userService.RegisterUserAsync(user, request.Password);

        return Ok(new { message = "Đăng ký hoàn tất", userId = createdUser.Id });
    }
}
