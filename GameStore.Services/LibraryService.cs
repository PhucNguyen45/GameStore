// GameStore.Services/LibraryService.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using GameStore.Repository.EFCore;

namespace GameStore.Services;

public class LibraryService : ILibraryService
{
    private readonly ILibraryRepository _libraryRepo;
    public LibraryService(ILibraryRepository libraryRepo) => _libraryRepo = libraryRepo;

    public async Task<IEnumerable<object>> GetMyLibraryAsync(int userId)
    {
        var libs = await _libraryRepo.GetByUserAsync(userId);
        return libs.Select(l => new
        {
            l.Game.Id,
            l.Game.Title,
            l.Game.CoverImageUrl,
            l.Game.Developer,
            l.Game.Rating,
            AcquiredAt = l.AcquiredAt
        });
    }

    public async Task<bool> CheckOwnedAsync(int userId, int gameId) =>
        await _libraryRepo.IsOwnedAsync(userId, gameId);
}
