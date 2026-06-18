// GameStore.DTOs/Admin/AdminUserUpdateDto.cs
using GameStore.DTOs.Users;

namespace GameStore.DTOs.Admin;

public class AdminUserUpdateDto : UpdateUserRequest
{
    public long? Wallet { get; set; }
    public bool? IsActive { get; set; }
}
