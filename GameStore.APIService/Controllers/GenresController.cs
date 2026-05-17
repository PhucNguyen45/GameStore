// GameStore.APIService/Controllers/GenresController.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
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
}
