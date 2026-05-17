// GameStore.Repository/EFCore/IGameKeyRepository.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameStore.Entities.Store;

namespace GameStore.Repository.EFCore;

public interface IGameKeyRepository : IRepository<GameKey>
{
    Task<List<GameKey>> GetAvailableKeysAsync(int gameId, int count);
    Task<(List<GameKey> Keys, int TotalCount)> SearchAsync(
        string? keyword, int? gameId, string? status, int page, int pageSize);
    Task<Dictionary<string, int>> GetStatsAsync();
}
