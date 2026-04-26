using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using GameStore.Entities.Games;

namespace GameStore.Repository.EFCore;

public class GameRepository : Repository<Game>, IGameRepository
{
    public GameRepository(GameStoreDbContext context) : base(context) { }

    public async Task<(List<Game> Games, int TotalCount)> SearchAsync(
        string? keyword, int? genreId, decimal? maxPrice,
        string? sortBy, bool descending, int page, int pageSize)
    {
        var query = _dbSet.Include(g => g.GameGenres).ThenInclude(gg => gg.Genre)
            .Where(g => g.IsActive);

        if (!string.IsNullOrEmpty(keyword))
        {
            keyword = keyword.ToLower();
            query = query.Where(g => g.Title.ToLower().Contains(keyword)
                || g.Description.ToLower().Contains(keyword));
        }
        if (genreId.HasValue)
            query = query.Where(g => g.GameGenres.Any(gg => gg.GenreId == genreId));
        if (maxPrice.HasValue)
            query = query.Where(g => (g.DiscountPrice ?? g.Price) <= maxPrice);

        var totalCount = await query.CountAsync();

        query = sortBy?.ToLower() switch
        {
            "price" => descending ? query.OrderByDescending(g => g.DiscountPrice ?? g.Price)
                                  : query.OrderBy(g => g.DiscountPrice ?? g.Price),
            "rating" => descending ? query.OrderByDescending(g => g.Rating)
                                   : query.OrderBy(g => g.Rating),
            "sales" => descending ? query.OrderByDescending(g => g.TotalSales)
                                  : query.OrderBy(g => g.TotalSales),
            "release" => descending ? query.OrderByDescending(g => g.ReleaseDate)
                                    : query.OrderBy(g => g.ReleaseDate),
            _ => query.OrderByDescending(g => g.TotalSales)
        };

        var games = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
        return (games, totalCount);
    }

    public async Task<List<Game>> GetFeaturedAsync(int count = 10) =>
        await _dbSet.Include(g => g.GameGenres).ThenInclude(gg => gg.Genre)
            .Where(g => g.IsActive).OrderByDescending(g => g.TotalSales).Take(count).ToListAsync();

    public async Task<List<Game>> GetByGenreAsync(int genreId) =>
        await _dbSet.Include(g => g.GameGenres).ThenInclude(gg => gg.Genre)
            .Where(g => g.IsActive && g.GameGenres.Any(gg => gg.GenreId == genreId))
            .OrderByDescending(g => g.TotalSales).ToListAsync();

    public async Task<Game?> GetWithDetailsAsync(int id) =>
        await _dbSet.Include(g => g.GameGenres).ThenInclude(gg => gg.Genre)
            .Include(g => g.Reviews).FirstOrDefaultAsync(g => g.Id == id);
}
