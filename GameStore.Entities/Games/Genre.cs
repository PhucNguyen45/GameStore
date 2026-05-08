// GameStore.Entities/Games/Genre.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GameStore.Entities.Games
{
    public class Genre
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string IconUrl { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;

        public virtual ICollection<GameGenre> GameGenres { get; set; } = new HashSet<GameGenre>();
    }
}
