// GameStore.Services/IReviewService.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameStore.DTOs.Reviews;

namespace GameStore.Services.Interfaces.Users;

public interface IReviewService
{
    Task<(IEnumerable<ReviewDto> Reviews, int TotalCount)> GetGameReviewsAsync(int gameId, int page = 1, int pageSize = 10);
    Task<ReviewDto> AddReviewAsync(int userId, CreateReviewDto dto);
    Task<ReviewDto?> GetReviewByIdAsync(int reviewId);
    Task UpdateReviewAsync(int reviewId, int userId, CreateReviewDto dto, bool isAdmin = false);
    Task DeleteReviewAsync(int reviewId, int userId, bool isAdmin = false);
    Task<bool> HasUserReviewedAsync(int userId, int gameId);
}
