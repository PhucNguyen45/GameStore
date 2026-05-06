using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GameStore.Repository;
using GameStore.Services;
using GameStore.Entities.Games;

namespace GameStore.APIService.Controllers;

//[Authorize(Roles = "Admin")]
[Route("api/admin")]
[ApiController]
public class AdminController : ControllerBase
{
    private readonly GameStoreDbContext _context;
    private readonly IGameService _gameService;

    public AdminController(GameStoreDbContext context, IGameService gameService)
    {
        _context = context;
        _gameService = gameService;
    }

    // ================= DASHBOARD =================

    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboard()
    {
        var totalGames = await _context.Games.CountAsync();
        var totalUsers = await _context.Users.CountAsync();
        var totalOrders = await _context.Orders.CountAsync();

        var revenue = await _context.Orders
            .Where(o => o.Status == "Completed")
            .SumAsync(o => o.TotalAmount);

        return Ok(new
        {
            totalGames,
            totalUsers,
            totalOrders,
            totalRevenue = revenue
        });
    }

    // ================= GAMES (Admin) =================

    [HttpGet("games")]
    public async Task<IActionResult> GetGames(
        [FromQuery] string? keyword, [FromQuery] int? genreId,
        [FromQuery] decimal? minPrice, [FromQuery] decimal? maxPrice, [FromQuery] string? sortBy,
        [FromQuery] bool desc = false,
        [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        var (games, totalCount) = await _gameService.Search(
            keyword, genreId, minPrice, maxPrice,
            sortBy ?? "CreatedAt", desc || string.IsNullOrEmpty(sortBy),
            page, pageSize
        );

        return Ok(new
        {
            data = games.Select(g => new
            {
                g.Id,
                g.Title,
                g.Price,
                g.DiscountPrice,
                g.Developer,
                g.Publisher,
                g.Rating,
                g.TotalSales,
                g.ReleaseDate,
                g.CoverImageUrl,
                g.IsActive,
                g.CreatedAt
            }),
            totalCount
        });
    }

    [HttpPost("games")]
    public async Task<IActionResult> CreateGame([FromBody] AdminGameCreateDto dto)
    {
        var game = new Game
        {
            Title = dto.Title,
            Description = dto.Description ?? "",
            Price = dto.Price,
            DiscountPrice = dto.DiscountPrice,
            Developer = dto.Developer ?? "",
            Publisher = dto.Publisher ?? "",
            ReleaseDate = dto.ReleaseDate,
            TrailerUrl = dto.TrailerUrl ?? "",
            CoverImageUrl = dto.CoverImageUrl ?? "",
            MinimumOS = dto.MinimumOS ?? "",
            MinimumProcessor = dto.MinimumProcessor ?? "",
            MinimumMemory = dto.MinimumMemory ?? "",
            MinimumGraphics = dto.MinimumGraphics ?? "",
            MinimumStorage = dto.MinimumStorage ?? ""
        };
        var created = await _gameService.Create(game);
        
        if (dto.GenreIds != null && dto.GenreIds.Any())
        {
            foreach (var gid in dto.GenreIds)
            {
                _context.GameGenres.Add(new GameGenre { GameId = created.Id, GenreId = gid });
            }
            await _context.SaveChangesAsync();
        }

        return Ok(created);
    }

    [HttpPut("games/{id}")]
    public async Task<IActionResult> UpdateGame(int id, [FromBody] AdminGameUpdateDto dto)
    {
        var existing = await _gameService.GetById(id);

        if (existing == null)
            return NotFound(new { message = "Game not found" });

        existing.Title = dto.Title ?? existing.Title;
        existing.Description = dto.Description ?? existing.Description;
        existing.Price = dto.Price ?? existing.Price;
        existing.DiscountPrice = dto.DiscountPrice ?? existing.DiscountPrice;
        existing.Developer = dto.Developer ?? existing.Developer;
        existing.Publisher = dto.Publisher ?? existing.Publisher;
        existing.ReleaseDate = dto.ReleaseDate ?? existing.ReleaseDate;
        existing.CoverImageUrl = dto.CoverImageUrl ?? existing.CoverImageUrl;
        existing.TrailerUrl = dto.TrailerUrl ?? existing.TrailerUrl;
        existing.MinimumOS = dto.MinimumOS ?? existing.MinimumOS;
        existing.MinimumProcessor = dto.MinimumProcessor ?? existing.MinimumProcessor;
        existing.MinimumMemory = dto.MinimumMemory ?? existing.MinimumMemory;
        existing.MinimumGraphics = dto.MinimumGraphics ?? existing.MinimumGraphics;
        existing.MinimumStorage = dto.MinimumStorage ?? existing.MinimumStorage;

        if (dto.GenreIds != null)
        {
            var existingGenres = _context.GameGenres.Where(gg => gg.GameId == id);
            _context.GameGenres.RemoveRange(existingGenres);
            foreach (var gid in dto.GenreIds)
            {
                _context.GameGenres.Add(new GameGenre { GameId = id, GenreId = gid });
            }
        }

        await _gameService.Update(existing);
        await _context.SaveChangesAsync(); // Ensure junction table changes are saved

        return Ok(existing);
    }

    [HttpDelete("games/{id}")]
    public async Task<IActionResult> DeleteGame(int id)
    {
        var existing = await _gameService.GetById(id);
        if (existing == null)
            return NotFound(new { message = "Game not found" });

        await _gameService.Delete(id);
        return Ok(new { message = "Game deleted" });
    }

    // ================= USERS =================

    [HttpGet("users")]
    public async Task<IActionResult> GetUsers(
        [FromQuery] int page = 1, [FromQuery] int pageSize = 10,
        [FromQuery] string? keyword = null, [FromQuery] string? sortBy = null,
        [FromQuery] bool desc = false)
    {
        var query = _context.Users.AsQueryable();

        if (!string.IsNullOrEmpty(keyword))
            query = query.Where(u => u.Username.Contains(keyword) || u.DisplayName.Contains(keyword) || u.Email.Contains(keyword));

        var totalCount = await query.CountAsync();

        query = sortBy?.ToLower() switch
        {
            "id" => desc ? query.OrderByDescending(u => u.Id) : query.OrderBy(u => u.Id),
            "username" => desc ? query.OrderByDescending(u => u.Username) : query.OrderBy(u => u.Username),
            "displayname" => desc ? query.OrderByDescending(u => u.DisplayName) : query.OrderBy(u => u.DisplayName),
            "email" => desc ? query.OrderByDescending(u => u.Email) : query.OrderBy(u => u.Email),
            "wallet" => desc ? query.OrderByDescending(u => u.Wallet) : query.OrderBy(u => u.Wallet),
            "createdat" => desc ? query.OrderByDescending(u => u.CreatedAt) : query.OrderBy(u => u.CreatedAt),
            _ => query.OrderByDescending(u => u.CreatedAt) // Default
        };

        var users = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(u => new
            {
                u.Id,
                u.Username,
                u.DisplayName,
                u.Email,
                u.Wallet,
                u.IsActive,
                u.CreatedAt
            })
            .ToListAsync();

        return Ok(new
        {
            data = users,
            totalCount
        });
    }

    [HttpPut("users/{id}")]
    public async Task<IActionResult> UpdateUser(int id, [FromBody] AdminUserUpdateDto dto)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound(new { message = "User not found" });

        user.DisplayName = dto.DisplayName ?? user.DisplayName;
        user.Email = dto.Email ?? user.Email;
        
        if (dto.Wallet.HasValue) user.Wallet = dto.Wallet.Value;
        if (dto.IsActive.HasValue) user.IsActive = dto.IsActive.Value;

        await _context.SaveChangesAsync();
        return Ok(user);
    }

