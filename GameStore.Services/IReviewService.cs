// GameStore.Services/IReviewService.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameStore.DTOs.Reviews;

namespace GameStore.Services;

public interface IReviewService
{
    Task<IEnumerable<ReviewDto>> GetGameReviewsAsync(int gameId, int page = 1, int pageSize = 10);
    Task<ReviewDto> AddReviewAsync(int userId, CreateReviewDto dto);
    Task UpdateReviewAsync(int reviewId, int userId, CreateReviewDto dto);
    Task DeleteReviewAsync(int reviewId, int userId);
    Task<bool> HasUserReviewedAsync(int userId, int gameId);
}
