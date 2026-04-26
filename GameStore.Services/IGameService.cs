using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameStore.Entities.Games;

namespace GameStore.Services;

public interface IGameService
{
    Task<Game?> GetById(int id);
    Task<Game?> GetWithDetails(int id);
    Task<List<Game>> GetFeatured(int count = 10);
    Task<List<Game>> GetByGenre(int genreId);
    Task<(List<Game> Games, int TotalCount)> Search(string? keyword, int? genreId, decimal? maxPrice,
        string? sortBy, bool descending, int page, int pageSize);
    Task<Game> Create(Game game);
    Task Update(Game game);
    Task Delete(int id);
}
