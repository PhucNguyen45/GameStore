// GameStore.Repository/EFCore/IGenreRepository.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameStore.Entities.Games;

namespace GameStore.Repository.EFCore;

public interface IGenreRepository : IRepository<Genre>
{
    Task<Genre?> GetByNameAsync(string name);
    Task<List<Genre>> GetActiveGenresAsync();
    // Thêm cho admin
    Task<(List<Genre> Genres, int TotalCount)> SearchAsync(string? keyword, string? status, bool? hasGames, int page, int pageSize);
    Task<int> GetGameCountAsync(int genreId);
}
