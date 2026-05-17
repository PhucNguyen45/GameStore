// GameStore.Services/GameService.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameStore.Entities.Games;
using GameStore.DTOs.Games;
using GameStore.Repository.EFCore;

namespace GameStore.Services;

public class GameService : IGameService
{
    private readonly IGameRepository _gameRepository;

    public GameService(IGameRepository gameRepository)
    {
        _gameRepository = gameRepository;
    }

    public async Task<Game?> GetById(int id) => await _gameRepository.GetByIdAsync(id);
    public async Task<Game?> GetWithDetails(int id) => await _gameRepository.GetWithDetailsAsync(id);
    public async Task<List<Game>> GetFeatured(int count = 10) => await _gameRepository.GetFeaturedAsync(count);
    public async Task<List<Game>> GetByGenre(int genreId) => await _gameRepository.GetByGenreAsync(genreId);

    public async Task<(List<Game> Games, int TotalCount)> Search(string? keyword, int? genreId,
        decimal? minPrice, decimal? maxPrice, string? sortBy, bool descending, int page, int pageSize)
    {
        return await _gameRepository.SearchAsync(keyword, genreId, minPrice, maxPrice, sortBy, descending, page, pageSize);
    }

    public async Task<Game> Create(Game game)
    {
        game.CreatedAt = DateTime.UtcNow;
        game.IsActive = true;
        await _gameRepository.AddAsync(game);
        return game;
    }

    public async Task Update(Game game)
    {
        await _gameRepository.UpdateAsync(game);
    }

    public async Task Delete(int id)
    {
        await _gameRepository.DeleteByIdAsync(id);
    }

    public async Task UpdateGameAsync(int id, GameUpdateDto dto)
    {
        var game = await _gameRepository.GetByIdAsync(id) ?? throw new Exception("Game not found");
        game.Title = dto.Title ?? game.Title;
        game.Description = dto.Description ?? game.Description;
        game.Price = dto.Price ?? game.Price;
        game.DiscountPrice = dto.DiscountPrice ?? game.DiscountPrice;
        game.CoverImageUrl = dto.CoverImageUrl ?? game.CoverImageUrl;
        game.TrailerUrl = dto.TrailerUrl ?? game.TrailerUrl;
        await _gameRepository.UpdateAsync(game);
    }
}
