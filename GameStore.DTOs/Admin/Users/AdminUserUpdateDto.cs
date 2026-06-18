// GameStore.DTOs/Admin/AdminUserUpdateDto.cs
using GameStore.DTOs.Users;

namespace GameStore.DTOs.Admin;

public class AdminUserUpdateDto : UpdateUserRequest
{
    /// <summary>Số dư ví (VND)</summary>
    public long? Wallet { get; set; }
    public bool? IsActive { get; set; }
}
