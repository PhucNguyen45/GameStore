using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameStore.Entities.Games;
using GameStore.Entities.Users;

namespace GameStore.Entities.Store
{
    public class Wishlist
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int GameId { get; set; }
        public DateTime AddedAt { get; set; } = DateTime.Now;

        public virtual User User { get; set; } = null!;
        public virtual Game Game { get; set; } = null!;
    }
}
