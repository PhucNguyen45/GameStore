// GameStore.Services/LibraryService.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using GameStore.Repository;

namespace GameStore.Services;

public class LibraryService : ILibraryService
{
    private readonly GameStoreDbContext _context;

    public LibraryService(GameStoreDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<object>> GetMyLibraryAsync(int userId)
    {
        return await _context.Libraries
            .Where(l => l.UserId == userId)
            .Include(l => l.Game)
            .Select(l => new
            {
                l.Game.Id,
                l.Game.Title,
                l.Game.CoverImageUrl,
                l.Game.Developer,
                l.Game.Rating,
                AcquiredAt = l.AcquiredAt
            })
            .ToListAsync();
    }

    public async Task<bool> CheckOwnedAsync(int userId, int gameId)
    {
        return await _context.Libraries.AnyAsync(l => l.UserId == userId && l.GameId == gameId);
    }

    public async Task<IEnumerable<object>> GetGameKeysAsync(int userId, int gameId)
    {
        // Query keys from OrderDetail → GameKeys relationship
        // (Library.GameKeyId is not used; keys are linked via OrderDetail)
        return await _context.OrderDetails
            .Where(od => od.Order.UserId == userId && od.GameId == gameId)
            .SelectMany(od => od.GameKeys)
            .Select(gk => new
            {
                gk.Id,
                gk.KeyCode,
                gk.IsUsed,
                gk.UsedAt,
                gk.ExpiresAt,
                AcquiredAt = gk.UsedAt ?? gk.CreatedAt
            })
            .ToListAsync();
    }
}
