// GameStore.AuthService/Controllers/AuthController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GameStore.Common.Auth;
using GameStore.Services.Authen;
using GameStore.Entities.Auth;
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

        User? user;
        try
        {
            user = await _userService.Authenticate(request.Username, request.Password);
        }
        catch (UnauthorizedAccessException ex)
        {
            return StatusCode(403, new { message = ex.Message });
        }

        if (user == null) return Unauthorized(new { message = "Invalid username or password" });

        var userRoles = await _context.UserRoles
            .Include(ur => ur.Role)
            .Where(ur => ur.UserId == user.Id && !ur.IsDeleted)
            .ToListAsync();
        // Ưu tiên role cao nhất: Admin > các role khác > User
        var roleName = userRoles.Any(ur => ur.Role.Name == "Admin") ? "Admin"
            : userRoles.FirstOrDefault()?.Role?.Name ?? "User";

        var secretKey = _configuration["Jwt:SecretKey"]!;
        var expireMinutes = int.Parse(_configuration["Jwt:ExpireMinutes"] ?? "480");
        var issuer = _configuration["Jwt:Issuer"];
        var audience = _configuration["Jwt:Audience"];
        var token = TokenHelper.GenerateToken(secretKey, expireMinutes,
            user.Id.ToString(), user.Username, roleName, issuer, audience);

        return Ok(new
        {
            token,
            userId = user.Id,
            username = user.Username,
            displayName = user.DisplayName,
            email = user.Email,
            phone = user.Phone,
            wallet = user.Wallet,
            role = roleName,
            expiresIn = expireMinutes * 60
        });
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        if (string.IsNullOrEmpty(request.Username) || string.IsNullOrEmpty(request.Password))
            return BadRequest(new { message = "Username and password are required" });
        if (request.Password.Length < 6)
            return BadRequest(new { message = "Password must be at least 6 characters" });

        var user = new User
        {
            Username = request.Username,
            DisplayName = request.DisplayName ?? request.Username,
            Email = request.Email ?? "",
            Phone = request.Phone ?? ""
        };
        var createdUser = await _userService.Register(user, request.Password);

        // Tự động gán role "User" mặc định cho tài khoản mới
        var defaultRole = await _context.Roles.FirstOrDefaultAsync(r => r.Name == "User" && !r.IsDeleted);
        if (defaultRole != null)
        {
            _context.UserRoles.Add(new UserRole
            {
                UserId = createdUser.Id,
                RoleId = defaultRole.Id,
                Guid = Guid.NewGuid(),
                CreatedBy = "system",
                Created = DateTime.UtcNow,
                ModifiedBy = "system",
                Modified = DateTime.UtcNow
            });
            await _context.SaveChangesAsync();
        }

        return Ok(new { message = "Registration successful", userId = createdUser.Id });
    }

    // ================= FORGOT PASSWORD =================
    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email))
            return BadRequest(new { message = "Email is required" });

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email && u.IsActive);
        if (user == null)
        {
            // Don't reveal whether email exists
            return Ok(new { message = "Nếu email đã đăng ký, bạn sẽ nhận được link đặt lại mật khẩu." });
        }

        // Invalidate old unused tokens
        var oldTokens = await _context.PasswordResetTokens
            .Where(t => t.UserId == user.Id && !t.IsUsed && t.ExpiresAt > DateTime.UtcNow)
            .ToListAsync();
        foreach (var t in oldTokens)
        {
            t.IsUsed = true;
        }

        // Generate new reset token
        var token = Convert.ToHexString(System.Security.Cryptography.RandomNumberGenerator.GetBytes(32));
        var resetToken = new PasswordResetToken
        {
            UserId = user.Id,
            Token = token,
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddHours(1),
            IsUsed = false
        };

        _context.PasswordResetTokens.Add(resetToken);
        await _context.SaveChangesAsync();

        // In production, send email with reset link
        // For development, return the token directly so the user can use it
        return Ok(new
        {
            message = "Nếu email đã đăng ký, bạn sẽ nhận được link đặt lại mật khẩu.",
            resetToken = token, // TODO: Remove in production, send via email instead
        });
    }

    // ================= RESET PASSWORD =================
    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Token))
            return BadRequest(new { message = "Token is required" });
        if (string.IsNullOrWhiteSpace(request.NewPassword) || request.NewPassword.Length < 6)
            return BadRequest(new { message = "Mật khẩu phải có ít nhất 6 ký tự" });

        var resetToken = await _context.PasswordResetTokens
            .Include(t => t.User)
            .FirstOrDefaultAsync(t => t.Token == request.Token && !t.IsUsed);

        if (resetToken == null)
            return BadRequest(new { message = "Token không hợp lệ" });

        if (resetToken.ExpiresAt < DateTime.UtcNow)
            return BadRequest(new { message = "Token đã hết hạn" });

        // Update password
        var user = resetToken.User;
        byte[] salt;
        user.Password = TokenHelper.HashPassword(request.NewPassword, out salt);
        user.Salt = salt;

        // Mark token as used
        resetToken.IsUsed = true;

        await _context.SaveChangesAsync();

        return Ok(new { message = "Mật khẩu đã được đặt lại thành công!" });
    }
}
