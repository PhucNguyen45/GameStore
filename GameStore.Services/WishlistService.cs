// GameStore.Services/WishlistService.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using GameStore.DTOs.Wishlist;
using GameStore.Entities.Store;
using GameStore.Repository.EFCore;

namespace GameStore.Services;

public class WishlistService : IWishlistService
{
    private readonly IWishlistRepository _wishlistRepo;
    public WishlistService(IWishlistRepository wishlistRepo) => _wishlistRepo = wishlistRepo;

    public async Task<IEnumerable<WishlistItemDto>> GetUserWishlistAsync(int userId)
    {
        var items = await _wishlistRepo.GetByUserAsync(userId);
        return items.Select(w => new WishlistItemDto
        {
            GameId = w.GameId,
            Title = w.Game.Title,
            CoverImageUrl = w.Game.CoverImageUrl,
            Price = w.Game.Price,
            DiscountPrice = w.Game.DiscountPrice,
            AddedAt = w.AddedAt
        });
    }

    public async Task AddToWishlistAsync(int userId, int gameId)
    {
        if (await _wishlistRepo.ExistsAsync(userId, gameId)) return;
        await _wishlistRepo.AddAsync(new Wishlist { UserId = userId, GameId = gameId, AddedAt = DateTime.UtcNow });
    }

    public async Task RemoveFromWishlistAsync(int userId, int gameId)
    {
        var item = await _wishlistRepo.FirstOrDefaultAsync(w => w.UserId == userId && w.GameId == gameId);
        if (item != null) await _wishlistRepo.DeleteAsync(item);
    }

    public async Task<bool> IsInWishlistAsync(int userId, int gameId) =>
        await _wishlistRepo.ExistsAsync(userId, gameId);
}
