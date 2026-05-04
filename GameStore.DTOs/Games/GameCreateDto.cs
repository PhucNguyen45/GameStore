// GameStore.DTOs/Games/GameCreateDto.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GameStore.DTOs.Games
{
    public class GameCreateDto
    {
        public string Title { get; set; } = ""; public string? Description { get; set; }
        public decimal Price { get; set; }
        public decimal? DiscountPrice { get; set; }
        public string? Developer { get; set; }
        public string? Publisher { get; set; }
        public DateTime ReleaseDate { get; set; }
        public string? TrailerUrl { get; set; }
        public string? CoverImageUrl { get; set; }
        public string? MinimumOS { get; set; }
        public string? MinimumProcessor { get; set; }
        public string? MinimumMemory { get; set; }
        public string? MinimumGraphics { get; set; }
        public string? MinimumStorage { get; set; }
    }
}
