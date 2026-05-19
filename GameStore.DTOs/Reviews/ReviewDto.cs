// GameStore.DTOs/Reviews/ReviewDto.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GameStore.DTOs.Reviews;

public class ReviewDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Username { get; set; } = string.Empty;
    public int Rating { get; set; }
    public string Content { get; set; } = string.Empty;
    public bool IsRecommended { get; set; }
    public int HelpfulCount { get; set; }
    public DateTime CreatedAt { get; set; }
}
