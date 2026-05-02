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

namespace GameStore.Repository;

public class GameStoreDbContext : DbContext
{
    public GameStoreDbContext(DbContextOptions<GameStoreDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<UserRole> UserRoles => Set<UserRole>();
    public DbSet<AccessToken> AccessTokens => Set<AccessToken>();
    public DbSet<Game> Games => Set<Game>();
    public DbSet<Genre> Genres => Set<Genre>();
    public DbSet<GameGenre> GameGenres => Set<GameGenre>();
    public DbSet<GameKey> GameKeys => Set<GameKey>();
    public DbSet<Library> Libraries => Set<Library>();
    public DbSet<Wishlist> Wishlists => Set<Wishlist>();
    public DbSet<Review> Reviews => Set<Review>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderDetail> OrderDetails => Set<OrderDetail>();
    public DbSet<Setting> Settings => Set<Setting>();

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
            entity.Property(e => e.Wallet).HasColumnType("decimal(18,2)").HasDefaultValue(0m);
            entity.Property(e => e.IsActive).HasDefaultValue(true);

            // Check constraints
            entity.HasCheckConstraint("CK_User_Wallet_NonNegative", "Wallet >= 0");
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
            entity.HasOne(e => e.User)
                  .WithMany(u => u.UserRoles)
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Role)
                  .WithMany(r => r.UserRoles)
                  .HasForeignKey(e => e.RoleId);
            entity.HasIndex(e => new { e.UserId, e.RoleId })
                  .IsUnique();
        });

        // ──────────────── ACCESS TOKEN ────────────────
        modelBuilder.Entity<AccessToken>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.User).WithMany(u => u.AccessTokens).HasForeignKey(e => e.UserId);
        });

        // ──────────────── GENRE ────────────────
        modelBuilder.Entity<Genre>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Name).IsUnique();
        });

        // ──────────────── GAME ────────────────
        modelBuilder.Entity<Game>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Price).HasColumnType("decimal(18,2)");
            entity.Property(e => e.DiscountPrice).HasColumnType("decimal(18,2)");
        });

        // ──────────────── GAME GENRE ────────────────
        modelBuilder.Entity<GameGenre>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.Game).WithMany(g => g.GameGenres).HasForeignKey(e => e.GameId);
            entity.HasOne(e => e.Genre).WithMany(g => g.GameGenres).HasForeignKey(e => e.GenreId);
            entity.HasIndex(e => new { e.GameId, e.GenreId }).IsUnique();
        });

        // ──────────────── GAME KEY ────────────────
        modelBuilder.Entity<GameKey>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.KeyCode).IsUnique();
            entity.HasOne(e => e.Game).WithMany(g => g.GameKeys).HasForeignKey(e => e.GameId);
            entity.HasOne(e => e.OrderDetail).WithMany(o => o.GameKeys).HasForeignKey(e => e.OrderDetailId);
        });

        // ──────────────── LIBRARY ────────────────
        modelBuilder.Entity<Library>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.User).WithMany(u => u.Libraries).HasForeignKey(e => e.UserId);
            entity.HasOne(e => e.Game).WithMany().HasForeignKey(e => e.GameId);
            entity.HasOne(e => e.GameKey).WithMany().HasForeignKey(e => e.GameKeyId);
            entity.HasIndex(e => new { e.UserId, e.GameId }).IsUnique();
        });

        // ──────────────── WISHLIST ────────────────
        modelBuilder.Entity<Wishlist>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.User).WithMany(u => u.Wishlists).HasForeignKey(e => e.UserId);
            entity.HasOne(e => e.Game).WithMany(g => g.Wishlists).HasForeignKey(e => e.GameId);
            entity.HasIndex(e => new { e.UserId, e.GameId }).IsUnique();
        });

        // ──────────────── REVIEW ────────────────
        modelBuilder.Entity<Review>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.User).WithMany(u => u.Reviews).HasForeignKey(e => e.UserId);
            entity.HasOne(e => e.Game).WithMany(g => g.Reviews).HasForeignKey(e => e.GameId);
            entity.HasIndex(e => new { e.UserId, e.GameId }).IsUnique();
        });

        // ──────────────── ORDER ────────────────
        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.TotalAmount).HasColumnType("decimal(18,2)");
            entity.HasOne(e => e.User).WithMany(u => u.Orders).HasForeignKey(e => e.UserId);
        });

        // ──────────────── ORDER DETAIL ────────────────
        modelBuilder.Entity<OrderDetail>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.UnitPrice).HasColumnType("decimal(18,2)");
            entity.HasOne(e => e.Order).WithMany(o => o.OrderDetails).HasForeignKey(e => e.OrderId);
            entity.HasOne(e => e.Game).WithMany(g => g.OrderDetails).HasForeignKey(e => e.GameId);
        });

        // ──────────────── SETTING ────────────────
        modelBuilder.Entity<Setting>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Name).IsUnique();
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
                Created = new DateTime(2025, 1, 1),
                Modified = new DateTime(2025, 1, 1)
            },
            new Role
            {
                Id = 2,
                Name = "User",
                Description = "Regular User",
                IsActive = true,
                Guid = new Guid("20000000-0000-0000-0000-000000000002"),
                Created = new DateTime(2025, 1, 1),
                Modified = new DateTime(2025, 1, 1)
            },
            new Role
            {
                Id = 3,
                Name = "Publisher",
                Description = "Game Publisher",
                IsActive = true,
                Guid = new Guid("30000000-0000-0000-0000-000000000003"),
                Created = new DateTime(2025, 1, 1),
                Modified = new DateTime(2025, 1, 1)
            }
        );

        modelBuilder.Entity<Genre>().HasData(
            new Genre { Id = 1, Name = "Action", Description = "Action games" },
            new Genre { Id = 2, Name = "RPG", Description = "Role-Playing games" },
            new Genre { Id = 3, Name = "Strategy", Description = "Strategy games" },
            new Genre { Id = 4, Name = "Sports", Description = "Sports games" },
            new Genre { Id = 5, Name = "Indie", Description = "Indie games" },
            new Genre { Id = 6, Name = "FPS", Description = "First-Person Shooter" },
            new Genre { Id = 7, Name = "Adventure", Description = "Adventure games" }
        );
    }
}
