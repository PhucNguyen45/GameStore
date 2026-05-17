// GameStore.Services/Admin/AdminGameKeyService.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameStore.DTOs.Admin;
using GameStore.Entities.Store;
using GameStore.Repository.EFCore;

namespace GameStore.Services.Admin;

public class AdminGameKeyService : IAdminGameKeyService
{
    private readonly IGameKeyRepository _gameKeyRepo;
    private readonly IGameRepository _gameRepo;

    public AdminGameKeyService(IGameKeyRepository gameKeyRepo, IGameRepository gameRepo)
    {
        _gameKeyRepo = gameKeyRepo;
        _gameRepo = gameRepo;
    }

    public async Task<object> GetGameKeysAsync(string? keyword, int? gameId, string? status, int page, int pageSize)
    {
        var (keys, totalCount) = await _gameKeyRepo.SearchAsync(keyword, gameId, status, page, pageSize);
        var stats = await _gameKeyRepo.GetStatsAsync();
        var data = keys.Select(k => new
        {
            k.Id,
            k.GameId,
            gameTitle = k.Game?.Title ?? "",
            k.KeyCode,
            k.IsUsed,
            k.OrderDetailId,
            k.UsedAt,
            k.CreatedAt,
            k.ExpiresAt
        }).ToList();
        return new { data, totalCount, stats };
    }

    public async Task CreateGameKeyAsync(GameKeyDto dto)
    {
        var game = await _gameRepo.GetByIdAsync(dto.GameId) ?? throw new Exception("Game not found");
        if (await _gameKeyRepo.FirstOrDefaultAsync(k => k.KeyCode == dto.KeyCode) != null)
            throw new Exception("Key code already exists");
        await _gameKeyRepo.AddAsync(new GameKey
        {
            GameId = dto.GameId,
            KeyCode = dto.KeyCode,
            ExpiresAt = dto.ExpiresAt
        });
    }

    public async Task CreateBatchGameKeysAsync(BatchGameKeyDto dto)
    {
        var game = await _gameRepo.GetByIdAsync(dto.GameId) ?? throw new Exception("Game not found");
        var existing = new HashSet<string>((await _gameKeyRepo.GetAllAsync()).Select(k => k.KeyCode));
        var keys = dto.KeyCodes
            .Where(c => !string.IsNullOrWhiteSpace(c) && !existing.Contains(c))
            .Select(c => new GameKey { GameId = dto.GameId, KeyCode = c.Trim(), ExpiresAt = dto.ExpiresAt })
            .ToList();
        if (keys.Count == 0) throw new Exception("No valid keys to add");
        await _gameKeyRepo.AddRangeAsync(keys);
    }

    public async Task UpdateGameKeyAsync(int id, UpdateGameKeyDto dto)
    {
        var key = await _gameKeyRepo.GetByIdAsync(id) ?? throw new Exception("Key not found");
        if (key.IsUsed) throw new Exception("Cannot edit a used key");
        if (!string.IsNullOrWhiteSpace(dto.KeyCode))
        {
            if (await _gameKeyRepo.FirstOrDefaultAsync(k => k.KeyCode == dto.KeyCode && k.Id != id) != null)
                throw new Exception("Key code already exists");
            key.KeyCode = dto.KeyCode;
        }
        key.ExpiresAt = dto.ClearExpiry ? null : (dto.ExpiresAt ?? key.ExpiresAt);
        await _gameKeyRepo.UpdateAsync(key);
    }

    public async Task DeleteGameKeyAsync(int id)
    {
        var key = await _gameKeyRepo.GetByIdAsync(id) ?? throw new Exception("Key not found");
        if (key.IsUsed) throw new Exception("Cannot delete a used key");
        await _gameKeyRepo.DeleteAsync(key);
    }
}
