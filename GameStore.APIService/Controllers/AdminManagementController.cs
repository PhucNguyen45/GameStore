// GameStore.APIService/Controllers/AdminManagementController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GameStore.Repository;
using GameStore.Entities.Games;
using GameStore.Entities.Store;
using GameStore.Entities.Auth;
using GameStore.Entities.Users;

namespace GameStore.APIService.Controllers;

/// <summary>
/// Admin management controller for Categories, GameKeys, Payments, and Staff/Roles.
/// </summary>
[Route("api/admin")]
[ApiController]
[Authorize(Roles = "Admin")]
public class AdminManagementController : ControllerBase
{
    private readonly GameStoreDbContext _context;

    public AdminManagementController(GameStoreDbContext context)
    {
        _context = context;
    }

    // ======================= CATEGORIES (Genres) =======================

    [HttpGet("categories")]
    public async Task<IActionResult> GetCategories(
        [FromQuery] int page = 1, [FromQuery] int pageSize = 10,
        [FromQuery] string? keyword = null, [FromQuery] string? status = null)
    {
        var query = _context.Genres.AsQueryable();

        if (!string.IsNullOrEmpty(keyword))
            query = query.Where(g => g.Name.Contains(keyword) || g.Description.Contains(keyword));

        if (status == "active") query = query.Where(g => g.IsActive);
        else if (status == "inactive") query = query.Where(g => !g.IsActive);

        var totalCount = await query.CountAsync();
        var data = await query
            .OrderBy(g => g.Name)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(g => new
            {
                g.Id,
                g.Name,
                g.Description,
                g.IconUrl,
                g.IsActive,
                gameCount = _context.GameGenres.Count(gg => gg.GenreId == g.Id)
            })
            .ToListAsync();

        return Ok(new { data, totalCount });
    }

    [HttpPost("categories")]
    public async Task<IActionResult> CreateCategory([FromBody] CategoryDto dto)
    {
        if (await _context.Genres.AnyAsync(g => g.Name == dto.Name))
            return BadRequest(new { message = "Category name already exists" });

        var genre = new Genre
        {
            Name = dto.Name,
            Description = dto.Description ?? "",
            IconUrl = dto.IconUrl ?? "",
            IsActive = dto.IsActive
        };
        _context.Genres.Add(genre);
        await _context.SaveChangesAsync();
        return Ok(genre);
    }

    [HttpPut("categories/{id}")]
    public async Task<IActionResult> UpdateCategory(int id, [FromBody] CategoryDto dto)
    {
        var genre = await _context.Genres.FindAsync(id);
        if (genre == null) return NotFound(new { message = "Category not found" });

        if (await _context.Genres.AnyAsync(g => g.Name == dto.Name && g.Id != id))
            return BadRequest(new { message = "Category name already exists" });

        genre.Name = dto.Name;
        genre.Description = dto.Description ?? "";
        genre.IconUrl = dto.IconUrl ?? "";
        genre.IsActive = dto.IsActive;
        await _context.SaveChangesAsync();
        return Ok(genre);
    }

    [HttpDelete("categories/{id}")]
    public async Task<IActionResult> DeleteCategory(int id)
    {
        var genre = await _context.Genres.FindAsync(id);
        if (genre == null) return NotFound(new { message = "Category not found" });

        var gamesUsingGenre = await _context.GameGenres.CountAsync(gg => gg.GenreId == id);
        if (gamesUsingGenre > 0)
            return BadRequest(new { message = $"Cannot delete: {gamesUsingGenre} games use this category" });

        _context.Genres.Remove(genre);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Category deleted" });
    }

    // ======================= GAME KEYS (Inventory) =======================

