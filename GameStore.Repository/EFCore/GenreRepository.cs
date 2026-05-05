// GameStore.Repository/EFCore/GenreRepository.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using GameStore.Entities.Games;

namespace GameStore.Repository.EFCore;

public class GenreRepository : Repository<Genre>, IGenreRepository
{
    public GenreRepository(GameStoreDbContext context) : base(context) { }

    public async Task<Genre?> GetByNameAsync(string name) =>
        await _dbSet.FirstOrDefaultAsync(g => g.Name.ToLower() == name.ToLower());

    public async Task<List<Genre>> GetActiveGenresAsync() =>
        await _dbSet.Where(g => g.IsActive).OrderBy(g => g.Name).ToListAsync();
}
