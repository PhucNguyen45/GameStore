// GameStore.Repository/EFCore/GameKeyRepository.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using GameStore.Entities.Store;

namespace GameStore.Repository.EFCore;

public class GameKeyRepository : Repository<GameKey>, IGameKeyRepository
{
    public GameKeyRepository(GameStoreDbContext context) : base(context) { }

    public async Task<List<GameKey>> GetAvailableKeysAsync(int gameId, int count) =>
        await _dbSet.Where(k => k.GameId == gameId && !k.IsUsed &&
                                (k.ExpiresAt == null || k.ExpiresAt > DateTime.UtcNow))
                   .Take(count).ToListAsync();

    public async Task<(List<GameKey> Keys, int TotalCount)> SearchAsync(
        string? keyword, int? gameId, string? status, int page, int pageSize)
    {
        var query = _dbSet.Include(k => k.Game).AsQueryable();

        if (!string.IsNullOrEmpty(keyword))
            query = query.Where(k => k.KeyCode.Contains(keyword) ||
                                     k.Game.Title.Contains(keyword));
        if (gameId.HasValue)
            query = query.Where(k => k.GameId == gameId.Value);
        if (status == "available")
            query = query.Where(k => !k.IsUsed &&
                                     (k.ExpiresAt == null || k.ExpiresAt > DateTime.UtcNow));
        else if (status == "used")
            query = query.Where(k => k.IsUsed);
        else if (status == "expired")
            query = query.Where(k => k.ExpiresAt != null &&
                                     k.ExpiresAt <= DateTime.UtcNow && !k.IsUsed);

        int totalCount = await query.CountAsync();
        var keys = await query.OrderByDescending(k => k.CreatedAt)
                             .Skip((page - 1) * pageSize)
                             .Take(pageSize)
                             .ToListAsync();
        return (keys, totalCount);
    }

    public async Task<Dictionary<string, int>> GetStatsAsync()
    {
        var totalKeys = await _dbSet.CountAsync();
        var usedKeys = await _dbSet.CountAsync(k => k.IsUsed);
        var availableKeys = await _dbSet.CountAsync(k =>
            !k.IsUsed && (k.ExpiresAt == null || k.ExpiresAt > DateTime.UtcNow));
        var expiredKeys = await _dbSet.CountAsync(k =>
            k.ExpiresAt != null && k.ExpiresAt <= DateTime.UtcNow && !k.IsUsed);
        return new Dictionary<string, int>
        {
            ["totalKeys"] = totalKeys,
            ["usedKeys"] = usedKeys,
            ["availableKeys"] = availableKeys,
            ["expiredKeys"] = expiredKeys
        };
    }
}
