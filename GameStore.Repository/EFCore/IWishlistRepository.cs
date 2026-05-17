// GameStore.Repository/EFCore/IWishlistRepository.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameStore.Entities.Store;

namespace GameStore.Repository.EFCore;

public interface IWishlistRepository : IRepository<Wishlist>
{
    Task<List<Wishlist>> GetByUserAsync(int userId);
    Task<bool> ExistsAsync(int userId, int gameId);
}
