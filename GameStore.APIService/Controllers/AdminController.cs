// GameStore.APIService/Controllers/AdminController.cs
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

    // ================= GAMES =================

    [HttpGet("games")]
    public async Task<IActionResult> GetGames()
    {
        var (games, totalCount) = await _gameService.Search(
            null, null, null,
            "CreatedAt", true,
            1, 1000
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
                g.Rating
            }),
            totalCount
        });
    }

    [HttpPost("games")]
    public async Task<IActionResult> CreateGame([FromBody] Game game)
    {
        var created = await _gameService.Create(game);
        return Ok(created);
    }

    [HttpPut("games/{id}")]
    public async Task<IActionResult> UpdateGame(int id, [FromBody] Game game)
    {
        var existing = await _gameService.GetById(id);

        if (existing == null)
            return NotFound();

        existing.Title = game.Title;
        existing.Price = game.Price;
        existing.DiscountPrice = game.DiscountPrice;
        existing.Developer = game.Developer;

        await _gameService.Update(existing);

        return Ok(existing);
    }

    [HttpDelete("games/{id}")]
    public async Task<IActionResult> DeleteGame(int id)
    {
        await _gameService.Delete(id);
        return Ok();
    }

    // ================= USERS =================

    [HttpGet("users")]
    public async Task<IActionResult> GetUsers()
    {
        var users = await _context.Users
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
            totalCount = users.Count
        });
    }

    // ================= ORDERS =================

    [HttpGet("orders")]
    public async Task<IActionResult> GetOrders()
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
}
