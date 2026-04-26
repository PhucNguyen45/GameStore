using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GameStore.Common.Auth;
using GameStore.Services.Authen;
using GameStore.Entities.Users;
using GameStore.Repository;

namespace GameStore.AuthService.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly IConfiguration _configuration;
    private readonly GameStoreDbContext _context;

    public AuthController(IUserService userService, IConfiguration configuration, GameStoreDbContext context)
    {
        _userService = userService;
        _configuration = configuration;
        _context = context;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        if (string.IsNullOrEmpty(request.Username) || string.IsNullOrEmpty(request.Password))
            return BadRequest(new { message = "Username and password are required" });

        var user = await _userService.Authenticate(request.Username, request.Password);
        if (user == null) return Unauthorized(new { message = "Invalid username or password" });

        // Lấy role từ database
        var userRole = await _context.UserRoles
            .Include(ur => ur.Role)
            .FirstOrDefaultAsync(ur => ur.UserId == user.Id);
        var roleName = userRole?.Role?.Name ?? "User";

        var secretKey = _configuration["Jwt:SecretKey"]!;
        var expireMinutes = int.Parse(_configuration["Jwt:ExpireMinutes"] ?? "480");
        var token = TokenHelper.GenerateToken(secretKey, expireMinutes,
            user.Id.ToString(), user.Username, roleName);

        return Ok(new
        {
            token, userId = user.Id, username = user.Username,
            displayName = user.DisplayName, email = user.Email,
            wallet = user.Wallet, role = roleName, expiresIn = expireMinutes * 60
        });
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        if (string.IsNullOrEmpty(request.Username) || string.IsNullOrEmpty(request.Password))
            return BadRequest(new { message = "Username and password are required" });
        if (request.Password.Length < 6)
            return BadRequest(new { message = "Password must be at least 6 characters" });

        var user = new User { Username = request.Username, DisplayName = request.DisplayName ?? request.Username,
            Email = request.Email ?? "", Phone = request.Phone ?? "" };
        var createdUser = await _userService.Register(user, request.Password);
        return Ok(new { message = "Registration successful", userId = createdUser.Id });
    }
}

public class LoginRequest { public string Username { get; set; } = ""; public string Password { get; set; } = ""; }
public class RegisterRequest { public string Username { get; set; } = ""; public string Password { get; set; } = "";
    public string? DisplayName { get; set; } public string? Email { get; set; } public string? Phone { get; set; } }
