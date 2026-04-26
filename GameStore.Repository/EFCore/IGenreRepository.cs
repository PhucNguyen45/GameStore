using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameStore.Entities.Games;

namespace GameStore.Repository.EFCore;

public interface IGenreRepository : IRepository<Genre>
{
    Task<Genre?> GetByNameAsync(string name);
    Task<List<Genre>> GetActiveGenresAsync();
}
