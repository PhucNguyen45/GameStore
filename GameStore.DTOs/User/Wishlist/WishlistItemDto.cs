// GameStore.DTOs/Wishlist/WishlistItemDto.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GameStore.DTOs.Wishlist;

public class WishlistItemDto
{
    public int GameId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? CoverImageUrl { get; set; }
    /// <summary>Giá gốc (VND)</summary>
    public long Price { get; set; }
    /// <summary>Giá khuyến mãi (VND)</summary>
    public long? DiscountPrice { get; set; }
    public int AvailableKeys { get; set; }
    public DateTime AddedAt { get; set; }
}
