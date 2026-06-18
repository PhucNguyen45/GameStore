// GameStore.Repository/GameStoreDbContext.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using GameStore.Entities.Users;
using GameStore.Entities.Auth;
using GameStore.Entities.Games;
using GameStore.Entities.Store;
using GameStore.Entities.Settings;
using GameStore.Common.Auth;

namespace GameStore.Repository;

public class GameStoreDbContext : DbContext
{
  public GameStoreDbContext(DbContextOptions<GameStoreDbContext> options) : base(options) { }

  // ── Auth ──
  public DbSet<User> Users => Set<User>();
  public DbSet<Role> Roles => Set<Role>();
  public DbSet<UserRole> UserRoles => Set<UserRole>();
  public DbSet<AccessToken> AccessTokens => Set<AccessToken>();
  public DbSet<PasswordResetToken> PasswordResetTokens => Set<PasswordResetToken>();

  // ── Games ──
  public DbSet<Game> Games => Set<Game>();
  public DbSet<Genre> Genres => Set<Genre>();
  public DbSet<GameGenre> GameGenres => Set<GameGenre>();
  public DbSet<GameKey> GameKeys => Set<GameKey>();

  // ── Store ──
  public DbSet<Library> Libraries => Set<Library>();
  public DbSet<Wishlist> Wishlists => Set<Wishlist>();
  public DbSet<Review> Reviews => Set<Review>();
  public DbSet<Order> Orders => Set<Order>();
  public DbSet<OrderDetail> OrderDetails => Set<OrderDetail>();
  public DbSet<Payment> Payments => Set<Payment>();
  public DbSet<Notification> Notifications => Set<Notification>();

  // ── Wallet ──
  public DbSet<WalletTransaction> WalletTransactions => Set<WalletTransaction>();

  // ── Admin ──
  public DbSet<Setting> Settings => Set<Setting>();
  public DbSet<RolePermission> RolePermissions => Set<RolePermission>();

  protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
  {
    optionsBuilder.ConfigureWarnings(warnings =>
        warnings.Ignore(RelationalEventId.PendingModelChangesWarning));
  }

  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
    base.OnModelCreating(modelBuilder);

    // ──────────────── USER ────────────────
    modelBuilder.Entity<User>(entity =>
    {
      entity.HasKey(e => e.Id);
      entity.HasIndex(e => e.Username).IsUnique();
      entity.HasIndex(e => e.Email).IsUnique();
      // All money columns (Price, DiscountPrice, Wallet, TotalAmount, UnitPrice, Amount,
      // BalanceBefore, BalanceAfter) use bigint which stores values in VND (no decimals).
      entity.Property(e => e.Wallet).HasColumnType("bigint").HasDefaultValue(0L);
      entity.Property(e => e.IsActive).HasDefaultValue(true);
      entity.ToTable(t => t.HasCheckConstraint("CK_User_Wallet_NonNegative", "Wallet >= 0"));
    });

    // ──────────────── ROLE ────────────────
    modelBuilder.Entity<Role>(entity =>
    {
      entity.HasKey(e => e.Id);
      entity.HasIndex(e => e.Name).IsUnique();
      entity.Property(e => e.IsActive).HasDefaultValue(true);
    });

    // ──────────────── USER ROLE ────────────────
    modelBuilder.Entity<UserRole>(entity =>
    {
      entity.HasKey(e => e.Id);
      entity.HasOne(e => e.User).WithMany(u => u.UserRoles).HasForeignKey(e => e.UserId).OnDelete(DeleteBehavior.Cascade);
      entity.HasOne(e => e.Role).WithMany(r => r.UserRoles).HasForeignKey(e => e.RoleId).OnDelete(DeleteBehavior.Cascade);
      entity.HasIndex(e => new { e.UserId, e.RoleId }).IsUnique();
    });

    // ──────────────── ACCESS TOKEN ────────────────
    modelBuilder.Entity<AccessToken>(entity =>
    {
      entity.HasKey(e => e.Id);
      entity.HasOne(e => e.User).WithMany(u => u.AccessTokens).HasForeignKey(e => e.UserId).OnDelete(DeleteBehavior.Cascade);
      entity.HasIndex(e => e.Token).IsUnique();
    });

