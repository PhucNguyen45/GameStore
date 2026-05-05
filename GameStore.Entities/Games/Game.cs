// GameStore.Entities/Games/Game.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameStore.Entities.Store;

namespace GameStore.Entities.Games
{
    public class Game
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public decimal? DiscountPrice { get; set; }
        public string Developer { get; set; } = string.Empty;
        public string Publisher { get; set; } = string.Empty;
        public DateTime ReleaseDate { get; set; }
        public string TrailerUrl { get; set; } = string.Empty;
        public string CoverImageUrl { get; set; } = string.Empty;
        public string Screenshots { get; set; } = "[]"; // JSON array
        public int TotalSales { get; set; }
        public double Rating { get; set; }
        public int RatingCount { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // System Requirements
        public string MinimumOS { get; set; } = string.Empty;
        public string MinimumProcessor { get; set; } = string.Empty;
        public string MinimumMemory { get; set; } = string.Empty;
        public string MinimumGraphics { get; set; } = string.Empty;
        public string MinimumStorage { get; set; } = string.Empty;

        // Navigation
        public virtual ICollection<GameGenre> GameGenres { get; set; } = new HashSet<GameGenre>();
        // public virtual ICollection<GameKey> GameKeys { get; set; } = new HashSet<GameKey>();
        public virtual ICollection<Review> Reviews { get; set; } = new HashSet<Review>();
        public virtual ICollection<Wishlist> Wishlists { get; set; } = new HashSet<Wishlist>();
        public virtual ICollection<OrderDetail> OrderDetails { get; set; } = new HashSet<OrderDetail>();
    }
}
