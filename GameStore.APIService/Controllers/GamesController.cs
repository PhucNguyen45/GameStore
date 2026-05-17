// GameStore.APIService/Controllers/GamesController.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using GameStore.Services;

namespace GameStore.APIService.Controllers;

[Route("api/[controller]")]
[ApiController]
public class GamesController : ControllerBase
{
    private readonly IGameService _gameService;

    public GamesController(IGameService gameService) => _gameService = gameService;

    [HttpGet]
    public async Task<IActionResult> GetGames([FromQuery] string? keyword, [FromQuery] int? genreId, [FromQuery] decimal? minPrice, [FromQuery] decimal? maxPrice, [FromQuery] string? sortBy, [FromQuery] bool desc = false, [FromQuery] int page = 1, [FromQuery] int pageSize = 12)
    {
        var (games, totalCount) = await _gameService.Search(keyword, genreId, minPrice, maxPrice, sortBy, desc, page, pageSize);
        return Ok(new { data = games, totalCount, page, pageSize, totalPages = (int)Math.Ceiling((double)totalCount / pageSize) });
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
}
