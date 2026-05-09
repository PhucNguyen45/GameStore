// GameStore.APIService/Controllers/LibraryController.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GameStore.Repository;
using GameStore.Services;
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
    public async Task<IActionResult> GetMyLibrary()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        return Ok(await _libraryService.GetMyLibraryAsync(userId));
    }

    [HttpGet("check/{gameId}")]
    public async Task<IActionResult> CheckOwned(int gameId)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var owned = await _libraryService.CheckOwnedAsync(userId, gameId);
        return Ok(new { owned });
    }
}
