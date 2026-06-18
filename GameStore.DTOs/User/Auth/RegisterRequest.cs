// GameStore.DTOs/Auth/RegisterRequest.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GameStore.DTOs.Auth;

public class RegisterRequest
{
    public string Username { get; set; } = "";
    public string Password { get; set; } = "";
    public string? DisplayName { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
}
