// GameStore.Repository/EFCore/LibraryRepository.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using GameStore.Entities.Store;

namespace GameStore.Repository.EFCore;

public class LibraryRepository : Repository<Library>, ILibraryRepository
{
    public LibraryRepository(GameStoreDbContext context) : base(context) { }

    public async Task<List<Library>> GetByUserAsync(int userId) =>
        await _dbSet.Where(l => l.UserId == userId)
                    .Include(l => l.Game)
                    .OrderByDescending(l => l.AcquiredAt)
                    .ToListAsync();

    public async Task<bool> IsOwnedAsync(int userId, int gameId) =>
        await _dbSet.AnyAsync(l => l.UserId == userId && l.GameId == gameId);
}
