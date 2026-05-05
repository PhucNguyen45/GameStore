// GameStore.Entities/Store/Review.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameStore.Entities.Games;
using GameStore.Entities.Users;

namespace GameStore.Entities.Store
{
    public class Review
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int GameId { get; set; }
        public int Rating { get; set; } // 1-5
        public string Content { get; set; } = string.Empty;
        public bool IsRecommended { get; set; }
        public int HelpfulCount { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public virtual User User { get; set; } = null!;
        public virtual Game Game { get; set; } = null!;
    }
}
