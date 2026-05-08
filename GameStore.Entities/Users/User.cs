// GameStore.Entities/Users/User.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameStore.Entities.Auth;
using GameStore.Entities.Store;

namespace GameStore.Entities.Users;

public class User
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public byte[] Salt { get; set; } = Array.Empty<byte>();
    public string DisplayName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string AvatarUrl { get; set; } = string.Empty;
    public decimal Wallet { get; set; } = 0;
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public virtual ICollection<UserRole> UserRoles { get; set; } = new HashSet<UserRole>();
    public virtual ICollection<Library> Libraries { get; set; } = new HashSet<Library>();
    public virtual ICollection<Wishlist> Wishlists { get; set; } = new HashSet<Wishlist>();
    public virtual ICollection<Review> Reviews { get; set; } = new HashSet<Review>();
    public virtual ICollection<Order> Orders { get; set; } = new HashSet<Order>();
    public virtual ICollection<AccessToken> AccessTokens { get; set; } = new HashSet<AccessToken>();
}
