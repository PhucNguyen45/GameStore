// GameStore.Repository/EFCore/ILibraryRepository.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameStore.Entities.Store;

namespace GameStore.Repository.EFCore;

public interface ILibraryRepository : IRepository<Library>
{
    Task<List<Library>> GetByUserAsync(int userId);
    Task<bool> IsOwnedAsync(int userId, int gameId);
}
