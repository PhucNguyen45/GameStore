// GameStore.Services/Admin/AdminGameService.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameStore.DTOs.Admin;
using GameStore.Entities.Games;
using GameStore.Entities.Store;
using GameStore.Repository.EFCore;

namespace GameStore.Services.Admin;

public class AdminGameService : IAdminGameService
{
    private readonly IGameService _gameService;
    private readonly IGameRepository _gameRepo;
    private readonly IGenreRepository _genreRepo;
    private readonly IGameKeyRepository _gameKeyRepo;
    private readonly IGameGenreRepository _gameGenreRepo; // mới

    public AdminGameService(
        IGameService gameService,
        IGameRepository gameRepo,
        IGenreRepository genreRepo,
        IGameKeyRepository gameKeyRepo,
        IGameGenreRepository gameGenreRepo) // Thêm
    {
        _gameService = gameService;
        _gameRepo = gameRepo;
        _genreRepo = genreRepo;
        _gameKeyRepo = gameKeyRepo;
        _gameGenreRepo = gameGenreRepo;
    }

    public async Task<(IEnumerable<Game> Games, int TotalCount)> GetGamesAsync(
        string? keyword, int? genreId, decimal? minPrice, decimal? maxPrice,
        string? sortBy, bool desc, int page, int pageSize)
    {
        return await _gameRepo.SearchAsync(keyword, genreId, minPrice, maxPrice,
            sortBy ?? "createdat", desc, page, pageSize);
    }

    public async Task<Game> CreateGameAsync(AdminGameCreateDto dto)
    {
        var game = new Game
        {
            Title = dto.Title,
            Description = dto.Description ?? "",
            Price = dto.Price,
            DiscountPrice = dto.DiscountPrice,
            Developer = dto.Developer ?? "",
            Publisher = dto.Publisher ?? "",
            ReleaseDate = dto.ReleaseDate ?? DateTime.UtcNow,
            TrailerUrl = dto.TrailerUrl ?? "",
            CoverImageUrl = dto.CoverImageUrl ?? "",
            MinimumOS = dto.MinimumOS ?? "",
            MinimumProcessor = dto.MinimumProcessor ?? "",
            MinimumMemory = dto.MinimumMemory ?? "",
            MinimumGraphics = dto.MinimumGraphics ?? "",
            MinimumStorage = dto.MinimumStorage ?? ""
        };
        var created = await _gameService.Create(game);

        if (dto.GenreIds != null && dto.GenreIds.Any())
        {
            var genres = dto.GenreIds.Select(gid => new GameGenre { GameId = created.Id, GenreId = gid });
            await _gameGenreRepo.AddRangeAsync(genres);
        }

        // Tự động sinh 10-20 key
        var random = new Random();
        int keyCount = random.Next(10, 21);
        var keys = new List<GameKey>();
        for (int i = 0; i < keyCount; i++)
        {
            keys.Add(new GameKey
            {
                GameId = created.Id,
                KeyCode = Guid.NewGuid().ToString("N")[..12].ToUpper(),
                ExpiresAt = DateTime.UtcNow.AddDays(1),
                CreatedAt = DateTime.UtcNow
            });
        }
        await _gameKeyRepo.AddRangeAsync(keys);

        return created;
    }

    public async Task UpdateGameAsync(int id, AdminGameUpdateDto dto)
    {
        var existing = await _gameRepo.GetByIdAsync(id)
                       ?? throw new Exception("Game not found");

        existing.Title = dto.Title ?? existing.Title;
        existing.Description = dto.Description ?? existing.Description;
        existing.Price = dto.Price ?? existing.Price;
        existing.DiscountPrice = dto.DiscountPrice ?? existing.DiscountPrice;
        existing.Developer = dto.Developer ?? existing.Developer;
        existing.Publisher = dto.Publisher ?? existing.Publisher;
        existing.CoverImageUrl = dto.CoverImageUrl ?? existing.CoverImageUrl;
        existing.TrailerUrl = dto.TrailerUrl ?? existing.TrailerUrl;
        existing.MinimumOS = dto.MinimumOS ?? existing.MinimumOS;
        existing.MinimumProcessor = dto.MinimumProcessor ?? existing.MinimumProcessor;
        existing.MinimumMemory = dto.MinimumMemory ?? existing.MinimumMemory;
        existing.MinimumGraphics = dto.MinimumGraphics ?? existing.MinimumGraphics;
        existing.MinimumStorage = dto.MinimumStorage ?? existing.MinimumStorage;

        // Cập nhật thể loại
        if (dto.GenreIds != null)
        {
            await _gameGenreRepo.RemoveByGameIdAsync(id);
            if (dto.GenreIds.Any())
            {
                var genres = dto.GenreIds.Select(gid => new GameGenre { GameId = id, GenreId = gid });
                await _gameGenreRepo.AddRangeAsync(genres);
            }
        }

        if (dto.ReleaseDate.HasValue)
            existing.ReleaseDate = dto.ReleaseDate.Value;

        await _gameService.Update(existing);
    }

    public async Task DeleteGameAsync(int id) => await _gameService.Delete(id);
}
