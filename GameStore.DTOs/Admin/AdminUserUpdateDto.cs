// GameStore.DTOs/Admin/AdminUserUpdateDto.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GameStore.DTOs.Admin;

public class AdminUserUpdateDto
{
    public string? DisplayName { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? AvatarUrl { get; set; }
    public decimal? Wallet { get; set; }
    public bool? IsActive { get; set; }
}
