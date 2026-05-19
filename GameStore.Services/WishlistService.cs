// GameStore.Services/WishlistService.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using GameStore.DTOs.Wishlist;
using GameStore.Entities.Store;
using GameStore.Repository;

namespace GameStore.Services;

public class WishlistService : IWishlistService
{
    private readonly GameStoreDbContext _context;

    public WishlistService(GameStoreDbContext context) => _context = context;

    public async Task<IEnumerable<WishlistItemDto>> GetUserWishlistAsync(int userId)
    {
        return await _context.Wishlists
            .Where(w => w.UserId == userId)
            .Include(w => w.Game)
            .OrderByDescending(w => w.AddedAt)
            .Select(w => new WishlistItemDto
            {
                GameId = w.GameId,
                Title = w.Game.Title,
                CoverImageUrl = w.Game.CoverImageUrl,
                Price = w.Game.Price,
                DiscountPrice = w.Game.DiscountPrice,
                AddedAt = w.AddedAt
            })
            .ToListAsync();
    }

    public async Task AddToWishlistAsync(int userId, int gameId)
    {
        bool exists = await _context.Wishlists
            .AnyAsync(w => w.UserId == userId && w.GameId == gameId);
        if (exists) return;

        _context.Wishlists.Add(new Wishlist
        {
            UserId = userId,
            GameId = gameId,
            AddedAt = DateTime.UtcNow
        });
        await _context.SaveChangesAsync();
    }

    public async Task RemoveFromWishlistAsync(int userId, int gameId)
    {
        var item = await _context.Wishlists
            .FirstOrDefaultAsync(w => w.UserId == userId && w.GameId == gameId);
        if (item != null)
        {
            _context.Wishlists.Remove(item);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> IsInWishlistAsync(int userId, int gameId)
    {
        return await _context.Wishlists
            .AnyAsync(w => w.UserId == userId && w.GameId == gameId);
    }
}
