// GameStore.Services/IGenreService.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameStore.Entities.Games;

namespace GameStore.Services;

public interface IGenreService
{
    Task<List<Genre>> GetAll();
    Task<Genre?> GetById(int id);
    Task<Genre> Create(Genre genre);
    Task Update(Genre genre);
    Task Delete(int id);
}