    [HttpGet("gamekeys")]
    public async Task<IActionResult> GetGameKeys(
        [FromQuery] int page = 1, [FromQuery] int pageSize = 10,
        [FromQuery] string? keyword = null, [FromQuery] int? gameId = null,
        [FromQuery] string? status = null)
    {
        var query = _context.GameKeys.Include(k => k.Game).AsQueryable();

        if (!string.IsNullOrEmpty(keyword))
            query = query.Where(k => k.KeyCode.Contains(keyword) || k.Game.Title.Contains(keyword));

        if (gameId.HasValue)
            query = query.Where(k => k.GameId == gameId.Value);

        if (status == "available") query = query.Where(k => !k.IsUsed && (k.ExpiresAt == null || k.ExpiresAt > DateTime.Now));
        else if (status == "used") query = query.Where(k => k.IsUsed);
        else if (status == "expired") query = query.Where(k => k.ExpiresAt != null && k.ExpiresAt <= DateTime.Now && !k.IsUsed);

        var totalCount = await query.CountAsync();
        var data = await query
            .OrderByDescending(k => k.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(k => new
            {
                k.Id,
                k.GameId,
                gameTitle = k.Game.Title,
                k.KeyCode,
                k.IsUsed,
                k.OrderDetailId,
                k.UsedAt,
                k.CreatedAt,
                k.ExpiresAt
            })
            .ToListAsync();

        // Summary stats
        var totalKeys = await _context.GameKeys.CountAsync();
        var usedKeys = await _context.GameKeys.CountAsync(k => k.IsUsed);
        var availableKeys = await _context.GameKeys.CountAsync(k => !k.IsUsed && (k.ExpiresAt == null || k.ExpiresAt > DateTime.Now));
        var expiredKeys = await _context.GameKeys.CountAsync(k => k.ExpiresAt != null && k.ExpiresAt <= DateTime.Now && !k.IsUsed);

        return Ok(new { data, totalCount, stats = new { totalKeys, usedKeys, availableKeys, expiredKeys } });
    }

    [HttpPost("gamekeys")]
    public async Task<IActionResult> CreateGameKey([FromBody] GameKeyDto dto)
    {
        var game = await _context.Games.FindAsync(dto.GameId);
        if (game == null) return NotFound(new { message = "Game not found" });

        if (await _context.GameKeys.AnyAsync(k => k.KeyCode == dto.KeyCode))
            return BadRequest(new { message = "Key code already exists" });

        var key = new GameKey
        {
            GameId = dto.GameId,
            KeyCode = dto.KeyCode,
            ExpiresAt = dto.ExpiresAt,
            CreatedAt = DateTime.Now
        };
        _context.GameKeys.Add(key);
        await _context.SaveChangesAsync();
        return Ok(key);
    }

    [HttpPost("gamekeys/batch")]
    public async Task<IActionResult> CreateBatchGameKeys([FromBody] BatchGameKeyDto dto)
    {
        var game = await _context.Games.FindAsync(dto.GameId);
        if (game == null) return NotFound(new { message = "Game not found" });

        var keys = new List<GameKey>();
        var existing = new HashSet<string>(await _context.GameKeys.Select(k => k.KeyCode).ToListAsync());

        foreach (var code in dto.KeyCodes)
        {
            if (string.IsNullOrWhiteSpace(code) || existing.Contains(code)) continue;
            keys.Add(new GameKey
            {
                GameId = dto.GameId,
                KeyCode = code.Trim(),
                ExpiresAt = dto.ExpiresAt,
                CreatedAt = DateTime.Now
            });
            existing.Add(code);
        }

        if (keys.Count == 0) return BadRequest(new { message = "No valid keys to add" });

        await _context.GameKeys.AddRangeAsync(keys);
        await _context.SaveChangesAsync();
        return Ok(new { message = $"{keys.Count} keys added successfully", count = keys.Count });
    }

    [HttpDelete("gamekeys/{id}")]
    public async Task<IActionResult> DeleteGameKey(int id)
    {
        var key = await _context.GameKeys.FindAsync(id);
        if (key == null) return NotFound(new { message = "Key not found" });
        if (key.IsUsed) return BadRequest(new { message = "Cannot delete a used key" });

        _context.GameKeys.Remove(key);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Key deleted" });
    }

    // ======================= PAYMENTS & ORDER DETAILS =======================

    [HttpGet("payments")]
    public async Task<IActionResult> GetPayments(
        [FromQuery] int page = 1, [FromQuery] int pageSize = 10,
        [FromQuery] string? keyword = null, [FromQuery] string? status = null,
        [FromQuery] string? method = null, [FromQuery] DateTime? fromDate = null,
        [FromQuery] DateTime? toDate = null)
    {
        var query = _context.Payments.Include(p => p.Order).ThenInclude(o => o.User).AsQueryable();

        if (!string.IsNullOrEmpty(keyword))
        {
            var isNumeric = int.TryParse(keyword, out int searchId);
            query = query.Where(p =>
                (isNumeric && (p.Id == searchId || p.OrderId == searchId)) ||
                (p.TransactionId != null && p.TransactionId.Contains(keyword)) ||
                p.Order.User.Username.Contains(keyword));
        }

        if (!string.IsNullOrEmpty(status)) query = query.Where(p => p.Status == status);
        if (!string.IsNullOrEmpty(method)) query = query.Where(p => p.PaymentMethod == method);
        if (fromDate.HasValue) query = query.Where(p => p.PaidAt >= fromDate.Value);
        if (toDate.HasValue) query = query.Where(p => p.PaidAt <= toDate.Value);

        var totalCount = await query.CountAsync();
        var data = await query
            .OrderByDescending(p => p.PaidAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(p => new
            {
                p.Id,
                p.OrderId,
                p.Amount,
                p.PaymentMethod,
                p.Status,
                p.TransactionId,
                p.Note,
                p.PaidAt,
                p.CreatedAt,
                username = p.Order.User.Username,
                userId = p.Order.UserId
            })
            .ToListAsync();

        return Ok(new { data, totalCount });
    }

    [HttpGet("payments/order/{orderId}")]
    public async Task<IActionResult> GetOrderPayments(int orderId)
    {
        var order = await _context.Orders
            .Include(o => o.User)
            .Include(o => o.OrderDetails).ThenInclude(od => od.Game)
            .FirstOrDefaultAsync(o => o.Id == orderId);

        if (order == null) return NotFound(new { message = "Order not found" });

        var payments = await _context.Payments
            .Where(p => p.OrderId == orderId)
            .OrderByDescending(p => p.PaidAt)
            .ToListAsync();

        return Ok(new
        {
            order = new
            {
                order.Id,
                order.UserId,
                username = order.User.Username,
                order.TotalAmount,
                order.Status,
                order.PaymentMethod,
                order.OrderDate,
                items = order.OrderDetails.Select(od => new
                {
                    od.Id,
                    od.GameId,
                    gameTitle = od.Game.Title,
                    od.Quantity,
                    od.UnitPrice
                })
            },
            payments
        });
    }

    [HttpPost("payments/refund/{paymentId}")]
    public async Task<IActionResult> RefundPayment(int paymentId, [FromBody] RefundDto? dto)
    {
        var payment = await _context.Payments.Include(p => p.Order).ThenInclude(o => o.User)
            .FirstOrDefaultAsync(p => p.Id == paymentId);

        if (payment == null) return NotFound(new { message = "Payment not found" });
        if (payment.Status == "Refunded") return BadRequest(new { message = "Payment already refunded" });

        // Refund to user wallet
        var user = payment.Order.User;
        user.Wallet += payment.Amount;

        payment.Status = "Refunded";
        payment.Note = dto?.Note ?? "Admin refund";
        payment.Order.Status = "Refunded";

        await _context.SaveChangesAsync();
        return Ok(new { message = "Payment refunded successfully" });
    }

    // ======================= STAFF & ROLES =======================

    [HttpGet("roles")]
    public async Task<IActionResult> GetRoles(
        [FromQuery] int page = 1, [FromQuery] int pageSize = 10,
        [FromQuery] string? keyword = null)
    {
        var query = _context.Roles.Where(r => !r.IsDeleted).AsQueryable();

        if (!string.IsNullOrEmpty(keyword))
            query = query.Where(r => r.Name.Contains(keyword) || r.Description.Contains(keyword));

        var totalCount = await query.CountAsync();
        var data = await query
            .OrderBy(r => r.Name)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(r => new
            {
                r.Id,
                r.Name,
                r.Description,
                r.IsActive,
                r.Created,
                userCount = _context.UserRoles.Count(ur => ur.RoleId == r.Id && !ur.IsDeleted),
                permissions = r.RolePermissions.Select(rp => rp.Permission).ToList()
            })
            .ToListAsync();

        return Ok(new { data, totalCount });
    }

    [HttpPost("roles")]
    public async Task<IActionResult> CreateRole([FromBody] RoleDto dto)
    {
        if (await _context.Roles.AnyAsync(r => r.Name == dto.Name && !r.IsDeleted))
            return BadRequest(new { message = "Role name already exists" });

        var role = new Role
        {
            Name = dto.Name,
            Description = dto.Description ?? "",
            IsActive = true,
            Guid = Guid.NewGuid(),
            CreatedBy = "admin",
            Created = DateTime.Now,
            ModifiedBy = "admin",
            Modified = DateTime.Now
        };
        _context.Roles.Add(role);
        await _context.SaveChangesAsync();

        // Add permissions
        if (dto.Permissions != null)
        {
            foreach (var perm in dto.Permissions)
            {
                _context.RolePermissions.Add(new RolePermission
                {
                    RoleId = role.Id,
                    Permission = perm
                });
            }
            await _context.SaveChangesAsync();
        }

        return Ok(new { role.Id, role.Name, role.Description, role.IsActive, dto.Permissions });
    }

    [HttpPut("roles/{id}")]
    public async Task<IActionResult> UpdateRole(int id, [FromBody] RoleDto dto)
    {
        var role = await _context.Roles.FindAsync(id);
        if (role == null || role.IsDeleted) return NotFound(new { message = "Role not found" });

        if (await _context.Roles.AnyAsync(r => r.Name == dto.Name && r.Id != id && !r.IsDeleted))
            return BadRequest(new { message = "Role name already exists" });

        role.Name = dto.Name;
        role.Description = dto.Description ?? "";
        role.IsActive = dto.IsActive;
        role.ModifiedBy = "admin";
        role.Modified = DateTime.Now;

        // Update permissions: remove old, add new
        var oldPerms = await _context.RolePermissions.Where(rp => rp.RoleId == id).ToListAsync();
        _context.RolePermissions.RemoveRange(oldPerms);

        if (dto.Permissions != null)
        {
            foreach (var perm in dto.Permissions)
            {
                _context.RolePermissions.Add(new RolePermission { RoleId = id, Permission = perm });
            }
        }

        await _context.SaveChangesAsync();
        return Ok(new { role.Id, role.Name, role.Description, role.IsActive, dto.Permissions });
    }

    [HttpDelete("roles/{id}")]
    public async Task<IActionResult> DeleteRole(int id)
    {
        var role = await _context.Roles.FindAsync(id);
        if (role == null) return NotFound(new { message = "Role not found" });

        // Prevent deleting built-in roles
        if (role.Name == "Admin" || role.Name == "User")
            return BadRequest(new { message = "Cannot delete built-in roles" });

        var usersWithRole = await _context.UserRoles.CountAsync(ur => ur.RoleId == id && !ur.IsDeleted);
        if (usersWithRole > 0)
            return BadRequest(new { message = $"Cannot delete: {usersWithRole} users have this role" });

        role.IsDeleted = true;
        role.Modified = DateTime.Now;
        await _context.SaveChangesAsync();
        return Ok(new { message = "Role deleted" });
    }

    // ===== Staff (Users with roles) =====

    [HttpGet("staff")]
    public async Task<IActionResult> GetStaff(
        [FromQuery] int page = 1, [FromQuery] int pageSize = 10,
        [FromQuery] string? keyword = null, [FromQuery] int? roleId = null)
    {
        var query = _context.Users.AsQueryable();

        // Only show users who have at least one role assigned
        if (roleId.HasValue)
            query = query.Where(u => u.UserRoles.Any(ur => ur.RoleId == roleId.Value && !ur.IsDeleted));

        if (!string.IsNullOrEmpty(keyword))
            query = query.Where(u => u.Username.Contains(keyword) || u.DisplayName.Contains(keyword) || u.Email.Contains(keyword));

        var totalCount = await query.CountAsync();
        var data = await query
            .OrderBy(u => u.Username)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(u => new
            {
                u.Id,
                u.Username,
                u.DisplayName,
                u.Email,
                u.IsActive,
                u.CreatedAt,
                roles = u.UserRoles.Where(ur => !ur.IsDeleted).Select(ur => new
                {
                    ur.RoleId,
                    roleName = ur.Role.Name
                }).ToList()
            })
            .ToListAsync();

        return Ok(new { data, totalCount });
    }

    [HttpPost("staff/assign")]
    public async Task<IActionResult> AssignRole([FromBody] AssignRoleDto dto)
    {
        var user = await _context.Users.FindAsync(dto.UserId);
        if (user == null) return NotFound(new { message = "User not found" });

        var role = await _context.Roles.FindAsync(dto.RoleId);
        if (role == null) return NotFound(new { message = "Role not found" });

        var existing = await _context.UserRoles
            .FirstOrDefaultAsync(ur => ur.UserId == dto.UserId && ur.RoleId == dto.RoleId);

        if (existing != null)
        {
            if (!existing.IsDeleted)
                return BadRequest(new { message = "User already has this role" });
            existing.IsDeleted = false;
            existing.Modified = DateTime.Now;
        }
        else
        {
            _context.UserRoles.Add(new UserRole
            {
                UserId = dto.UserId,
                RoleId = dto.RoleId,
                Guid = Guid.NewGuid(),
                CreatedBy = "admin",
                Created = DateTime.Now,
                ModifiedBy = "admin",
                Modified = DateTime.Now
            });
        }

        await _context.SaveChangesAsync();
        return Ok(new { message = "Role assigned successfully" });
    }

    [HttpDelete("staff/revoke")]
    public async Task<IActionResult> RevokeRole([FromBody] AssignRoleDto dto)
    {
        var userRole = await _context.UserRoles
            .FirstOrDefaultAsync(ur => ur.UserId == dto.UserId && ur.RoleId == dto.RoleId && !ur.IsDeleted);

        if (userRole == null) return NotFound(new { message = "User does not have this role" });

        userRole.IsDeleted = true;
        userRole.Modified = DateTime.Now;
        await _context.SaveChangesAsync();
        return Ok(new { message = "Role revoked successfully" });
    }

    [HttpGet("permissions")]
    public IActionResult GetAllPermissions()
    {
        var permissions = new[]
        {
            "games.view", "games.create", "games.edit", "games.delete",
            "users.view", "users.edit", "users.ban",
            "orders.view", "orders.edit",
            "categories.view", "categories.create", "categories.edit", "categories.delete",
            "gamekeys.view", "gamekeys.create", "gamekeys.delete",
            "payments.view", "payments.refund",
            "roles.view", "roles.create", "roles.edit", "roles.delete",
            "staff.view", "staff.assign"
        };
        return Ok(permissions);
    }
}

// ===== DTOs =====
public class CategoryDto
{
    public string Name { get; set; } = "";
    public string? Description { get; set; }
    public string? IconUrl { get; set; }
    public bool IsActive { get; set; } = true;
}

public class GameKeyDto
{
    public int GameId { get; set; }
    public string KeyCode { get; set; } = "";
    public DateTime? ExpiresAt { get; set; }
}

public class BatchGameKeyDto
{
    public int GameId { get; set; }
    public List<string> KeyCodes { get; set; } = new();
    public DateTime? ExpiresAt { get; set; }
}

public class RefundDto
{
    public string? Note { get; set; }
}

public class RoleDto
{
    public string Name { get; set; } = "";
    public string? Description { get; set; }
    public bool IsActive { get; set; } = true;
    public List<string>? Permissions { get; set; }
}

public class AssignRoleDto
{
    public int UserId { get; set; }
    public int RoleId { get; set; }
}