    [HttpDelete("users/{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound(new { message = "User not found" });

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
        return Ok(new { message = "User deleted" });
    }


    // ================= ORDERS =================

    [HttpGet("orders")]
    public async Task<IActionResult> GetOrders(
        [FromQuery] int page = 1, [FromQuery] int pageSize = 10,
        [FromQuery] string? keyword = null, [FromQuery] DateTime? fromDate = null,
        [FromQuery] DateTime? toDate = null, [FromQuery] string? status = null,
        [FromQuery] string? sortBy = null, [FromQuery] bool desc = false)
    {
        var query = _context.Orders.Include(o => o.User).AsQueryable();

        if (!string.IsNullOrEmpty(keyword))
        {
            var isNumeric = int.TryParse(keyword, out int searchId);
            query = query.Where(o =>
                o.User.Username.Contains(keyword) || (isNumeric && o.Id == searchId));
        }
        if (fromDate.HasValue)
            query = query.Where(o => o.OrderDate >= fromDate.Value);
        if (toDate.HasValue)
            query = query.Where(o => o.OrderDate <= toDate.Value);
        if (!string.IsNullOrEmpty(status))
            query = query.Where(o => o.Status == status);

        var totalCount = await query.CountAsync();

        query = sortBy?.ToLower() switch
        {
            "id" => desc ? query.OrderByDescending(o => o.Id) : query.OrderBy(o => o.Id),
            "totalamount" => desc ? query.OrderByDescending(o => o.TotalAmount) : query.OrderBy(o => o.TotalAmount),
            "status" => desc ? query.OrderByDescending(o => o.Status) : query.OrderBy(o => o.Status),
            "orderdate" => desc ? query.OrderByDescending(o => o.OrderDate) : query.OrderBy(o => o.OrderDate),
            _ => query.OrderByDescending(o => o.OrderDate)
        };

        var orders = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(o => new
            {
                o.Id,
                o.UserId,
                Username = o.User.Username,
                o.TotalAmount,
                o.Status,
                o.PaymentMethod,
                o.OrderDate
            })
            .ToListAsync();

        return Ok(new
        {
            data = orders,
            totalCount
        });
    }

    // Get ALL orders (for dashboard charts - no pagination)
    [HttpGet("orders/all")]
    public async Task<IActionResult> GetAllOrders()
    {
        var orders = await _context.Orders
            .OrderByDescending(o => o.OrderDate)
            .Select(o => new
            {
                o.Id,
                o.UserId,
                o.TotalAmount,
                o.Status,
                o.PaymentMethod,
                o.OrderDate
            })
            .ToListAsync();

        return Ok(orders);
    }

    // Update order status
    [HttpPut("orders/{id}/status")]
    public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] AdminUpdateStatusDto dto)
    {
        var order = await _context.Orders.FindAsync(id);
        if (order == null) return NotFound(new { message = "Order not found" });
        order.Status = dto.Status;
        await _context.SaveChangesAsync();
        return Ok(new { message = "Status updated" });
    }
}

