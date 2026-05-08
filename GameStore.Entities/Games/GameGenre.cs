// GameStore.Entities/Games/GameGenre.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GameStore.Entities.Games
{
    public class GameGenre
    {
        public int Id { get; set; }
        public int GameId { get; set; }
        public int GenreId { get; set; }

        public virtual Game Game { get; set; } = null!;
        public virtual Genre Genre { get; set; } = null!;
    }
}
