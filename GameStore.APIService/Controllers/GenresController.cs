// GameStore.APIService/Controllers/GenresController.cs
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
public class GenresController : ControllerBase
{
    private readonly IGenreService _genreService;
    public GenresController(IGenreService genreService) => _genreService = genreService;

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await _genreService.GetAll());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var genre = await _genreService.GetById(id);
        return genre == null ? NotFound(new { message = "Genre not found" }) : Ok(genre);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] GenreDto dto)
    {
        var genre = new Genre { Name = dto.Name, Description = dto.Description ?? "", IconUrl = dto.IconUrl ?? "" };
        var created = await _genreService.Create(genre);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, [FromBody] GenreDto dto)
    {
        var genre = await _genreService.GetById(id);
        if (genre == null) return NotFound(new { message = "Genre not found" });
        genre.Name = dto.Name; genre.Description = dto.Description ?? ""; genre.IconUrl = dto.IconUrl ?? "";
        await _genreService.Update(genre);
        return Ok(genre);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        await _genreService.Delete(id);
        return Ok(new { message = "Genre deleted" });
    }
}

public class GenreDto { public string Name { get; set; } = ""; public string? Description { get; set; } public string? IconUrl { get; set; } }