// ===== Admin-specific DTOs =====
public class AdminGameCreateDto
{
    public string Title { get; set; } = "";
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public decimal? DiscountPrice { get; set; }
    public string? Developer { get; set; }
    public string? Publisher { get; set; }
    public DateTime ReleaseDate { get; set; }
    public string? TrailerUrl { get; set; }
    public string? CoverImageUrl { get; set; }
    public string? MinimumOS { get; set; }
    public string? MinimumProcessor { get; set; }
    public string? MinimumMemory { get; set; }
    public string? MinimumGraphics { get; set; }
    public string? MinimumStorage { get; set; }
    public List<int>? GenreIds { get; set; }
}

public class AdminGameUpdateDto
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public decimal? Price { get; set; }
    public decimal? DiscountPrice { get; set; }
    public string? Developer { get; set; }
    public string? Publisher { get; set; }
    public DateTime? ReleaseDate { get; set; }
    public string? TrailerUrl { get; set; }
    public string? CoverImageUrl { get; set; }
    public string? MinimumOS { get; set; }
    public string? MinimumProcessor { get; set; }
    public string? MinimumMemory { get; set; }
    public string? MinimumGraphics { get; set; }
    public string? MinimumStorage { get; set; }
    public List<int>? GenreIds { get; set; }
}

public class AdminUpdateStatusDto
{
    public string Status { get; set; } = "";
}

public class AdminUserUpdateDto
{
    public string? DisplayName { get; set; }
    public string? Email { get; set; }
    public decimal? Wallet { get; set; }
    public bool? IsActive { get; set; }
}