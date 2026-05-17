// GameStore.Repository/EFCore/ReviewRepository.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using GameStore.Entities.Games;
using GameStore.Entities.Store;

namespace GameStore.Repository.EFCore;

public class ReviewRepository : Repository<Review>, IReviewRepository
{
    public ReviewRepository(GameStoreDbContext context) : base(context) { }

    public async Task<(List<Review> Reviews, int TotalCount)> GetReviewsByGameAsync(
        int gameId, int page, int pageSize)
    {
        var query = _dbSet.Include(r => r.User)
                         .Where(r => r.GameId == gameId)
                         .OrderByDescending(r => r.CreatedAt);
        int totalCount = await query.CountAsync();
        var reviews = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
        return (reviews, totalCount);
    }

    public async Task<bool> ExistsAsync(int userId, int gameId) =>
        await _dbSet.AnyAsync(r => r.UserId == userId && r.GameId == gameId);

    public async Task UpdateGameRatingAsync(int gameId)
    {
        var avg = await _dbSet.Where(r => r.GameId == gameId)
                              .AverageAsync(r => (double?)r.Rating) ?? 0;
        var count = await _dbSet.CountAsync(r => r.GameId == gameId);
        var game = await _context.Set<Game>().FindAsync(gameId);
        if (game != null)
        {
            game.Rating = avg;
            game.RatingCount = count;
            await _context.SaveChangesAsync();
        }
    }
}
