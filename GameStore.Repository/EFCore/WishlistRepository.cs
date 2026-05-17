// GameStore.Repository/EFCore/WishlistRepository.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using GameStore.Entities.Store;

namespace GameStore.Repository.EFCore;

public class WishlistRepository : Repository<Wishlist>, IWishlistRepository
{
    public WishlistRepository(GameStoreDbContext context) : base(context) { }

    public async Task<List<Wishlist>> GetByUserAsync(int userId) =>
        await _dbSet.Where(w => w.UserId == userId)
                    .Include(w => w.Game)
                    .OrderByDescending(w => w.AddedAt)
                    .ToListAsync();

    public async Task<bool> ExistsAsync(int userId, int gameId) =>
        await _dbSet.AnyAsync(w => w.UserId == userId && w.GameId == gameId);
}
