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

    modelBuilder.Entity<Genre>().HasData(
        new Genre { Id = 1, Name = "Action", Description = "Action games" },
        new Genre { Id = 2, Name = "RPG", Description = "Role-Playing games" },
        new Genre { Id = 3, Name = "Strategy", Description = "Strategy games" },
        new Genre { Id = 4, Name = "Sports", Description = "Sports games" },
        new Genre { Id = 5, Name = "Indie", Description = "Indie games" },
        new Genre { Id = 6, Name = "FPS", Description = "First-Person Shooter" },
        new Genre { Id = 7, Name = "Adventure", Description = "Adventure games" },
        new Genre { Id = 8, Name = "Simulation", Description = "Simulation games" },
        new Genre { Id = 9, Name = "Puzzle", Description = "Puzzle games" },
        new Genre { Id = 10, Name = "Horror", Description = "Horror games" },
        new Genre { Id = 11, Name = "Survival", Description = "Survival games" },
        new Genre { Id = 12, Name = "Open World", Description = "Open world games" },
        new Genre { Id = 13, Name = "Stealth", Description = "Stealth games" },
        new Genre { Id = 14, Name = "Racing", Description = "Racing games" },
        new Genre { Id = 15, Name = "Fighting", Description = "Fighting games" },
        new Genre { Id = 16, Name = "MMORPG", Description = "Massively Multiplayer Online RPG" },
        new Genre { Id = 17, Name = "Card Game", Description = "Card-based games" },
        new Genre { Id = 18, Name = "Turn-Based", Description = "Turn-based games" },
        new Genre { Id = 19, Name = "Tower Defense", Description = "Tower defense games" },
        new Genre { Id = 20, Name = "Sandbox", Description = "Sandbox games" },
        new Genre { Id = 21, Name = "Visual Novel", Description = "Story-driven visual novel games" },
        new Genre { Id = 22, Name = "Rhythm", Description = "Music and rhythm-based games" },
        new Genre { Id = 23, Name = "Platformer", Description = "Platform jumping games" },
        new Genre { Id = 24, Name = "Metroidvania", Description = "Exploration-based platformer games" },
        new Genre { Id = 25, Name = "Roguelike", Description = "Roguelike games with permadeath" },
        new Genre { Id = 26, Name = "Roguelite", Description = "Roguelike with progression elements" },
        new Genre { Id = 27, Name = "Battle Royale", Description = "Last-man-standing multiplayer games" },
        new Genre { Id = 28, Name = "MOBA", Description = "Multiplayer Online Battle Arena" },
        new Genre { Id = 29, Name = "Co-op", Description = "Cooperative multiplayer games" },
        new Genre { Id = 30, Name = "Singleplayer", Description = "Single-player focused games" },
        new Genre { Id = 31, Name = "Multiplayer", Description = "Multiplayer focused games" },
        new Genre { Id = 32, Name = "Educational", Description = "Educational and learning games" },
        new Genre { Id = 33, Name = "Casual", Description = "Casual and easy-to-play games" },
        new Genre { Id = 34, Name = "Party", Description = "Party and social games" },
        new Genre { Id = 35, Name = "Narrative", Description = "Story-rich narrative games" }
    );

    modelBuilder.Entity<Game>().HasData(
        new Game
        {
          Id = 1,
          Title = "Gray Zone Warfare",
          Description = "Gray Zone Warfare is an immersive tactical FPS with a maximum focus on realism. Join a Private Military Company and explore a vast MMO open world where every decision matters. Engage in high-stakes PvEvP and PvE combat, uncover the mysteries of Lamang Island, and fight for survival against both human enemies and AI-controlled factions in an unforgiving environment.",
          Price = 34990,
          DiscountPrice = 27990,
          Developer = "MADFINGER Games",
          Publisher = "MADFINGER Games",
          ReleaseDate = new DateTime(2024, 4, 30),
          TrailerUrl = "https://www.youtube.com/watch?v=UlNkVsB56Gw",
          CoverImageUrl = "https://cdn.cloudflare.steamstatic.com/steam/apps/2479810/header.jpg",
          Screenshots = "[]",
          TotalSales = 150000,
          Rating = 4.2,
          RatingCount = 28500,
          IsActive = true,
          MinimumOS = "Windows 10 64-bit",
          MinimumProcessor = "Intel Core i5-8600 / AMD Ryzen 5 2600",
          MinimumMemory = "16 GB RAM",
          MinimumGraphics = "NVIDIA GeForce GTX 1080 / AMD Radeon RX 5700",
          MinimumStorage = "40 GB available space"
        },
        new Game
        {
          Id = 2,
          Title = "World of Tanks",
          Description = "World of Tanks is a team-based, massively multiplayer online action game dedicated to armored warfare in the mid-20th century.",
          Price = 19990,
          DiscountPrice = 9990,
          Developer = "Wargaming",
          Publisher = "Wargaming",
          ReleaseDate = new DateTime(2010, 8, 12),
          CoverImageUrl = "https://cdn.cloudflare.steamstatic.com/steam/apps/1407200/header.jpg",
          Screenshots = "[]",
          TotalSales = 5000000,
          Rating = 4.5,
          RatingCount = 350000,
          IsActive = true,
          MinimumOS = "Windows 7 64-bit",
          MinimumProcessor = "Intel Core i3-2100",
          MinimumMemory = "4 GB RAM",
          MinimumGraphics = "NVIDIA GeForce GT 610",
          MinimumStorage = "70 GB available space"
        },
        new Game
        {
          Id = 3,
          Title = "War Thunder",
          Description = "War Thunder is the most comprehensive free-to-play, cross-platform MMO military game dedicated to aviation, armored vehicles, and naval craft.",
          Price = 14990,
          Developer = "Gaijin Entertainment",
          Publisher = "Gaijin Entertainment",
          ReleaseDate = new DateTime(2013, 8, 15),
          CoverImageUrl = "https://cdn.cloudflare.steamstatic.com/steam/apps/236390/header.jpg",
          Screenshots = "[]",
          TotalSales = 8000000,
          Rating = 4.3,
          RatingCount = 520000,
          IsActive = true,
          MinimumOS = "Windows 10 64-bit",
          MinimumProcessor = "Intel Core i5-2500",
          MinimumMemory = "8 GB RAM",
          MinimumGraphics = "NVIDIA GeForce GTX 660",
          MinimumStorage = "50 GB available space"
        },
        new Game
        {
          Id = 4,
          Title = "Escape from Tarkov",
          Description = "Escape from Tarkov is a hardcore and realistic online first-person action RPG/Simulator with MMO features.",
          Price = 49990,
          DiscountPrice = 44990,
          Developer = "Battlestate Games",
          Publisher = "Battlestate Games",
          ReleaseDate = new DateTime(2017, 7, 27),
          CoverImageUrl = "https://cdn.cloudflare.steamstatic.com/steam/apps/1771980/header.jpg",
          Screenshots = "[]",
          TotalSales = 3000000,
          Rating = 4.1,
          RatingCount = 180000,
          IsActive = true,
          MinimumOS = "Windows 10 64-bit",
          MinimumProcessor = "Intel Core i5-2500K",
          MinimumMemory = "12 GB RAM",
          MinimumGraphics = "NVIDIA GeForce GTX 1050",
          MinimumStorage = "35 GB available space"
        },
        new Game
        {
          Id = 5,
          Title = "ARMA 3",
          Description = "Experience true combat gameplay in a massive military sandbox with a wide variety of single- and multiplayer content.",
          Price = 29990,
          DiscountPrice = 9990,
          Developer = "Bohemia Interactive",
          Publisher = "Bohemia Interactive",
          ReleaseDate = new DateTime(2013, 9, 12),
          CoverImageUrl = "https://cdn.cloudflare.steamstatic.com/steam/apps/107410/header.jpg",
          Screenshots = "[]",
          TotalSales = 10000000,
          Rating = 4.7,
          RatingCount = 450000,
          IsActive = true,
          MinimumOS = "Windows 7 64-bit",
          MinimumProcessor = "Intel Core i5-2300",
          MinimumMemory = "8 GB RAM",
          MinimumGraphics = "NVIDIA GeForce GTX 560",
          MinimumStorage = "45 GB available space"
        },
        new Game
        {
          Id = 6,
          Title = "Hell Let Loose",
          Description = "Join the ever-expanding Hell Let Loose experience - a hardcore World War Two first person shooter with epic battles of 100 players.",
          Price = 39990,
          DiscountPrice = 29990,
          Developer = "Black Matter",
          Publisher = "Team17",
          ReleaseDate = new DateTime(2021, 7, 27),
          CoverImageUrl = "https://cdn.cloudflare.steamstatic.com/steam/apps/686810/header.jpg",
          Screenshots = "[]",
          TotalSales = 2500000,
          Rating = 4.6,
          RatingCount = 85000,
          IsActive = true,
          MinimumOS = "Windows 10 64-bit",
          MinimumProcessor = "Intel Core i5-6600",
          MinimumMemory = "12 GB RAM",
          MinimumGraphics = "NVIDIA GeForce GTX 960",
          MinimumStorage = "30 GB available space"
        },
        new Game
        {
          Id = 7,
          Title = "Squad",
          Description = "Squad is a tactical FPS that provides authentic combat experiences through teamwork, communication, and realistic combat.",
          Price = 49990,
          Developer = "Offworld",
          Publisher = "Offworld",
          ReleaseDate = new DateTime(2020, 9, 23),
          CoverImageUrl = "https://cdn.cloudflare.steamstatic.com/steam/apps/393380/header.jpg",
          Screenshots = "[]",
          TotalSales = 4000000,
          Rating = 4.5,
          RatingCount = 150000,
          IsActive = true,
          MinimumOS = "Windows 10 64-bit",
          MinimumProcessor = "Intel Core i5-2500K",
          MinimumMemory = "8 GB RAM",
          MinimumGraphics = "NVIDIA GeForce GTX 770",
          MinimumStorage = "55 GB available space"
        },
        new Game
        {
          Id = 8,
          Title = "Ready or Not",
          Description = "Ready or Not is an intense, tactical, first-person shooter that depicts a modern-day world in which SWAT police units are called to defuse hostile situations.",
          Price = 39990,
          DiscountPrice = 34990,
          Developer = "VOID Interactive",
          Publisher = "VOID Interactive",
          ReleaseDate = new DateTime(2023, 12, 13),
          CoverImageUrl = "https://cdn.cloudflare.steamstatic.com/steam/apps/1144200/header.jpg",
          Screenshots = "[]",
          TotalSales = 1800000,
          Rating = 4.8,
          RatingCount = 95000,
          IsActive = true,
          MinimumOS = "Windows 10 64-bit",
          MinimumProcessor = "Intel Core i5-4430",
          MinimumMemory = "8 GB RAM",
          MinimumGraphics = "NVIDIA GeForce GTX 960",
          MinimumStorage = "90 GB available space"
        },
        new Game
        {
          Id = 9,
          Title = "Insurgency: Sandstorm",
          Description = "Insurgency: Sandstorm is a team-based, tactical FPS based on lethal close quarters combat and objective-oriented multiplayer gameplay.",
          Price = 29990,
          DiscountPrice = 14990,
          Developer = "New World Interactive",
          Publisher = "Focus Entertainment",
          ReleaseDate = new DateTime(2018, 12, 12),
          CoverImageUrl = "https://cdn.cloudflare.steamstatic.com/steam/apps/581320/header.jpg",
          Screenshots = "[]",
          TotalSales = 3500000,
          Rating = 4.4,
          RatingCount = 170000,
          IsActive = true,
          MinimumOS = "Windows 7 64-bit",
          MinimumProcessor = "Intel Core i5-4440",
          MinimumMemory = "8 GB RAM",
          MinimumGraphics = "NVIDIA GeForce GTX 760",
          MinimumStorage = "40 GB available space"
        },
        new Game
        {
          Id = 10,
          Title = "Ground Branch",
          Description = "Ground Branch is a realistic tactical first-person shooter from one of the developers behind the original Rainbow Six and Ghost Recon games.",
          Price = 29990,
          Developer = "BlackFoot Studios",
          Publisher = "BlackFoot Studios",
          ReleaseDate = new DateTime(2022, 9, 8),
          CoverImageUrl = "https://cdn.cloudflare.steamstatic.com/steam/apps/16900/header.jpg",
          Screenshots = "[]",
          TotalSales = 450000,
          Rating = 4.4,
          RatingCount = 12000,
          IsActive = true,
          MinimumOS = "Windows 10 64-bit",
          MinimumProcessor = "Intel Core i5-2500K",
          MinimumMemory = "8 GB RAM",
          MinimumGraphics = "NVIDIA GeForce GTX 760",
          MinimumStorage = "25 GB available space"
        },
        new Game
        {
          Id = 11,
          Title = "DayZ",
          Description = "DayZ is a hardcore open-world survival game with an extreme emphasis on player interaction in a post-Soviet Republic.",
          Price = 49990,
          DiscountPrice = 29990,
          Developer = "Bohemia Interactive",
          Publisher = "Bohemia Interactive",
          ReleaseDate = new DateTime(2018, 12, 13),
          CoverImageUrl = "https://cdn.cloudflare.steamstatic.com/steam/apps/221100/header.jpg",
          Screenshots = "[]",
          TotalSales = 6000000,
          Rating = 3.9,
          RatingCount = 290000,
          IsActive = true,
          MinimumOS = "Windows 10 64-bit",
          MinimumProcessor = "Intel Core i5-4430",
          MinimumMemory = "8 GB RAM",
          MinimumGraphics = "NVIDIA GeForce GTX 760",
          MinimumStorage = "25 GB available space"
        },
        new Game
        {
          Id = 12,
          Title = "Post Scriptum",
          Description = "Post Scriptum is a WW2 simulation game focusing on historical accuracy, large scale battles, and the difficulty of coalition warfare.",
          Price = 29990,
          DiscountPrice = 19990,
          Developer = "Periscope Games",
          Publisher = "Offworld",
          ReleaseDate = new DateTime(2018, 7, 18),
          CoverImageUrl = "https://cdn.cloudflare.steamstatic.com/steam/apps/736220/header.jpg",
          Screenshots = "[]",
          TotalSales = 1200000,
          Rating = 4.2,
          RatingCount = 28000,
          IsActive = true,
          MinimumOS = "Windows 7 64-bit",
          MinimumProcessor = "Intel Core i5-2500K",
          MinimumMemory = "8 GB RAM",
          MinimumGraphics = "NVIDIA GeForce GTX 970",
          MinimumStorage = "35 GB available space"
        },
        // ── Pagination Test Games (36 games, IDs 13-48) ──
        new Game { Id = 13, Title = "Cyber Runner 2077", Description = "A neon-drenched action-adventure set in a sprawling futuristic metropolis.", Price = 29990, DiscountPrice = 20990, Developer = "Neon Dynamics", Publisher = "Neon Dynamics", ReleaseDate = new DateTime(2024, 3, 15), CoverImageUrl = "https://picsum.photos/seed/game13/460/215", TotalSales = 850000, Rating = 4.3, RatingCount = 45000, MinimumMemory = "8 GB RAM", MinimumStorage = "40 GB available space" },
        new Game { Id = 14, Title = "Realm of Eternity", Description = "An expansive MMORPG set in a fantasy world of magic and dragons.", Price = 49990, DiscountPrice = 39990, Developer = "Fantasy Forge", Publisher = "Fantasy Forge", ReleaseDate = new DateTime(2023, 7, 20), CoverImageUrl = "https://picsum.photos/seed/game14/460/215", TotalSales = 1200000, Rating = 4.6, RatingCount = 78000, MinimumMemory = "16 GB RAM", MinimumStorage = "80 GB available space" },
        new Game { Id = 15, Title = "Tactical Command", Description = "A deep strategy game where you command military forces in realistic warfare scenarios.", Price = 39990, Developer = "War Room Studios", Publisher = "War Room Studios", ReleaseDate = new DateTime(2024, 1, 10), CoverImageUrl = "https://picsum.photos/seed/game15/460/215", TotalSales = 650000, Rating = 4.4, RatingCount = 32000, MinimumMemory = "8 GB RAM", MinimumStorage = "30 GB available space" },
        new Game { Id = 16, Title = "Speed Champions", Description = "High-speed racing across iconic tracks worldwide with customizable vehicles.", Price = 9990, DiscountPrice = 4990, Developer = "Velocity Games", Publisher = "Velocity Games", ReleaseDate = new DateTime(2023, 5, 8), CoverImageUrl = "https://picsum.photos/seed/game16/460/215", TotalSales = 2200000, Rating = 4.1, RatingCount = 95000, MinimumMemory = "8 GB RAM", MinimumStorage = "25 GB available space" },
        new Game { Id = 17, Title = "Pixel Quest", Description = "A charming indie platformer with retro pixel art and clever puzzles.", Price = 19990, DiscountPrice = 14990, Developer = "Retro Revival", Publisher = "Retro Revival", ReleaseDate = new DateTime(2024, 6, 1), CoverImageUrl = "https://picsum.photos/seed/game17/460/215", TotalSales = 350000, Rating = 4.8, RatingCount = 22000, MinimumMemory = "4 GB RAM", MinimumStorage = "2 GB available space" },
        new Game { Id = 18, Title = "Frontline Elite", Description = "An intense squad-based tactical shooter where teamwork is essential.", Price = 24990, Developer = "Battlefront Devs", Publisher = "Battlefront Devs", ReleaseDate = new DateTime(2024, 9, 12), CoverImageUrl = "https://picsum.photos/seed/game18/460/215", TotalSales = 780000, Rating = 4.2, RatingCount = 41000, MinimumMemory = "8 GB RAM", MinimumStorage = "50 GB available space" },
        new Game { Id = 19, Title = "Dark Corridors", Description = "A terrifying first-person horror game set in an abandoned asylum.", Price = 34990, DiscountPrice = 24990, Developer = "Shadow Workshop", Publisher = "Shadow Workshop", ReleaseDate = new DateTime(2024, 10, 31), CoverImageUrl = "https://picsum.photos/seed/game19/460/215", TotalSales = 420000, Rating = 4.5, RatingCount = 28000, MinimumMemory = "8 GB RAM", MinimumStorage = "20 GB available space" },
        new Game { Id = 20, Title = "City Builder Pro", Description = "Design and manage a thriving metropolis from the ground up.", Price = 44990, Developer = "Urban Nexus", Publisher = "Urban Nexus", ReleaseDate = new DateTime(2023, 11, 15), CoverImageUrl = "https://picsum.photos/seed/game20/460/215", TotalSales = 910000, Rating = 4.3, RatingCount = 38000, MinimumMemory = "8 GB RAM", MinimumStorage = "15 GB available space" },
        new Game { Id = 21, Title = "Dragon's Legacy", Description = "An epic open-world RPG where you inherit the power of ancient dragons.", Price = 59990, DiscountPrice = 49990, Developer = "Mythic Studios", Publisher = "Mythic Studios", ReleaseDate = new DateTime(2024, 4, 5), CoverImageUrl = "https://picsum.photos/seed/game21/460/215", TotalSales = 1500000, Rating = 4.7, RatingCount = 89000, MinimumMemory = "16 GB RAM", MinimumStorage = "100 GB available space" },
        new Game { Id = 22, Title = "Arena Brawl", Description = "Fast-paced fighting game with a diverse roster of unique characters.", Price = 14990, DiscountPrice = 9990, Developer = "Fight Club Games", Publisher = "Fight Club Games", ReleaseDate = new DateTime(2024, 2, 14), CoverImageUrl = "https://picsum.photos/seed/game22/460/215", TotalSales = 560000, Rating = 3.9, RatingCount = 31000, MinimumMemory = "4 GB RAM", MinimumStorage = "10 GB available space" },
        new Game { Id = 23, Title = "Card Masters", Description = "Collect, build, and duel in this strategic card game.", Price = 4990, Developer = "Deck Builders Inc", Publisher = "Deck Builders Inc", ReleaseDate = new DateTime(2024, 8, 1), CoverImageUrl = "https://picsum.photos/seed/game23/460/215", TotalSales = 280000, Rating = 4.0, RatingCount = 15000, MinimumMemory = "4 GB RAM", MinimumStorage = "5 GB available space" },
        new Game { Id = 24, Title = "Jump Kingdom", Description = "A delightful platformer through whimsical kingdoms with coins and traps.", Price = 16990, DiscountPrice = 11990, Developer = "Platform Heroes", Publisher = "Platform Heroes", ReleaseDate = new DateTime(2024, 5, 20), CoverImageUrl = "https://picsum.photos/seed/game24/460/215", TotalSales = 410000, Rating = 4.4, RatingCount = 19000, MinimumMemory = "4 GB RAM", MinimumStorage = "8 GB available space" },
        new Game { Id = 25, Title = "Dungeon Crawler X", Description = "A roguelike dungeon crawler with procedurally generated depths.", Price = 22990, Developer = "Rogue Devs", Publisher = "Rogue Devs", ReleaseDate = new DateTime(2024, 3, 1), CoverImageUrl = "https://picsum.photos/seed/game25/460/215", TotalSales = 310000, Rating = 4.6, RatingCount = 17000, MinimumMemory = "4 GB RAM", MinimumStorage = "3 GB available space" },
        new Game { Id = 26, Title = "Last Squad Standing", Description = "Battle royale with squad-based gameplay and unique class abilities.", Price = 0, Developer = "Battle Royale Co", Publisher = "Battle Royale Co", ReleaseDate = new DateTime(2023, 12, 15), CoverImageUrl = "https://picsum.photos/seed/game26/460/215", TotalSales = 3500000, Rating = 3.8, RatingCount = 125000, MinimumMemory = "8 GB RAM", MinimumStorage = "30 GB available space" },
        new Game { Id = 27, Title = "Nexus Arena", Description = "A competitive MOBA with diverse heroes and 5v5 battles.", Price = 0, Developer = "MOBA Creations", Publisher = "MOBA Creations", ReleaseDate = new DateTime(2023, 9, 1), CoverImageUrl = "https://picsum.photos/seed/game27/460/215", TotalSales = 4200000, Rating = 4.2, RatingCount = 200000, MinimumMemory = "8 GB RAM", MinimumStorage = "20 GB available space" },
        new Game { Id = 28, Title = "The Forgotten Tale", Description = "A story-rich narrative adventure where your choices truly matter.", Price = 25990, Developer = "StoryCraft Games", Publisher = "StoryCraft Games", ReleaseDate = new DateTime(2024, 4, 10), CoverImageUrl = "https://picsum.photos/seed/game28/460/215", TotalSales = 190000, Rating = 4.9, RatingCount = 12000, MinimumMemory = "4 GB RAM", MinimumStorage = "12 GB available space" },
        new Game { Id = 29, Title = "Flight Sim Pro", Description = "Realistic flight simulation with detailed aircraft and global scenery.", Price = 54990, DiscountPrice = 44990, Developer = "Aero Dynamics", Publisher = "Aero Dynamics", ReleaseDate = new DateTime(2024, 6, 15), CoverImageUrl = "https://picsum.photos/seed/game29/460/215", TotalSales = 720000, Rating = 4.5, RatingCount = 44000, MinimumMemory = "16 GB RAM", MinimumStorage = "150 GB available space" },
        new Game { Id = 30, Title = "Zen Garden", Description = "A relaxing puzzle game where you cultivate beautiful gardens.", Price = 7990, Developer = "Calm Dev Studios", Publisher = "Calm Dev Studios", ReleaseDate = new DateTime(2024, 7, 4), CoverImageUrl = "https://picsum.photos/seed/game30/460/215", TotalSales = 140000, Rating = 4.7, RatingCount = 8500, MinimumMemory = "4 GB RAM", MinimumStorage = "1 GB available space" },
        new Game { Id = 31, Title = "Fortress Defense", Description = "Classic tower defense with modern twists and upgradeable towers.", Price = 12990, DiscountPrice = 9990, Developer = "Castle Coders", Publisher = "Castle Coders", ReleaseDate = new DateTime(2024, 2, 28), CoverImageUrl = "https://picsum.photos/seed/game31/460/215", TotalSales = 230000, Rating = 4.1, RatingCount = 11000, MinimumMemory = "4 GB RAM", MinimumStorage = "4 GB available space" },
        new Game { Id = 32, Title = "Turn Based Legends", Description = "Master turn-based tactical combat in a rich fantasy world.", Price = 32990, Developer = "Strategy Hub", Publisher = "Strategy Hub", ReleaseDate = new DateTime(2023, 10, 5), CoverImageUrl = "https://picsum.photos/seed/game32/460/215", TotalSales = 380000, Rating = 4.3, RatingCount = 20000, MinimumMemory = "8 GB RAM", MinimumStorage = "15 GB available space" },
        new Game { Id = 33, Title = "Beat Revolution", Description = "An electrifying rhythm game featuring an original soundtrack.", Price = 18990, DiscountPrice = 14990, Developer = "Rhythm Factory", Publisher = "Rhythm Factory", ReleaseDate = new DateTime(2024, 1, 25), CoverImageUrl = "https://picsum.photos/seed/game33/460/215", TotalSales = 170000, Rating = 4.4, RatingCount = 9500, MinimumMemory = "4 GB RAM", MinimumStorage = "6 GB available space" },
        new Game { Id = 34, Title = "Visual Story", Description = "A beautifully illustrated visual novel with multiple endings.", Price = 21990, Developer = "Narrative Labs", Publisher = "Narrative Labs", ReleaseDate = new DateTime(2024, 8, 20), CoverImageUrl = "https://picsum.photos/seed/game34/460/215", TotalSales = 95000, Rating = 4.6, RatingCount = 7000, MinimumMemory = "4 GB RAM", MinimumStorage = "8 GB available space" },
        new Game { Id = 35, Title = "Metroid Realm", Description = "Explore a vast interconnected world in this metroidvania adventure.", Price = 27990, DiscountPrice = 22990, Developer = "Exploration Games", Publisher = "Exploration Games", ReleaseDate = new DateTime(2024, 5, 8), CoverImageUrl = "https://picsum.photos/seed/game35/460/215", TotalSales = 260000, Rating = 4.5, RatingCount = 14000, MinimumMemory = "4 GB RAM", MinimumStorage = "10 GB available space" },
        new Game { Id = 36, Title = "Learn & Play", Description = "Educational games for all ages covering math, science, and language.", Price = 5990, Developer = "EduSoft Games", Publisher = "EduSoft Games", ReleaseDate = new DateTime(2024, 3, 1), CoverImageUrl = "https://picsum.photos/seed/game36/460/215", TotalSales = 80000, Rating = 4.0, RatingCount = 5000, MinimumMemory = "4 GB RAM", MinimumStorage = "2 GB available space" },
        new Game { Id = 37, Title = "Party Mania", Description = "The ultimate party game with dozens of mini-games for friends.", Price = 11990, Developer = "Social Fun Studios", Publisher = "Social Fun Studios", ReleaseDate = new DateTime(2024, 12, 20), CoverImageUrl = "https://picsum.photos/seed/game37/460/215", TotalSales = 200000, Rating = 3.7, RatingCount = 16000, MinimumMemory = "4 GB RAM", MinimumStorage = "3 GB available space" },
        new Game { Id = 38, Title = "Wild Frontier", Description = "An open-world western adventure where you forge your own path.", Price = 42990, DiscountPrice = 34990, Developer = "Open World Devs", Publisher = "Open World Devs", ReleaseDate = new DateTime(2024, 9, 15), CoverImageUrl = "https://picsum.photos/seed/game38/460/215", TotalSales = 580000, Rating = 4.4, RatingCount = 25000, MinimumMemory = "12 GB RAM", MinimumStorage = "60 GB available space" },
        new Game { Id = 39, Title = "Island Survivor", Description = "Stranded on a deserted island, scavenge, craft, and survive.", Price = 15990, DiscountPrice = 11990, Developer = "Survival Tech", Publisher = "Survival Tech", ReleaseDate = new DateTime(2024, 4, 1), CoverImageUrl = "https://picsum.photos/seed/game39/460/215", TotalSales = 340000, Rating = 4.2, RatingCount = 18000, MinimumMemory = "8 GB RAM", MinimumStorage = "15 GB available space" },
        new Game { Id = 40, Title = "Co-op Commandos", Description = "Tactical co-op shooter requiring precise teamwork and planning.", Price = 31990, Developer = "Teamwork Games", Publisher = "Teamwork Games", ReleaseDate = new DateTime(2024, 7, 22), CoverImageUrl = "https://picsum.photos/seed/game40/460/215", TotalSales = 290000, Rating = 4.3, RatingCount = 21000, MinimumMemory = "8 GB RAM", MinimumStorage = "35 GB available space" },
        new Game { Id = 41, Title = "Pixel RPG", Description = "A nostalgic RPG with charming pixel graphics and turn-based combat.", Price = 8990, DiscountPrice = 6990, Developer = "Old School Devs", Publisher = "Old School Devs", ReleaseDate = new DateTime(2024, 6, 10), CoverImageUrl = "https://picsum.photos/seed/game41/460/215", TotalSales = 160000, Rating = 4.5, RatingCount = 11000, MinimumMemory = "4 GB RAM", MinimumStorage = "5 GB available space" },
        new Game { Id = 42, Title = "Tower Crash", Description = "Strategy game where you destroy enemy towers and fortify defenses.", Price = 19990, Developer = "Strategy Labs", Publisher = "Strategy Labs", ReleaseDate = new DateTime(2024, 11, 5), CoverImageUrl = "https://picsum.photos/seed/game42/460/215", TotalSales = 110000, Rating = 3.6, RatingCount = 8000, MinimumMemory = "4 GB RAM", MinimumStorage = "8 GB available space", IsActive = false },
        new Game { Id = 43, Title = "Shadow Agent", Description = "A stealth action game where you infiltrate high-security facilities.", Price = 36990, DiscountPrice = 29990, Developer = "Stealth Inc", Publisher = "Stealth Inc", ReleaseDate = new DateTime(2024, 10, 1), CoverImageUrl = "https://picsum.photos/seed/game43/460/215", TotalSales = 440000, Rating = 4.1, RatingCount = 23000, MinimumMemory = "8 GB RAM", MinimumStorage = "40 GB available space" },
        new Game { Id = 44, Title = "Grand Prix Rally", Description = "Race through treacherous off-road tracks in a demanding rally championship.", Price = 28990, DiscountPrice = 22990, Developer = "Racing Pixels", Publisher = "Racing Pixels", ReleaseDate = new DateTime(2024, 1, 30), CoverImageUrl = "https://picsum.photos/seed/game44/460/215", TotalSales = 510000, Rating = 4.0, RatingCount = 27000, MinimumMemory = "8 GB RAM", MinimumStorage = "25 GB available space" },
        new Game { Id = 45, Title = "Wasteland Warriors", Description = "Post-apocalyptic survival shooter set in a radioactive wasteland.", Price = 23990, Developer = "Post-Apocalypse GS", Publisher = "Post-Apocalypse GS", ReleaseDate = new DateTime(2024, 8, 12), CoverImageUrl = "https://picsum.photos/seed/game45/460/215", TotalSales = 320000, Rating = 4.2, RatingCount = 16000, MinimumMemory = "8 GB RAM", MinimumStorage = "30 GB available space" },
        new Game { Id = 46, Title = "Fantasy Online", Description = "A massive multiplayer online RPG in a persistent fantasy world.", Price = 45990, DiscountPrice = 35990, Developer = "MMO Worlds", Publisher = "MMO Worlds", ReleaseDate = new DateTime(2023, 6, 18), CoverImageUrl = "https://picsum.photos/seed/game46/460/215", TotalSales = 980000, Rating = 4.4, RatingCount = 52000, MinimumMemory = "16 GB RAM", MinimumStorage = "70 GB available space" },
        new Game { Id = 47, Title = "Space Colony", Description = "Build and manage a self-sustaining colony on a distant planet.", Price = 38990, Developer = "Orbital Games", Publisher = "Orbital Games", ReleaseDate = new DateTime(2024, 5, 30), CoverImageUrl = "https://picsum.photos/seed/game47/460/215", TotalSales = 370000, Rating = 4.3, RatingCount = 19000, MinimumMemory = "8 GB RAM", MinimumStorage = "20 GB available space" },
        new Game { Id = 48, Title = "Combat Arena", Description = "Fast-paced multiplayer action game with dynamic arena combat.", Price = 17990, DiscountPrice = 13990, Developer = "Battle Systems", Publisher = "Battle Systems", ReleaseDate = new DateTime(2024, 4, 22), CoverImageUrl = "https://picsum.photos/seed/game48/460/215", TotalSales = 250000, Rating = 3.8, RatingCount = 14000, MinimumMemory = "8 GB RAM", MinimumStorage = "12 GB available space" }
    );
    modelBuilder.Entity<GameGenre>().HasData(
        // Gray Zone Warfare (Id: 1) - Tactical FPS, Open World, Multiplayer, Survival
        new GameGenre { Id = 1, GameId = 1, GenreId = 6 },  // FPS
        new GameGenre { Id = 2, GameId = 1, GenreId = 11 }, // Survival
        new GameGenre { Id = 3, GameId = 1, GenreId = 12 }, // Open World
        new GameGenre { Id = 4, GameId = 1, GenreId = 29 }, // Co-op
        new GameGenre { Id = 5, GameId = 1, GenreId = 31 }, // Multiplayer
        new GameGenre { Id = 6, GameId = 1, GenreId = 1 },  // Action

        // World of Tanks (Id: 2) - MMO, Strategy, Multiplayer, Free to Play, Action
        new GameGenre { Id = 7, GameId = 2, GenreId = 31 }, // Multiplayer
        new GameGenre { Id = 8, GameId = 2, GenreId = 3 },  // Strategy
        new GameGenre { Id = 9, GameId = 2, GenreId = 1 },  // Action
        new GameGenre { Id = 10, GameId = 2, GenreId = 8 }, // Simulation

        // War Thunder (Id: 3) - MMO, Simulation, Multiplayer, Action, Free to Play
        new GameGenre { Id = 11, GameId = 3, GenreId = 31 }, // Multiplayer
        new GameGenre { Id = 12, GameId = 3, GenreId = 8 },  // Simulation
        new GameGenre { Id = 13, GameId = 3, GenreId = 1 },  // Action
        new GameGenre { Id = 14, GameId = 3, GenreId = 3 },  // Strategy

        // Escape from Tarkov (Id: 4) - FPS, Survival, RPG, Multiplayer, Action
        new GameGenre { Id = 15, GameId = 4, GenreId = 6 },  // FPS
        new GameGenre { Id = 16, GameId = 4, GenreId = 11 }, // Survival
        new GameGenre { Id = 17, GameId = 4, GenreId = 2 },  // RPG
        new GameGenre { Id = 18, GameId = 4, GenreId = 31 }, // Multiplayer
        new GameGenre { Id = 19, GameId = 4, GenreId = 1 },  // Action

        // ARMA 3 (Id: 5) - FPS, Simulation, Open World, Multiplayer, Strategy
        new GameGenre { Id = 20, GameId = 5, GenreId = 6 },  // FPS
        new GameGenre { Id = 21, GameId = 5, GenreId = 8 },  // Simulation
        new GameGenre { Id = 22, GameId = 5, GenreId = 12 }, // Open World
        new GameGenre { Id = 23, GameId = 5, GenreId = 31 }, // Multiplayer
        new GameGenre { Id = 24, GameId = 5, GenreId = 3 },  // Strategy
        new GameGenre { Id = 25, GameId = 5, GenreId = 29 }, // Co-op

        // Hell Let Loose (Id: 6) - FPS, Multiplayer, Strategy, Simulation
        new GameGenre { Id = 26, GameId = 6, GenreId = 6 },  // FPS
        new GameGenre { Id = 27, GameId = 6, GenreId = 31 }, // Multiplayer
        new GameGenre { Id = 28, GameId = 6, GenreId = 3 },  // Strategy
        new GameGenre { Id = 29, GameId = 6, GenreId = 8 },  // Simulation
        new GameGenre { Id = 30, GameId = 6, GenreId = 1 },  // Action

        // Squad (Id: 7) - FPS, Multiplayer, Strategy, Simulation, Co-op
        new GameGenre { Id = 31, GameId = 7, GenreId = 6 },  // FPS
        new GameGenre { Id = 32, GameId = 7, GenreId = 31 }, // Multiplayer
        new GameGenre { Id = 33, GameId = 7, GenreId = 3 },  // Strategy
        new GameGenre { Id = 34, GameId = 7, GenreId = 8 },  // Simulation
        new GameGenre { Id = 35, GameId = 7, GenreId = 29 }, // Co-op

        // Ready or Not (Id: 8) - FPS, Tactical, Co-op, Multiplayer
        new GameGenre { Id = 36, GameId = 8, GenreId = 6 },  // FPS
        new GameGenre { Id = 37, GameId = 8, GenreId = 29 }, // Co-op
        new GameGenre { Id = 38, GameId = 8, GenreId = 31 }, // Multiplayer
        new GameGenre { Id = 39, GameId = 8, GenreId = 1 },  // Action
        new GameGenre { Id = 40, GameId = 8, GenreId = 8 },  // Simulation

        // Insurgency: Sandstorm (Id: 9) - FPS, Multiplayer, Co-op, Action
        new GameGenre { Id = 41, GameId = 9, GenreId = 6 },  // FPS
        new GameGenre { Id = 42, GameId = 9, GenreId = 31 }, // Multiplayer
        new GameGenre { Id = 43, GameId = 9, GenreId = 29 }, // Co-op
        new GameGenre { Id = 44, GameId = 9, GenreId = 1 },  // Action

        // Ground Branch (Id: 10) - FPS, Tactical, Co-op, Stealth
        new GameGenre { Id = 45, GameId = 10, GenreId = 6 },  // FPS
        new GameGenre { Id = 46, GameId = 10, GenreId = 29 }, // Co-op
        new GameGenre { Id = 47, GameId = 10, GenreId = 31 }, // Multiplayer
        new GameGenre { Id = 48, GameId = 10, GenreId = 13 }, // Stealth
        new GameGenre { Id = 49, GameId = 10, GenreId = 1 },  // Action

        // DayZ (Id: 11) - Survival, Open World, Multiplayer, FPS, Horror
        new GameGenre { Id = 50, GameId = 11, GenreId = 11 }, // Survival
        new GameGenre { Id = 51, GameId = 11, GenreId = 12 }, // Open World
        new GameGenre { Id = 52, GameId = 11, GenreId = 31 }, // Multiplayer
        new GameGenre { Id = 53, GameId = 11, GenreId = 6 },  // FPS
        new GameGenre { Id = 54, GameId = 11, GenreId = 10 }, // Horror

        // Post Scriptum (Id: 12) - FPS, Simulation, Multiplayer, Strategy
        new GameGenre { Id = 55, GameId = 12, GenreId = 6 },  // FPS
        new GameGenre { Id = 56, GameId = 12, GenreId = 8 },  // Simulation
        new GameGenre { Id = 57, GameId = 12, GenreId = 31 }, // Multiplayer
        new GameGenre { Id = 58, GameId = 12, GenreId = 3 },  // Strategy
        new GameGenre { Id = 59, GameId = 12, GenreId = 29 },  // Co-op

        // ── Pagination test games (IDs 13-48) ──
        new GameGenre { Id = 60, GameId = 13, GenreId = 1 },
        new GameGenre { Id = 61, GameId = 13, GenreId = 7 },
        new GameGenre { Id = 62, GameId = 13, GenreId = 30 },
        new GameGenre { Id = 63, GameId = 14, GenreId = 2 },
        new GameGenre { Id = 64, GameId = 14, GenreId = 16 },
        new GameGenre { Id = 65, GameId = 14, GenreId = 31 },
        new GameGenre { Id = 66, GameId = 15, GenreId = 3 },
        new GameGenre { Id = 67, GameId = 15, GenreId = 20 },
        new GameGenre { Id = 68, GameId = 15, GenreId = 30 },
        new GameGenre { Id = 69, GameId = 16, GenreId = 4 },
        new GameGenre { Id = 70, GameId = 16, GenreId = 14 },
        new GameGenre { Id = 71, GameId = 16, GenreId = 31 },
        new GameGenre { Id = 72, GameId = 17, GenreId = 5 },
        new GameGenre { Id = 73, GameId = 17, GenreId = 9 },
        new GameGenre { Id = 74, GameId = 17, GenreId = 33 },
        new GameGenre { Id = 75, GameId = 18, GenreId = 6 },
        new GameGenre { Id = 76, GameId = 18, GenreId = 1 },
        new GameGenre { Id = 77, GameId = 18, GenreId = 31 },
        new GameGenre { Id = 78, GameId = 19, GenreId = 10 },
        new GameGenre { Id = 79, GameId = 19, GenreId = 11 },
        new GameGenre { Id = 80, GameId = 19, GenreId = 7 },
        new GameGenre { Id = 81, GameId = 20, GenreId = 8 },
        new GameGenre { Id = 82, GameId = 20, GenreId = 3 },
        new GameGenre { Id = 83, GameId = 20, GenreId = 20 },
        new GameGenre { Id = 84, GameId = 21, GenreId = 2 },
        new GameGenre { Id = 85, GameId = 21, GenreId = 12 },
        new GameGenre { Id = 86, GameId = 21, GenreId = 7 },
        new GameGenre { Id = 87, GameId = 22, GenreId = 15 },
        new GameGenre { Id = 88, GameId = 22, GenreId = 1 },
        new GameGenre { Id = 89, GameId = 22, GenreId = 31 },
        new GameGenre { Id = 90, GameId = 23, GenreId = 17 },
        new GameGenre { Id = 91, GameId = 23, GenreId = 3 },
        new GameGenre { Id = 92, GameId = 23, GenreId = 33 },
        new GameGenre { Id = 93, GameId = 24, GenreId = 23 },
        new GameGenre { Id = 94, GameId = 24, GenreId = 9 },
        new GameGenre { Id = 95, GameId = 24, GenreId = 5 },
        new GameGenre { Id = 96, GameId = 25, GenreId = 25 },
        new GameGenre { Id = 97, GameId = 25, GenreId = 26 },
        new GameGenre { Id = 98, GameId = 25, GenreId = 5 },
        new GameGenre { Id = 99, GameId = 26, GenreId = 27 },
        new GameGenre { Id = 100, GameId = 26, GenreId = 31 },
        new GameGenre { Id = 101, GameId = 26, GenreId = 1 },
        new GameGenre { Id = 102, GameId = 27, GenreId = 28 },
        new GameGenre { Id = 103, GameId = 27, GenreId = 31 },
        new GameGenre { Id = 104, GameId = 27, GenreId = 3 },
        new GameGenre { Id = 105, GameId = 28, GenreId = 7 },
        new GameGenre { Id = 106, GameId = 28, GenreId = 35 },
        new GameGenre { Id = 107, GameId = 28, GenreId = 30 },
        new GameGenre { Id = 108, GameId = 29, GenreId = 8 },
        new GameGenre { Id = 109, GameId = 29, GenreId = 14 },
        new GameGenre { Id = 110, GameId = 29, GenreId = 31 },
        new GameGenre { Id = 111, GameId = 30, GenreId = 5 },
        new GameGenre { Id = 112, GameId = 30, GenreId = 9 },
        new GameGenre { Id = 113, GameId = 30, GenreId = 33 },
        new GameGenre { Id = 114, GameId = 31, GenreId = 19 },
        new GameGenre { Id = 115, GameId = 31, GenreId = 3 },
        new GameGenre { Id = 116, GameId = 31, GenreId = 33 },
        new GameGenre { Id = 117, GameId = 32, GenreId = 18 },
        new GameGenre { Id = 118, GameId = 32, GenreId = 2 },
        new GameGenre { Id = 119, GameId = 32, GenreId = 3 },
        new GameGenre { Id = 120, GameId = 33, GenreId = 22 },
        new GameGenre { Id = 121, GameId = 33, GenreId = 5 },
        new GameGenre { Id = 122, GameId = 33, GenreId = 33 },
        new GameGenre { Id = 123, GameId = 34, GenreId = 21 },
        new GameGenre { Id = 124, GameId = 34, GenreId = 35 },
        new GameGenre { Id = 125, GameId = 34, GenreId = 5 },
        new GameGenre { Id = 126, GameId = 35, GenreId = 24 },
        new GameGenre { Id = 127, GameId = 35, GenreId = 7 },
        new GameGenre { Id = 128, GameId = 35, GenreId = 5 },
        new GameGenre { Id = 129, GameId = 36, GenreId = 32 },
        new GameGenre { Id = 130, GameId = 36, GenreId = 33 },
        new GameGenre { Id = 131, GameId = 36, GenreId = 30 },
        new GameGenre { Id = 132, GameId = 37, GenreId = 34 },
        new GameGenre { Id = 133, GameId = 37, GenreId = 31 },
        new GameGenre { Id = 134, GameId = 37, GenreId = 33 },
        new GameGenre { Id = 135, GameId = 38, GenreId = 12 },
        new GameGenre { Id = 136, GameId = 38, GenreId = 1 },
        new GameGenre { Id = 137, GameId = 38, GenreId = 7 },
        new GameGenre { Id = 138, GameId = 39, GenreId = 11 },
        new GameGenre { Id = 139, GameId = 39, GenreId = 5 },
        new GameGenre { Id = 140, GameId = 39, GenreId = 30 },
        new GameGenre { Id = 141, GameId = 40, GenreId = 6 },
        new GameGenre { Id = 142, GameId = 40, GenreId = 29 },
        new GameGenre { Id = 143, GameId = 40, GenreId = 31 },
        new GameGenre { Id = 144, GameId = 41, GenreId = 2 },
        new GameGenre { Id = 145, GameId = 41, GenreId = 25 },
        new GameGenre { Id = 146, GameId = 41, GenreId = 5 },
        new GameGenre { Id = 147, GameId = 42, GenreId = 3 },
        new GameGenre { Id = 148, GameId = 42, GenreId = 19 },
        new GameGenre { Id = 149, GameId = 42, GenreId = 33 },
        new GameGenre { Id = 150, GameId = 43, GenreId = 13 },
        new GameGenre { Id = 151, GameId = 43, GenreId = 1 },
        new GameGenre { Id = 152, GameId = 43, GenreId = 7 },
        new GameGenre { Id = 153, GameId = 44, GenreId = 4 },
        new GameGenre { Id = 154, GameId = 44, GenreId = 14 },
        new GameGenre { Id = 155, GameId = 44, GenreId = 31 },
        new GameGenre { Id = 156, GameId = 45, GenreId = 6 },
        new GameGenre { Id = 157, GameId = 45, GenreId = 11 },
        new GameGenre { Id = 158, GameId = 45, GenreId = 31 },
        new GameGenre { Id = 159, GameId = 46, GenreId = 2 },
        new GameGenre { Id = 160, GameId = 46, GenreId = 12 },
        new GameGenre { Id = 161, GameId = 46, GenreId = 16 },
        new GameGenre { Id = 162, GameId = 47, GenreId = 8 },
        new GameGenre { Id = 163, GameId = 47, GenreId = 20 },
        new GameGenre { Id = 164, GameId = 47, GenreId = 30 },
        new GameGenre { Id = 165, GameId = 48, GenreId = 1 },
        new GameGenre { Id = 166, GameId = 48, GenreId = 31 },
        new GameGenre { Id = 167, GameId = 48, GenreId = 3 }
    );
  }
}

