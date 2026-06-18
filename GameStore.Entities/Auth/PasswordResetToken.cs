// GameStore.Entities/Auth/PasswordResetToken.cs
using GameStore.Entities.Users;

namespace GameStore.Entities.Auth;

public class PasswordResetToken
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Token { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime ExpiresAt { get; set; }
    public bool IsUsed { get; set; } = false;

    public virtual User User { get; set; } = null!;
}
