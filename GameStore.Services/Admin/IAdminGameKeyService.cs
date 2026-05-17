// GameStore.Services/Admin/IAdminGameKeyService.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameStore.DTOs.Admin;

namespace GameStore.Services.Admin;

public interface IAdminGameKeyService
{
    Task<object> GetGameKeysAsync(string? keyword, int? gameId, string? status, int page, int pageSize);
    Task CreateGameKeyAsync(GameKeyDto dto);
    Task CreateBatchGameKeysAsync(BatchGameKeyDto dto);
    Task UpdateGameKeyAsync(int id, UpdateGameKeyDto dto);
    Task DeleteGameKeyAsync(int id);
}
