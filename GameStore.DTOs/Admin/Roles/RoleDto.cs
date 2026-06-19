// GameStore.DTOs/Admin/RoleDto.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GameStore.DTOs.Admin;

public class RoleDto
{
    public string Name { get; set; } = "";
    public string? Description { get; set; }
    public bool IsActive { get; set; } = true;
    public List<string>? Permissions { get; set; }
}

public class AssignRoleDto
{
    public int UserId { get; set; }
    public int RoleId { get; set; }
}
