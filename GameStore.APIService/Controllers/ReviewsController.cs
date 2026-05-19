// GameStore.APIService/Controllers/ReviewsController.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using GameStore.DTOs.Reviews;
using GameStore.Services;
using System.Security.Claims;

namespace GameStore.APIService.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ReviewsController : ControllerBase
{
    private readonly IReviewService _reviewService;
    public ReviewsController(IReviewService reviewService) => _reviewService = reviewService;

    [HttpGet("game/{gameId}")]
    public async Task<IActionResult> GetForGame(int gameId, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        return Ok(await _reviewService.GetGameReviewsAsync(gameId, page, pageSize));
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] CreateReviewDto dto)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var review = await _reviewService.AddReviewAsync(userId, dto);
        return Ok(review);
    }

    [HttpPut("{reviewId}")]
    [Authorize]
    public async Task<IActionResult> Update(int reviewId, [FromBody] CreateReviewDto dto)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        await _reviewService.UpdateReviewAsync(reviewId, userId, dto);
        return Ok(new { message = "Review updated" });
    }

    [HttpDelete("{reviewId}")]
    [Authorize]
    public async Task<IActionResult> Delete(int reviewId)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        await _reviewService.DeleteReviewAsync(reviewId, userId);
        return Ok(new { message = "Review deleted" });
    }

    [HttpGet("check/{gameId}")]
    [Authorize]
    public async Task<IActionResult> CheckReviewed(int gameId)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        bool reviewed = await _reviewService.HasUserReviewedAsync(userId, gameId);
        return Ok(new { reviewed });
    }
}
