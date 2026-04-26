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
        var query = _dbSet
            .AsNoTracking()
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

        var games = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(g => new Game
            {
                Id = g.Id,
                Title = g.Title,
                Description = g.Description,
                Price = g.Price,
                DiscountPrice = g.DiscountPrice,
                Developer = g.Developer,
                Publisher = g.Publisher,
                ReleaseDate = g.ReleaseDate,
                CoverImageUrl = g.CoverImageUrl,
                TrailerUrl = g.TrailerUrl,
                Screenshots = g.Screenshots,
                TotalSales = g.TotalSales,
                Rating = g.Rating,
                RatingCount = g.RatingCount,
                IsActive = g.IsActive,
                CreatedAt = g.CreatedAt,
                MinimumOS = g.MinimumOS,
                MinimumProcessor = g.MinimumProcessor,
                MinimumMemory = g.MinimumMemory,
                MinimumGraphics = g.MinimumGraphics,
                MinimumStorage = g.MinimumStorage,
                GameGenres = g.GameGenres.Select(gg => new GameGenre
                {
                    Id = gg.Id,
                    GameId = gg.GameId,
                    GenreId = gg.GenreId,
                    Genre = new Genre
                    {
                        Id = gg.Genre.Id,
                        Name = gg.Genre.Name,
                        Description = gg.Genre.Description,
                        IconUrl = gg.Genre.IconUrl,
                        IsActive = gg.Genre.IsActive
                    }
                }).ToList()
            })
            .ToListAsync();

        return (games, totalCount);
    }

    public async Task<List<Game>> GetFeaturedAsync(int count = 10)
    {
        return await _dbSet
            .AsNoTracking()
            .Where(g => g.IsActive)
            .OrderByDescending(g => g.TotalSales)
            .Take(count)
            .Select(g => new Game
            {
                Id = g.Id,
                Title = g.Title,
                Description = g.Description,
                Price = g.Price,
                DiscountPrice = g.DiscountPrice,
                Developer = g.Developer,
                Publisher = g.Publisher,
                ReleaseDate = g.ReleaseDate,
                CoverImageUrl = g.CoverImageUrl,
                TrailerUrl = g.TrailerUrl,
                Screenshots = g.Screenshots,
                TotalSales = g.TotalSales,
                Rating = g.Rating,
                RatingCount = g.RatingCount,
                IsActive = g.IsActive,
                CreatedAt = g.CreatedAt,
                MinimumOS = g.MinimumOS,
                MinimumProcessor = g.MinimumProcessor,
                MinimumMemory = g.MinimumMemory,
                MinimumGraphics = g.MinimumGraphics,
                MinimumStorage = g.MinimumStorage,
                GameGenres = g.GameGenres.Select(gg => new GameGenre
                {
                    Id = gg.Id,
                    GameId = gg.GameId,
                    GenreId = gg.GenreId,
                    Genre = new Genre
                    {
                        Id = gg.Genre.Id,
                        Name = gg.Genre.Name,
                        Description = gg.Genre.Description,
                        IconUrl = gg.Genre.IconUrl,
                        IsActive = gg.Genre.IsActive
                    }
                }).ToList()
            })
            .ToListAsync();
    }

    public async Task<List<Game>> GetByGenreAsync(int genreId)
    {
        return await _dbSet
            .AsNoTracking()
            .Where(g => g.IsActive && g.GameGenres.Any(gg => gg.GenreId == genreId))
            .OrderByDescending(g => g.TotalSales)
            .Select(g => new Game
            {
                Id = g.Id,
                Title = g.Title,
                Description = g.Description,
                Price = g.Price,
                DiscountPrice = g.DiscountPrice,
                Developer = g.Developer,
                Publisher = g.Publisher,
                ReleaseDate = g.ReleaseDate,
                CoverImageUrl = g.CoverImageUrl,
                TrailerUrl = g.TrailerUrl,
                Screenshots = g.Screenshots,
                TotalSales = g.TotalSales,
                Rating = g.Rating,
                RatingCount = g.RatingCount,
                IsActive = g.IsActive,
                CreatedAt = g.CreatedAt,
                MinimumOS = g.MinimumOS,
                MinimumProcessor = g.MinimumProcessor,
                MinimumMemory = g.MinimumMemory,
                MinimumGraphics = g.MinimumGraphics,
                MinimumStorage = g.MinimumStorage,
                GameGenres = g.GameGenres.Select(gg => new GameGenre
                {
                    Id = gg.Id,
                    GameId = gg.GameId,
                    GenreId = gg.GenreId,
                    Genre = new Genre
                    {
                        Id = gg.Genre.Id,
                        Name = gg.Genre.Name,
                        Description = gg.Genre.Description,
                        IconUrl = gg.Genre.IconUrl,
                        IsActive = gg.Genre.IsActive
                    }
                }).ToList()
            })
            .ToListAsync();
    }

    public async Task<Game?> GetWithDetailsAsync(int id)
    {
        return await _dbSet
            .AsNoTracking()
            .Where(g => g.Id == id)
            .Select(g => new Game
            {
                Id = g.Id,
                Title = g.Title,
                Description = g.Description,
                Price = g.Price,
                DiscountPrice = g.DiscountPrice,
                Developer = g.Developer,
                Publisher = g.Publisher,
                ReleaseDate = g.ReleaseDate,
                CoverImageUrl = g.CoverImageUrl,
                TrailerUrl = g.TrailerUrl,
                Screenshots = g.Screenshots,
                TotalSales = g.TotalSales,
                Rating = g.Rating,
                RatingCount = g.RatingCount,
                IsActive = g.IsActive,
                CreatedAt = g.CreatedAt,
                MinimumOS = g.MinimumOS,
                MinimumProcessor = g.MinimumProcessor,
                MinimumMemory = g.MinimumMemory,
                MinimumGraphics = g.MinimumGraphics,
                MinimumStorage = g.MinimumStorage,
                GameGenres = g.GameGenres.Select(gg => new GameGenre
                {
                    Id = gg.Id,
                    GameId = gg.GameId,
                    GenreId = gg.GenreId,
                    Genre = new Genre
                    {
                        Id = gg.Genre.Id,
                        Name = gg.Genre.Name,
                        Description = gg.Genre.Description,
                        IconUrl = gg.Genre.IconUrl,
                        IsActive = gg.Genre.IsActive
                    }
                }).ToList()
            })
            .FirstOrDefaultAsync();
    }
}
