// GameStore.Repository/EFCore/GameQueryExtensions.cs
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using GameStore.Entities.Games;

namespace GameStore.Repository.EFCore;

public static class GameQueryExtensions
{
    /// <summary>
    /// Applies the standard Game projection (including GameGenres with Genre details)
    /// to eliminate duplicate .Select() blocks across GameRepository methods.
    /// </summary>
    public static IQueryable<Game> SelectGameWithGenres(this IQueryable<Game> query)
    {
        return query.Select(g => new Game
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
        });
    }

    /// <summary>
    /// Fills AvailableKeys for a list of games in a single round-trip.
    /// </summary>
    public static async Task FillAvailableKeysAsync(
        this ICollection<Game> games,
        GameStoreDbContext context,
        CancellationToken ct = default)
    {
        var gameIds = games.Select(g => g.Id).ToList();
        if (gameIds.Count == 0) return;

        var availableKeyCounts = await context.GameKeys
            .Where(k => gameIds.Contains(k.GameId) && !k.IsUsed && (k.ExpiresAt == null || k.ExpiresAt > DateTime.UtcNow))
            .GroupBy(k => k.GameId)
            .Select(g => new { GameId = g.Key, Count = g.Count() })
            .ToDictionaryAsync(g => g.GameId, g => g.Count, ct);

        foreach (var game in games)
        {
            game.AvailableKeys = availableKeyCounts.GetValueOrDefault(game.Id, 0);
        }
    }
}
