// GameStore.Services/ReviewService.cs
using GameStore.DTOs.Reviews;
using GameStore.Entities.Store;
using GameStore.Repository.EFCore;

namespace GameStore.Services;

public class ReviewService : IReviewService
{
    private readonly IReviewRepository _reviewRepo;

    public ReviewService(IReviewRepository reviewRepo)
    {
        _reviewRepo = reviewRepo;
    }

    public async Task<IEnumerable<ReviewDto>> GetGameReviewsAsync(int gameId, int page = 1, int pageSize = 10)
    {
        var (reviews, _) = await _reviewRepo.GetReviewsByGameAsync(gameId, page, pageSize);
        return reviews.Select(r => new ReviewDto
        {
            Id = r.Id,
            UserId = r.UserId,
            Username = r.User?.Username ?? "",
            Rating = r.Rating,
            Content = r.Content,
            IsRecommended = r.IsRecommended,
            HelpfulCount = r.HelpfulCount,
            CreatedAt = r.CreatedAt
        });
    }

    public async Task<ReviewDto> AddReviewAsync(int userId, CreateReviewDto dto)
    {
        if (await _reviewRepo.ExistsAsync(userId, dto.GameId))
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
        await _reviewRepo.AddAsync(review);
        await _reviewRepo.UpdateGameRatingAsync(dto.GameId);

        return new ReviewDto
        {
            Id = review.Id,
            UserId = userId,
            Username = "",  // có thể bổ sung sau
            Rating = review.Rating,
            Content = review.Content,
            IsRecommended = review.IsRecommended,
            CreatedAt = review.CreatedAt
        };
    }

    public async Task UpdateReviewAsync(int reviewId, int userId, CreateReviewDto dto)
    {
        var review = await _reviewRepo.GetByIdAsync(reviewId);
        if (review == null || review.UserId != userId)
            throw new InvalidOperationException("Review not found or not yours.");

        review.Rating = dto.Rating;
        review.Content = dto.Content;
        review.IsRecommended = dto.IsRecommended;
        review.UpdatedAt = DateTime.UtcNow;
        await _reviewRepo.UpdateAsync(review);
        await _reviewRepo.UpdateGameRatingAsync(review.GameId);
    }

    public async Task DeleteReviewAsync(int reviewId, int userId)
    {
        var review = await _reviewRepo.GetByIdAsync(reviewId);
        if (review == null || review.UserId != userId)
            throw new InvalidOperationException("Review not found or not yours.");

        int gameId = review.GameId;
        await _reviewRepo.DeleteAsync(review);
        await _reviewRepo.UpdateGameRatingAsync(gameId);
    }

    public async Task<bool> HasUserReviewedAsync(int userId, int gameId) =>
        await _reviewRepo.ExistsAsync(userId, gameId);
}
