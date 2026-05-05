// GameStore.Entities/Store/Library.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameStore.Entities.Games;
using GameStore.Entities.Users;

namespace GameStore.Entities.Store
{
    public class Library
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int GameId { get; set; }
        public int? GameKeyId { get; set; }
        public DateTime AcquiredAt { get; set; } = DateTime.UtcNow;
        public DateTime? LastPlayedAt { get; set; }
        public int TotalPlayTime { get; set; } = 0; // Minutes

        public virtual User User { get; set; } = null!;
        public virtual Game Game { get; set; } = null!;
        // public virtual GameKey? GameKey { get; set; }
    }
}
