// GameStore.DTOs/Games/GameUpdateDto.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GameStore.DTOs.Games
{
    public class GameUpdateDto
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public decimal? Price { get; set; }
        public decimal? DiscountPrice { get; set; }
        public string? TrailerUrl { get; set; }
        public string? CoverImageUrl { get; set; }

    }
}
