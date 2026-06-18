// GameStore.APIService/Controllers/GamesController.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GameStore.Entities.Games;
using GameStore.Services.Interfaces.Users;
using GameStore.DTOs.Common;
using GameStore.Repository;

namespace GameStore.APIService.Controllers;

[Route("api/[controller]")]
[ApiController]
public class GamesController : ControllerBase
{
    private readonly IGameService _gameService;

    public GamesController(IGameService gameService) => _gameService = gameService;

    [HttpGet]
    public async Task<IActionResult> GetGames([FromQuery] string? keyword, [FromQuery] int[]? genreIds, [FromQuery] long? minPrice, [FromQuery] long? maxPrice, [FromQuery] string? sortBy, [FromQuery] bool desc = false, [FromQuery] int page = 1, [FromQuery] int pageSize = 12)
    {
        var (games, totalCount) = await _gameService.Search(keyword, genreIds, minPrice, maxPrice, sortBy, desc, page, pageSize);
        return Ok(PagedResponse<Game>.Create(games, totalCount, page, pageSize));
    }

    [HttpGet("featured")]
    public async Task<IActionResult> GetFeatured([FromQuery] int count = 10)
    {
        var games = await _gameService.GetFeatured(count);
        return Ok(games);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var game = await _gameService.GetWithDetails(id);
        if (game == null) return NotFound(new { message = "Game not found" });
        return Ok(game);
    }

    [HttpGet("genre/{genreId}")]
    public async Task<IActionResult> GetByGenre(int genreId)
    {
        var games = await _gameService.GetByGenre(genreId);
        return Ok(games);
    }

    // ── Stock check (kiểm tra tồn kho key) ──

    /// <summary>Kiểm tra số lượng key khả dụng cho một hoặc nhiều game</summary>
    [HttpGet("stock")]
    public async Task<IActionResult> CheckStock([FromQuery] string? gameIds)
    {
        if (string.IsNullOrEmpty(gameIds)) return Ok(new Dictionary<int, int>());

        var ids = gameIds.Split(',').Select(s => int.TryParse(s.Trim(), out int id) ? id : -1).Where(id => id > 0).ToList();
        if (ids.Count == 0) return Ok(new Dictionary<int, int>());

        var context = HttpContext.RequestServices.GetRequiredService<GameStoreDbContext>();
        var stock = await context.GameKeys
            .Where(k => ids.Contains(k.GameId) && !k.IsUsed && (k.ExpiresAt == null || k.ExpiresAt > DateTime.UtcNow))
            .GroupBy(k => k.GameId)
            .Select(g => new { GameId = g.Key, Count = g.Count() })
            .ToDictionaryAsync(g => g.GameId, g => g.Count);

        // Đảm bảo tất cả gameIds đều có trong response (mặc định 0)
        var result = ids.ToDictionary(id => id, id => stock.GetValueOrDefault(id, 0));
        return Ok(result);
    }
}
