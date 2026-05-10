using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using GameStore.DTOs.Wishlist;

namespace GameStore.Services;

public interface IWishlistService
{
    Task<IEnumerable<WishlistItemDto>> GetUserWishlistAsync(int userId);
    Task AddToWishlistAsync(int userId, int gameId);
    Task RemoveFromWishlistAsync(int userId, int gameId);
    Task<bool> IsInWishlistAsync(int userId, int gameId);
}
