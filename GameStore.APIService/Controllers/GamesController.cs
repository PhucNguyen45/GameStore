// GameStore.APIService/Controllers/GamesController.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using GameStore.Entities.Games;
using GameStore.Services;

namespace GameStore.APIService.Controllers;

[Route("api/[controller]")]
[ApiController]
public class GamesController : ControllerBase
{
    private readonly IGameService _gameService;

    public GamesController(IGameService gameService) => _gameService = gameService;

    [HttpGet]
    public async Task<IActionResult> GetGames([FromQuery] string? keyword, [FromQuery] int? genreId,
        [FromQuery] decimal? maxPrice, [FromQuery] string? sortBy, [FromQuery] bool desc = false,
        [FromQuery] int page = 1, [FromQuery] int pageSize = 12)
    {
        var (games, totalCount) = await _gameService.Search(keyword, genreId, maxPrice, sortBy, desc, page, pageSize);
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

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] GameCreateDto dto)
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
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, [FromBody] GameUpdateDto dto)
    {
        var game = await _gameService.GetById(id);
        if (game == null) return NotFound(new { message = "Game not found" });
        game.Title = dto.Title ?? game.Title; game.Description = dto.Description ?? game.Description;
        game.Price = dto.Price ?? game.Price; game.DiscountPrice = dto.DiscountPrice ?? game.DiscountPrice;
        game.CoverImageUrl = dto.CoverImageUrl ?? game.CoverImageUrl; game.TrailerUrl = dto.TrailerUrl ?? game.TrailerUrl;
        await _gameService.Update(game);
        return Ok(game);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        await _gameService.Delete(id);
        return Ok(new { message = "Game deleted" });
    }
}

public class GameCreateDto
{
    public string Title { get; set; } = ""; public string? Description { get; set; }
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
}

public class GameUpdateDto
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public decimal? Price { get; set; }
    public decimal? DiscountPrice { get; set; }
    public string? TrailerUrl { get; set; }
    public string? CoverImageUrl { get; set; }
}
