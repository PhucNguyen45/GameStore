// GameStore.Services/Admin/IAdminGameService.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameStore.DTOs.Admin;
using GameStore.Entities.Games;

namespace GameStore.Services.Admin;

public interface IAdminGameService
{
    Task<(IEnumerable<Game> Games, int TotalCount)> GetGamesAsync(
        string? keyword, int? genreId, decimal? minPrice, decimal? maxPrice,
        string? sortBy, bool desc, int page, int pageSize);
    Task<Game> CreateGameAsync(AdminGameCreateDto dto);
    Task UpdateGameAsync(int id, AdminGameUpdateDto dto);
    Task DeleteGameAsync(int id);
}
