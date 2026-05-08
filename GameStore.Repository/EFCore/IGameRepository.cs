// GameStore.Repository/EFCore/IGameRepository.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameStore.Entities.Games;

namespace GameStore.Repository.EFCore;

public interface IGameRepository : IRepository<Game>
{
    Task<(List<Game> Games, int TotalCount)> SearchAsync(
        string? keyword, int? genreId, decimal? minPrice, decimal? maxPrice,
        string? sortBy, bool descending, int page, int pageSize);
    Task<List<Game>> GetFeaturedAsync(int count = 10);
    Task<List<Game>> GetByGenreAsync(int genreId);
    Task<Game?> GetWithDetailsAsync(int id);
}
