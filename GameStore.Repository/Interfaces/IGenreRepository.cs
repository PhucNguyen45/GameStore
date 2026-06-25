// GameStore.Repository/EFCore/IGenreRepository.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameStore.DTOs.Genres;
using GameStore.Entities.Games;

namespace GameStore.Repository.Interfaces;

public interface IGenreRepository : IRepository<Genre>
{
    Task<Genre?> GetByNameAsync(string name);
    Task<List<GenreWithCountDto>> GetActiveGenresAsync();

    Task<int> GetTotalGenreAsync();
}
