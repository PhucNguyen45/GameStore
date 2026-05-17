// GameStore.Repository/EFCore/IGameGenreRepository.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameStore.Entities.Games;

namespace GameStore.Repository.EFCore;

public interface IGameGenreRepository : IRepository<GameGenre>
{
    Task RemoveByGameIdAsync(int gameId);
}
