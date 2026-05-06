// GameStore.APIService/Controllers/LibraryController.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GameStore.Repository;
using System.Security.Claims;

namespace GameStore.APIService.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class LibraryController : ControllerBase
{
    private readonly GameStoreDbContext _context;

    public LibraryController(GameStoreDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetMyLibrary()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        var library = await _context.Libraries
            .Where(l => l.UserId == userId)
            .Include(l => l.Game)
            .Select(l => new
            {
                l.Game.Id,
                l.Game.Title,
                l.Game.CoverImageUrl,
                l.Game.Developer,
                l.Game.Rating,
                AcquiredAt = l.AcquiredAt
            })
            .ToListAsync();

        return Ok(library);
    }

    [HttpGet("check/{gameId}")]
    public async Task<IActionResult> CheckOwned(int gameId)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        var owned = await _context.Libraries
            .AnyAsync(l => l.UserId == userId && l.GameId == gameId);

        return Ok(new { owned });
    }
}
