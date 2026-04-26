using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameStore.Entities.Games;

namespace GameStore.Entities.Store
{
    public class GameKey
    {
        public int Id { get; set; }
        public int GameId { get; set; }
        public string KeyCode { get; set; } = string.Empty;
        public bool IsUsed { get; set; } = false;
        public int? OrderDetailId { get; set; }
        public DateTime? UsedAt { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public virtual Game Game { get; set; } = null!;
        public virtual OrderDetail? OrderDetail { get; set; }
    }
}
