// GameStore.DTOs/Admin/GameKeyDto.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GameStore.DTOs.Admin;

public class GameKeyDto
{
    public int GameId { get; set; }
    public string KeyCode { get; set; } = "";
    public DateTime? ExpiresAt { get; set; }
}

public class BatchGameKeyDto
{
    public int GameId { get; set; }
    public List<string> KeyCodes { get; set; } = new();
    public DateTime? ExpiresAt { get; set; }
}
