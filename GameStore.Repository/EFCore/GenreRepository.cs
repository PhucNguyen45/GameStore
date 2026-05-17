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

    public async Task<(List<Genre> Genres, int TotalCount)> SearchAsync(
        string? keyword, string? status, bool? hasGames, int page, int pageSize)
    {
        var query = _dbSet.AsQueryable();

        if (!string.IsNullOrEmpty(keyword))
            query = query.Where(g => g.Name.Contains(keyword) || g.Description.Contains(keyword));
        if (status == "active")
            query = query.Where(g => g.IsActive);
        else if (status == "inactive")
            query = query.Where(g => !g.IsActive);
        if (hasGames == true)
            query = query.Where(g => _context.Set<GameGenre>().Any(gg => gg.GenreId == g.Id));
        else if (hasGames == false)
            query = query.Where(g => !_context.Set<GameGenre>().Any(gg => gg.GenreId == g.Id));

        int totalCount = await query.CountAsync();
        var genres = await query.OrderBy(g => g.Name)
                                .Skip((page - 1) * pageSize)
                                .Take(pageSize)
                                .ToListAsync();
        return (genres, totalCount);
    }

    public async Task<int> GetGameCountAsync(int genreId) =>
        await _context.Set<GameGenre>().CountAsync(gg => gg.GenreId == genreId);
}
