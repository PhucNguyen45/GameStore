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

        var library = await _context.Orders
            .Where(o => o.UserId == userId && o.Status == "Completed")
            .SelectMany(o => o.OrderDetails)
            .Select(od => new
            {
                od.Game.Id,
                od.Game.Title,
                od.Game.CoverImageUrl,
                od.Game.Developer,
                od.Game.Rating,
                AcquiredAt = od.Order.OrderDate
            })
            .Distinct()
            .ToListAsync();

        return Ok(library);
    }

    [HttpGet("check/{gameId}")]
    public async Task<IActionResult> CheckOwned(int gameId)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        var owned = await _context.OrderDetails
            .AnyAsync(od => od.Order.UserId == userId
                        && od.Order.Status == "Completed"
                        && od.GameId == gameId);

        return Ok(new { owned });
    }
}