    // ──────────────── PASSWORD RESET TOKEN ────────────────
    modelBuilder.Entity<PasswordResetToken>(entity =>
    {
      entity.HasKey(e => e.Id);
      entity.HasOne(e => e.User).WithMany().HasForeignKey(e => e.UserId).OnDelete(DeleteBehavior.Cascade);
      entity.HasIndex(e => e.Token).IsUnique();
      entity.HasIndex(e => new { e.UserId, e.IsUsed });
      entity.Property(e => e.IsUsed).HasDefaultValue(false);
    });

    // ──────────────── GENRE ────────────────
    modelBuilder.Entity<Genre>(entity =>
    {
      entity.HasKey(e => e.Id);
      entity.HasIndex(e => e.Name).IsUnique();
      entity.Property(e => e.IsActive).HasDefaultValue(true);
    });

    // ──────────────── GAME ────────────────
    modelBuilder.Entity<Game>(entity =>
    {
      entity.HasKey(e => e.Id);
      entity.Property(e => e.Price).HasColumnType("bigint").HasDefaultValue(0L);
      entity.Property(e => e.DiscountPrice).HasColumnType("bigint");
      entity.Property(e => e.IsActive).HasDefaultValue(true);
      entity.Property(e => e.Rating).HasDefaultValue(0.0);
      entity.Property(e => e.TotalSales).HasDefaultValue(0);
      entity.ToTable(t =>
          {
            t.HasCheckConstraint("CK_Game_Price_NonNegative", "Price >= 0");
            t.HasCheckConstraint("CK_Game_DiscountPrice_NonNegative", "DiscountPrice >= 0");
            t.HasCheckConstraint("CK_Game_Rating_Range", "Rating >= 0 AND Rating <= 5");
          });
      entity.Property(e => e.MinimumOS).HasMaxLength(255);
      entity.Property(e => e.MinimumProcessor).HasMaxLength(255);
      entity.Property(e => e.MinimumMemory).HasMaxLength(255);
      entity.Property(e => e.MinimumGraphics).HasMaxLength(255);
      entity.Property(e => e.MinimumStorage).HasMaxLength(255);
      entity.HasIndex(e => e.Title);
      entity.HasIndex(e => e.IsActive);
      entity.HasIndex(e => e.ReleaseDate);
    });

    // ──────────────── GAME GENRE ────────────────
    modelBuilder.Entity<GameGenre>(entity =>
    {
      entity.HasKey(e => e.Id);
      entity.HasOne(e => e.Game).WithMany(g => g.GameGenres).HasForeignKey(e => e.GameId).OnDelete(DeleteBehavior.Cascade);
      entity.HasOne(e => e.Genre).WithMany(g => g.GameGenres).HasForeignKey(e => e.GenreId).OnDelete(DeleteBehavior.Cascade);
      entity.HasIndex(e => new { e.GameId, e.GenreId }).IsUnique();
    });

    // ──────────────── GAME KEY ────────────────
    modelBuilder.Entity<GameKey>(entity =>
    {
      entity.HasKey(e => e.Id);
      entity.HasIndex(e => e.KeyCode).IsUnique();
      entity.HasIndex(e => new { e.GameId, e.IsUsed });
      entity.HasOne(e => e.Game).WithMany().HasForeignKey(e => e.GameId).OnDelete(DeleteBehavior.Cascade);
      entity.HasOne(e => e.OrderDetail).WithMany(od => od.GameKeys).HasForeignKey(e => e.OrderDetailId).OnDelete(DeleteBehavior.SetNull);
      entity.Property(e => e.IsUsed).HasDefaultValue(false);
    });

    // ──────────────── LIBRARY ────────────────
    modelBuilder.Entity<Library>(entity =>
    {
      entity.HasKey(e => e.Id);
      entity.HasOne(e => e.User).WithMany(u => u.Libraries).HasForeignKey(e => e.UserId).OnDelete(DeleteBehavior.Cascade);
      entity.HasOne(e => e.Game).WithMany().HasForeignKey(e => e.GameId).OnDelete(DeleteBehavior.Cascade);
      entity.HasIndex(e => new { e.UserId, e.GameId }).IsUnique();
      entity.HasIndex(e => e.UserId);
      entity.Property(e => e.TotalPlayTime).HasDefaultValue(0);
    });

