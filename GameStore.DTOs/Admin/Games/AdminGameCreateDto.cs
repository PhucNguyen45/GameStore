// GameStore.DTOs/Admin/AdminGameCreateDto.cs
using System.Collections.Generic;
using GameStore.DTOs.Games;

namespace GameStore.DTOs.Admin;

public class AdminGameCreateDto : GameCreateDto
{
    public List<int>? GenreIds { get; set; }
}
