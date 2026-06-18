// GameStore.DTOs/Genres/GenreDto.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GameStore.DTOs.Genres;

public class GenreDto
{
    public string Name { get; set; } = "";
    public string? Description { get; set; }
    public string? IconUrl { get; set; }
}