    // ──────────────── WISHLIST ────────────────
    modelBuilder.Entity<Wishlist>(entity =>
    {
      entity.HasKey(e => e.Id);
      entity.HasOne(e => e.User).WithMany(u => u.Wishlists).HasForeignKey(e => e.UserId).OnDelete(DeleteBehavior.Cascade);
      entity.HasOne(e => e.Game).WithMany(g => g.Wishlists).HasForeignKey(e => e.GameId).OnDelete(DeleteBehavior.Cascade);
      entity.HasIndex(e => new { e.UserId, e.GameId }).IsUnique();
      entity.HasIndex(e => e.UserId);
    });

    // ──────────────── REVIEW ────────────────
    modelBuilder.Entity<Review>(entity =>
    {
      entity.HasKey(e => e.Id);
      entity.HasOne(e => e.User).WithMany(u => u.Reviews).HasForeignKey(e => e.UserId).OnDelete(DeleteBehavior.Cascade);
      entity.HasOne(e => e.Game).WithMany(g => g.Reviews).HasForeignKey(e => e.GameId).OnDelete(DeleteBehavior.Cascade);
      entity.HasIndex(e => new { e.UserId, e.GameId }).IsUnique();
      entity.HasIndex(e => e.GameId);
      entity.HasIndex(e => e.CreatedAt);
      entity.ToTable(t =>
          {
            t.HasCheckConstraint("CK_Review_Rating_Range", "Rating >= 1 AND Rating <= 5");
            t.HasCheckConstraint("CK_Review_Helpful_NonNegative", "HelpfulCount >= 0");
          });
      entity.Property(e => e.IsRecommended).HasDefaultValue(false);
      entity.Property(e => e.HelpfulCount).HasDefaultValue(0);
    });

    // ──────────────── NOTIFICATION ────────────────
    modelBuilder.Entity<Notification>(entity =>
    {
      entity.HasKey(e => e.Id);
      entity.HasOne(e => e.User)
        .WithMany(u => u.Notifications)
        .HasForeignKey(e => e.UserId)
        .OnDelete(DeleteBehavior.Cascade);
      entity.HasIndex(e => e.UserId);
      entity.HasIndex(e => e.IsRead);
      entity.Property(e => e.IsRead).HasDefaultValue(false);
    });

    // ──────────────── ORDER ────────────────
    modelBuilder.Entity<Order>(entity =>
    {
      entity.HasKey(e => e.Id);
      entity.Property(e => e.TotalAmount).HasColumnType("bigint");
      entity.HasOne(e => e.User).WithMany(u => u.Orders).HasForeignKey(e => e.UserId).OnDelete(DeleteBehavior.Restrict);
      entity.Property(e => e.Status).HasDefaultValue("Pending");
      entity.Property(e => e.PaymentMethod).HasDefaultValue("Wallet");
      entity.ToTable(t => t.HasCheckConstraint("CK_Order_TotalAmount_NonNegative", "TotalAmount >= 0"));
      entity.HasIndex(e => e.UserId);
      entity.HasIndex(e => e.Status);
      entity.HasIndex(e => e.OrderDate);
    });

    // ──────────────── ORDER DETAIL ────────────────
    modelBuilder.Entity<OrderDetail>(entity =>
    {
      entity.HasKey(e => e.Id);
      entity.Property(e => e.UnitPrice).HasColumnType("bigint");
      entity.HasOne(e => e.Order).WithMany(o => o.OrderDetails).HasForeignKey(e => e.OrderId).OnDelete(DeleteBehavior.Cascade);
      entity.HasOne(e => e.Game).WithMany(g => g.OrderDetails).HasForeignKey(e => e.GameId).OnDelete(DeleteBehavior.Restrict);
      entity.ToTable(t =>
          {
            t.HasCheckConstraint("CK_OrderDetail_Quantity_Positive", "Quantity > 0");
            t.HasCheckConstraint("CK_OrderDetail_UnitPrice_NonNegative", "UnitPrice >= 0");
          });
    });

