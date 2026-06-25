using GameStore.Services.Interfaces.Users;
// GameStore.Services/GenreService.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameStore.DTOs.Genres;
using GameStore.Entities.Games;
using GameStore.Repository.Interfaces;

namespace GameStore.Services.Implementations.Users;

public class GenreService : IGenreService
{
    private readonly IGenreRepository _genreRepository;

    public GenreService(IGenreRepository genreRepository)
    {
        _genreRepository = genreRepository;
    }

    public async Task<List<GenreWithCountDto>> GetAll() => await _genreRepository.GetActiveGenresAsync();
    public async Task<Genre?> GetById(int id) => await _genreRepository.GetByIdAsync(id);
    public async Task<int> GetTotalGenreAsync() => await _genreRepository.GetTotalGenreAsync();

    public async Task<Genre> Create(Genre genre)
    {
        await _genreRepository.AddAsync(genre);
        return genre;
    }

    public async Task Update(Genre genre) => await _genreRepository.UpdateAsync(genre);

    public async Task Delete(int id)
    {
        var genre = await _genreRepository.GetByIdAsync(id);
        if (genre != null)
        {
            genre.IsActive = false;
            await _genreRepository.UpdateAsync(genre);
        }
    }
}
