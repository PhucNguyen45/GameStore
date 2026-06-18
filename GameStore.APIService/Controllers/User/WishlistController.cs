// GameStore.APIService/Controllers/WishlistController.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using GameStore.Services;
using System.Security.Claims;

namespace GameStore.APIService.Controllers;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class WishlistController : ControllerBase
{
    private readonly IWishlistService _wishlistService;
    public WishlistController(IWishlistService wishlistService) => _wishlistService = wishlistService;

    [HttpGet]
    public async Task<IActionResult> GetMyWishlist()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        return Ok(await _wishlistService.GetUserWishlistAsync(userId));
    }

    [HttpPost("{gameId}")]
    public async Task<IActionResult> Add(int gameId)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        await _wishlistService.AddToWishlistAsync(userId, gameId);
        return Ok(new { message = "Added to wishlist" });
    }

    [HttpDelete("{gameId}")]
    public async Task<IActionResult> Remove(int gameId)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        await _wishlistService.RemoveFromWishlistAsync(userId, gameId);
        return Ok(new { message = "Removed from wishlist" });
    }

    [HttpGet("check/{gameId}")]
    public async Task<IActionResult> Check(int gameId)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        bool isWishlisted = await _wishlistService.IsInWishlistAsync(userId, gameId);
        return Ok(new { isWishlisted });
    }
}
