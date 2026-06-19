// GameStore.DTOs/Admin/CategoryDto.cs
using GameStore.DTOs.Genres;

namespace GameStore.DTOs.Admin;

public class CategoryDto : GenreDto
{
    public bool IsActive { get; set; } = true;
}
