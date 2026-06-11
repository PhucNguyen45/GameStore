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
    Task<bool> CheckOwnedAsync(int userId, int gameId);
    Task<IEnumerable<object>> GetGameKeysAsync(int userId, int gameId);
}
}
