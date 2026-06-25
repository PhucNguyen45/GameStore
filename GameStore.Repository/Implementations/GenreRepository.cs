// GameStore.Repository/EFCore/GenreRepository.cs

using GameStore.Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using GameStore.DTOs.Genres;
using GameStore.Entities.Games;

namespace GameStore.Repository.Implementations;

public class GenreRepository : Repository<Genre>, IGenreRepository
{
    public GenreRepository(GameStoreDbContext context) : base(context) { }

    public async Task<Genre?> GetByNameAsync(string name) =>
        await _dbSet.FirstOrDefaultAsync(g => g.Name.ToLower() == name.ToLower());

    public async Task<List<GenreWithCountDto>> GetActiveGenresAsync() =>
        await _dbSet.Where(g => g.IsActive)
            .Select(g => new GenreWithCountDto
            {
                Id = g.Id,
                Name = g.Name,
                Description = g.Description,
                IconUrl = g.IconUrl,
                IsActive = g.IsActive,
                GameCount = g.GameGenres.Count()
            })
            .OrderBy(g => g.Name)
            .ToListAsync();

    public async Task<int> GetTotalGenreAsync()
    {
        return await _dbSet.CountAsync(g => g.IsActive);
    }
}
