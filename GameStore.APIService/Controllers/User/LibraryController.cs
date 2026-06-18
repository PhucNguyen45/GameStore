// GameStore.APIService/Controllers/LibraryController.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GameStore.Repository;
using GameStore.Services.Interfaces.Users;
using System.Security.Claims;

namespace GameStore.APIService.Controllers;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class LibraryController : ControllerBase
{
    private readonly ILibraryService _libraryService;
    public LibraryController(ILibraryService libraryService) => _libraryService = libraryService;

    [HttpGet]
    public async Task<IActionResult> GetMyLibrary(
        [FromQuery] string? keyword = null,
        [FromQuery] string? sortBy = "recent",
        [FromQuery] int? genreId = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 12)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        var (items, totalCount) = await _libraryService.SearchLibraryAsync(userId, keyword, sortBy, page, pageSize, genreId);
        return Ok(new { data = items, totalCount, page, pageSize });
    }

    [HttpGet("check/{gameId}")]
    public async Task<IActionResult> CheckOwned(int gameId)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var owned = await _libraryService.CheckOwnedAsync(userId, gameId);
        return Ok(new { owned });
    }

    [HttpGet("{gameId}/keys")]
    public async Task<IActionResult> GetGameKeys(int gameId)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        return Ok(await _libraryService.GetGameKeysAsync(userId, gameId));
    }
}
