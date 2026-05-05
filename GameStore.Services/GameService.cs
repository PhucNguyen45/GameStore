// GameStore.Services/GameService.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameStore.Entities.Games;
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
        decimal? maxPrice, string? sortBy, bool descending, int page, int pageSize) =>
        await _gameRepository.SearchAsync(keyword, genreId, maxPrice, sortBy, descending, page, pageSize);

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
}
