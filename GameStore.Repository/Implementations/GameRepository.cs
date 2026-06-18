using GameStore.Repository.Interfaces;
// GameStore.Repository/EFCore/GameRepository.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using GameStore.Entities.Games;

namespace GameStore.Repository.Implementations;
public class GameRepository : Repository<Game>, IGameRepository
{
    public GameRepository(GameStoreDbContext context) : base(context) { }

    public async Task<(List<Game> Games, int TotalCount)> SearchAsync(string? keyword, int[]? genreIds, long? minPrice, long? maxPrice, string? sortBy, bool descending, int page, int pageSize)
    {
        var query = _dbSet
            .AsNoTracking()
            .Where(g => g.IsActive);

        if (!string.IsNullOrEmpty(keyword))
        {
            keyword = keyword.ToLower();
            query = query.Where(g => g.Title.ToLower().Contains(keyword)
                || g.Description.ToLower().Contains(keyword));
        }
        if (genreIds != null && genreIds.Length > 0)
            query = query.Where(g => g.GameGenres.Any(gg => genreIds.Contains(gg.GenreId)));
        if (minPrice.HasValue)
            query = query.Where(g => (g.DiscountPrice ?? g.Price) >= minPrice);
        if (maxPrice.HasValue)
            query = query.Where(g => (g.DiscountPrice ?? g.Price) <= maxPrice);

        var totalCount = await query.CountAsync();

        query = sortBy?.ToLower() switch
        {
            "id" => descending ? query.OrderByDescending(g => g.Id) : query.OrderBy(g => g.Id),
            "price" => descending ? query.OrderByDescending(g => g.DiscountPrice ?? g.Price)
                                  : query.OrderBy(g => g.DiscountPrice ?? g.Price),
            "rating" => descending ? query.OrderByDescending(g => g.Rating)
                                   : query.OrderBy(g => g.Rating),
            "sales" or "totalsales" => descending ? query.OrderByDescending(g => g.TotalSales)
                                                  : query.OrderBy(g => g.TotalSales),
            "release" or "releasedate" => descending ? query.OrderByDescending(g => g.ReleaseDate)
                                                     : query.OrderBy(g => g.ReleaseDate),
            "title" => descending ? query.OrderByDescending(g => g.Title)
                                  : query.OrderBy(g => g.Title),
            "developer" => descending ? query.OrderByDescending(g => g.Developer)
                                      : query.OrderBy(g => g.Developer),
            "discount" => descending
                ? query.OrderByDescending(g => g.Price - (g.DiscountPrice ?? g.Price))
                : query.OrderBy(g => g.Price - (g.DiscountPrice ?? g.Price)),
            "createdat" or "created" => descending ? query.OrderByDescending(g => g.CreatedAt)
                                                    : query.OrderBy(g => g.CreatedAt),
            _ => query.OrderByDescending(g => g.TotalSales)
        };

        var gameIds = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(g => g.Id)
            .ToListAsync();

        var games = await query
            .Where(g => gameIds.Contains(g.Id))
            .SelectGameWithGenres()
            .ToListAsync();

        await games.FillAvailableKeysAsync(_context);

        return (games, totalCount);
    }

    public async Task<List<Game>> GetFeaturedAsync(int count = 10)
    {
        var games = await _dbSet
            .AsNoTracking()
            .Where(g => g.IsActive)
            .OrderByDescending(g => g.TotalSales)
            .Take(count)
            .SelectGameWithGenres()
            .ToListAsync();

        await games.FillAvailableKeysAsync(_context);

        return games;
    }

    public async Task<List<Game>> GetByGenreAsync(int genreId)
    {
        var games = await _dbSet
            .AsNoTracking()
            .Where(g => g.IsActive && g.GameGenres.Any(gg => gg.GenreId == genreId))
            .OrderByDescending(g => g.TotalSales)
            .SelectGameWithGenres()
            .ToListAsync();

        await games.FillAvailableKeysAsync(_context);

        return games;
    }

    public async Task<Game?> GetWithDetailsAsync(int id)
    {
        var game = await _dbSet
            .AsNoTracking()
            .Where(g => g.Id == id)
            .SelectGameWithGenres()
            .FirstOrDefaultAsync();

        if (game != null)
        {
            game.AvailableKeys = await _context.GameKeys
                .CountAsync(k => k.GameId == id && !k.IsUsed && (k.ExpiresAt == null || k.ExpiresAt > DateTime.UtcNow));
        }

        return game;
    }
}
