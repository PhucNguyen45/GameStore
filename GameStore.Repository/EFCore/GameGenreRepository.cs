// GameStore.Repository/EFCore/GameGenreRepository.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using GameStore.Entities.Games;

namespace GameStore.Repository.EFCore;

public class GameGenreRepository : Repository<GameGenre>, IGameGenreRepository
{
    public GameGenreRepository(GameStoreDbContext context) : base(context) { }

    public async Task RemoveByGameIdAsync(int gameId)
    {
        var existing = await _dbSet.Where(gg => gg.GameId == gameId).ToListAsync();
        _dbSet.RemoveRange(existing);
        await _context.SaveChangesAsync();
    }
}
