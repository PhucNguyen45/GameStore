// GameStore.Services/ILibraryService.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GameStore.Services
{
    public interface ILibraryService
    {
        Task<IEnumerable<object>> GetMyLibraryAsync(int userId);
        Task<(IEnumerable<object> Items, int TotalCount)> SearchLibraryAsync(int userId, string? keyword, string? sortBy, int page, int pageSize, int? genreId = null);
        Task<bool> CheckOwnedAsync(int userId, int gameId);
        Task<IEnumerable<object>> GetGameKeysAsync(int userId, int gameId);
    }
}
