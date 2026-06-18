// GameStore.DTOs/Reviews/CreateReviewDto.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GameStore.DTOs.Reviews;

public class CreateReviewDto
{
    public int GameId { get; set; }
    public int Rating { get; set; }
    public string Content { get; set; } = string.Empty;
    public bool IsRecommended { get; set; } = true;
}
