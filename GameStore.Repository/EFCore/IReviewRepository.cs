// GameStore.Repository/EFCore/IReviewRepository.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameStore.Entities.Store;

namespace GameStore.Repository.EFCore;

public interface IReviewRepository : IRepository<Review>
{
    Task<(List<Review> Reviews, int TotalCount)> GetReviewsByGameAsync(
        int gameId, int page, int pageSize);
    Task<bool> ExistsAsync(int userId, int gameId);
    Task UpdateGameRatingAsync(int gameId);
}
