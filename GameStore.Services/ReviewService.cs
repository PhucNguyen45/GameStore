// GameStore.Services/ReviewService.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using GameStore.DTOs.Reviews;
using GameStore.Entities.Store;
using GameStore.Repository;

namespace GameStore.Services;

public class ReviewService : IReviewService
{
    private readonly GameStoreDbContext _context;

    public ReviewService(GameStoreDbContext context) => _context = context;

    public async Task<(IEnumerable<ReviewDto> Reviews, int TotalCount)> GetGameReviewsAsync(int gameId, int page = 1, int pageSize = 10)
    {
        var query = _context.Reviews
            .Where(r => r.GameId == gameId);

        var totalCount = await query.CountAsync();

        var reviews = await query
            .Include(r => r.User)
            .OrderByDescending(r => r.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(r => new ReviewDto
            {
                Id = r.Id,
                UserId = r.UserId,
                Username = r.User.Username,
                Rating = r.Rating,
                Content = r.Content,
                IsRecommended = r.IsRecommended,
                HelpfulCount = r.HelpfulCount,
                CreatedAt = r.CreatedAt
            })
            .ToListAsync();

        return (reviews, totalCount);
    }

    public async Task<ReviewDto> AddReviewAsync(int userId, CreateReviewDto dto)
    {
        bool alreadyReviewed = await _context.Reviews
            .AnyAsync(r => r.UserId == userId && r.GameId == dto.GameId);
        if (alreadyReviewed)
            throw new InvalidOperationException("You have already reviewed this game.");

        var review = new Review
        {
            UserId = userId,
            GameId = dto.GameId,
            Rating = dto.Rating,
            Content = dto.Content,
            IsRecommended = dto.IsRecommended,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        _context.Reviews.Add(review);
        await _context.SaveChangesAsync();

        // Cập nhật rating trung bình của game
        var avg = await _context.Reviews
            .Where(r => r.GameId == dto.GameId)
            .AverageAsync(r => (double?)r.Rating) ?? 0;
        var count = await _context.Reviews.CountAsync(r => r.GameId == dto.GameId);
        var game = await _context.Games.FindAsync(dto.GameId);
        if (game != null)
        {
            game.Rating = avg;
            game.RatingCount = count;
            await _context.SaveChangesAsync();
        }

        return new ReviewDto
        {
            Id = review.Id,
            UserId = userId,
            Username = (await _context.Users.FindAsync(userId))?.Username ?? "",
            Rating = review.Rating,
            Content = review.Content,
            IsRecommended = review.IsRecommended,
            CreatedAt = review.CreatedAt
        };
    }

    public async Task UpdateReviewAsync(int reviewId, int userId, CreateReviewDto dto)
    {
        var review = await _context.Reviews.FindAsync(reviewId);
        if (review == null || review.UserId != userId)
            throw new InvalidOperationException("Review not found or not yours.");

        review.Rating = dto.Rating;
        review.Content = dto.Content;
        review.IsRecommended = dto.IsRecommended;
        review.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        // Recalculate rating
        var avg = await _context.Reviews
            .Where(r => r.GameId == review.GameId)
            .AverageAsync(r => (double?)r.Rating) ?? 0;
        var count = await _context.Reviews.CountAsync(r => r.GameId == review.GameId);
        var game = await _context.Games.FindAsync(review.GameId);
        if (game != null)
        {
            game.Rating = avg;
            game.RatingCount = count;
            await _context.SaveChangesAsync();
        }
    }

    public async Task DeleteReviewAsync(int reviewId, int userId)
    {
        var review = await _context.Reviews.FindAsync(reviewId);
        if (review == null || review.UserId != userId)
            throw new InvalidOperationException("Review not found or not yours.");
        _context.Reviews.Remove(review);
        await _context.SaveChangesAsync();

        // Recalculate rating
        var avg = await _context.Reviews
            .Where(r => r.GameId == review.GameId)
            .AverageAsync(r => (double?)r.Rating) ?? 0;
        var count = await _context.Reviews.CountAsync(r => r.GameId == review.GameId);
        var game = await _context.Games.FindAsync(review.GameId);
        if (game != null)
        {
            game.Rating = avg;
            game.RatingCount = count;
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> HasUserReviewedAsync(int userId, int gameId)
    {
        return await _context.Reviews.AnyAsync(r => r.UserId == userId && r.GameId == gameId);
    }
}