    // ──────────────── PAYMENT ────────────────
    modelBuilder.Entity<Payment>(entity =>
    {
      entity.HasKey(e => e.Id);
      entity.Property(e => e.Amount).HasColumnType("bigint");
      entity.HasOne(e => e.Order).WithMany().HasForeignKey(e => e.OrderId).OnDelete(DeleteBehavior.Cascade);
      entity.Property(e => e.Status).HasDefaultValue("Completed");
      entity.Property(e => e.PaymentMethod).HasDefaultValue("Wallet");
      entity.HasIndex(e => e.OrderId);
      entity.HasIndex(e => e.Status);
    });

    // ──────────────── ROLE PERMISSION ────────────────
    modelBuilder.Entity<RolePermission>(entity =>
    {
      entity.HasKey(e => e.Id);
      entity.HasOne(e => e.Role).WithMany(r => r.RolePermissions).HasForeignKey(e => e.RoleId).OnDelete(DeleteBehavior.Cascade);
      entity.HasIndex(e => new { e.RoleId, e.Permission }).IsUnique();
    });

    // ──────────────── WALLET TRANSACTION ────────────────
    modelBuilder.Entity<WalletTransaction>(entity =>
    {
      entity.HasKey(e => e.Id);
      entity.HasOne(e => e.User).WithMany().HasForeignKey(e => e.UserId).OnDelete(DeleteBehavior.Cascade);
      entity.Property(e => e.Amount).HasColumnType("bigint");
      entity.Property(e => e.BalanceBefore).HasColumnType("bigint");
      entity.Property(e => e.BalanceAfter).HasColumnType("bigint");
      entity.Property(e => e.Type).HasMaxLength(50).IsRequired();
      entity.Property(e => e.Description).HasMaxLength(500);
      entity.HasIndex(e => e.UserId);
      entity.HasIndex(e => e.CreatedAt);
      entity.HasIndex(e => e.Type);
    });

    // ──────────────── SETTING ────────────────
    modelBuilder.Entity<Setting>(entity =>
    {
      entity.HasKey(e => e.Id);
      entity.HasIndex(e => e.Name).IsUnique();
      entity.Property(e => e.IsActive).HasDefaultValue(true);
    });

    // ──────────────── SEED DATA ────────────────
    modelBuilder.Entity<Role>().HasData(
        new Role
        {
          Id = 1,
          Name = "Admin",
          Description = "Administrator",
          IsActive = true,
          Guid = new Guid("10000000-0000-0000-0000-000000000001"),
          Created = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc),
          Modified = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
        },
        new Role
        {
          Id = 2,
          Name = "User",
          Description = "Regular User",
          IsActive = true,
          Guid = new Guid("20000000-0000-0000-0000-000000000002"),
          Created = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc),
          Modified = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
        },
        new Role
        {
          Id = 3,
          Name = "Publisher",
          Description = "Game Publisher",
          IsActive = true,
          Guid = new Guid("30000000-0000-0000-0000-000000000003"),
          Created = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc),
          Modified = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
        }
    );

    byte[] adminSalt;
    var adminPasswordHash = TokenHelper.HashPassword("admin123", out adminSalt);

    modelBuilder.Entity<User>().HasData(new User
    {
      Id = 1,
      Username = "admin",
      Password = adminPasswordHash,
      Salt = adminSalt,
      DisplayName = "Administrator",
      Email = "admin@gamestore.com",
      Wallet = 9999000,
      IsActive = true,
      CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
    });

    modelBuilder.Entity<UserRole>().HasData(new UserRole
    {
      Id = 1,
      UserId = 1,
      RoleId = 1, // Admin
      Guid = new Guid("00000000-0000-0000-0000-000000000001"),
      CreatedBy = "system",
      Created = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc),
      ModifiedBy = "system",
      Modified = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc),
      IsDeleted = false
    });

        // Seed data cho Genre, Game, GameGenre duoc chuyen sang file SQL rieng: database/seeds/seed_data.sql

  }
}

