// GameStore.DTOs/Admin/AdminGameUpdateDto.cs
using System;
using System.Collections.Generic;
using GameStore.DTOs.Games;

namespace GameStore.DTOs.Admin;

public class AdminGameUpdateDto : GameUpdateDto
{
    public string? Developer { get; set; }
    public string? Publisher { get; set; }
    public DateTime? ReleaseDate { get; set; }
    public string? MinimumOS { get; set; }
    public string? MinimumProcessor { get; set; }
    public string? MinimumMemory { get; set; }
    public string? MinimumGraphics { get; set; }
    public string? MinimumStorage { get; set; }
    public List<int>? GenreIds { get; set; }
}
