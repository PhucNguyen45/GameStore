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
      public DbSet<Payment> Payments => Set<Payment>();
      public DbSet<RolePermission> RolePermissions => Set<RolePermission>();
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
                  entity.HasIndex(e => e.Username)
                    .IsUnique();
                  entity.HasIndex(e => e.Email)
                    .IsUnique();
                  entity.Property(e => e.Wallet)
                    .HasColumnType("decimal(18,2)")
                    .HasDefaultValue(0m);
                  entity.Property(e => e.IsActive)
                    .HasDefaultValue(true);

                  // Check constraints
                  entity.ToTable(t => t.HasCheckConstraint("CK_User_Wallet_NonNegative", "Wallet >= 0"));
            });

            // ──────────────── ROLE ────────────────
            modelBuilder.Entity<Role>(entity =>
            {
                  entity.HasKey(e => e.Id);
                  entity.HasIndex(e => e.Name)
                    .IsUnique();
                  entity.Property(e => e.IsActive)
                    .HasDefaultValue(true);
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
                    .HasForeignKey(e => e.RoleId)
                    .OnDelete(DeleteBehavior.Cascade);
                  entity.HasIndex(e => new { e.UserId, e.RoleId })
                    .IsUnique();
            });

            // ──────────────── ACCESS TOKEN ────────────────
            modelBuilder.Entity<AccessToken>(entity =>
            {
                  entity.HasKey(e => e.Id);
                  entity.HasOne(e => e.User)
                    .WithMany(u => u.AccessTokens)
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
                  entity.HasIndex(e => e.Token).IsUnique();
            });

            // ──────────────── GENRE ────────────────
            modelBuilder.Entity<Genre>(entity =>
            {
                  entity.HasKey(e => e.Id);
                  entity.HasIndex(e => e.Name)
                    .IsUnique();
                  entity.Property(e => e.IsActive)
                    .HasDefaultValue(true);
            });

            // ──────────────── GAME ────────────────
            modelBuilder.Entity<Game>(entity =>
            {
                  entity.HasKey(e => e.Id);
                  entity.Property(e => e.Price)
                    .HasColumnType("decimal(18,2)")
                    .HasDefaultValue(0m);
                  entity.Property(e => e.DiscountPrice)
                    .HasColumnType("decimal(18,2)");
                  entity.Property(e => e.IsActive)
                    .HasDefaultValue(true);
                  entity.Property(e => e.Rating)
                    .HasDefaultValue(0.0);
                  entity.Property(e => e.TotalSales)
                    .HasDefaultValue(0);

                  // Check constraints
                  entity.ToTable(t => t.HasCheckConstraint("CK_Game_Price_NonNegative", "Price >= 0"));
                  entity.ToTable(t => t.HasCheckConstraint("CK_Game_DiscountPrice_NonNegative", "DiscountPrice >= 0"));
                  entity.ToTable(t => t.HasCheckConstraint("CK_Game_Rating_Range", "Rating >= 0 AND Rating <= 5"));

                  // Indexes for performance
                  entity.HasIndex(e => e.Title);
                  entity.HasIndex(e => e.IsActive);
                  entity.HasIndex(e => e.ReleaseDate);
            });

            // ──────────────── GAME GENRE ────────────────
            modelBuilder.Entity<GameGenre>(entity =>
            {
                  entity.HasKey(e => e.Id);
                  entity.HasOne(e => e.Game)
                    .WithMany(g => g.GameGenres)
                    .HasForeignKey(e => e.GameId)
                    .OnDelete(DeleteBehavior.Cascade);
                  entity.HasOne(e => e.Genre)
                    .WithMany(g => g.GameGenres)
                    .HasForeignKey(e => e.GenreId)
                    .OnDelete(DeleteBehavior.Cascade);
                  entity.HasIndex(e => new { e.GameId, e.GenreId })
                    .IsUnique();
            });

            // ──────────────── GAME KEY ────────────────
            modelBuilder.Entity<GameKey>(entity =>
            {
                  entity.HasKey(e => e.Id);
                  entity.HasIndex(e => e.KeyCode)
                    .IsUnique();
                  entity.HasOne(e => e.Game)
                    .WithMany()
                    .HasForeignKey(e => e.GameId)
                    .OnDelete(DeleteBehavior.Cascade);
                  entity.HasOne(e => e.OrderDetail)
                    .WithMany()
                    .HasForeignKey(e => e.OrderDetailId)
                    .OnDelete(DeleteBehavior.SetNull);
                  entity.Property(e => e.IsUsed).HasDefaultValue(false);

                  // Index for finding unused keys
                  entity.HasIndex(e => new { e.GameId, e.IsUsed });
            });

            // ──────────────── PAYMENT ────────────────
            modelBuilder.Entity<Payment>(entity =>
            {
                  entity.HasKey(e => e.Id);
                  entity.Property(e => e.Amount)
                    .HasColumnType("decimal(18,2)");
                  entity.HasOne(e => e.Order)
                    .WithMany()
                    .HasForeignKey(e => e.OrderId)
                    .OnDelete(DeleteBehavior.Cascade);
                  entity.Property(e => e.Status)
                    .HasDefaultValue("Completed");
                  entity.Property(e => e.PaymentMethod)
                    .HasDefaultValue("Wallet");
                  entity.HasIndex(e => e.OrderId);
                  entity.HasIndex(e => e.Status);
            });

            // ──────────────── ROLE PERMISSION ────────────────
            modelBuilder.Entity<RolePermission>(entity =>
            {
                  entity.HasKey(e => e.Id);
                  entity.HasOne(e => e.Role)
                    .WithMany(r => r.RolePermissions)
                    .HasForeignKey(e => e.RoleId)
                    .OnDelete(DeleteBehavior.Cascade);
                  entity.HasIndex(e => new { e.RoleId, e.Permission })
                    .IsUnique();
            });

            // ──────────────── LIBRARY ────────────────
            modelBuilder.Entity<Library>(entity =>
            {
                  entity.HasKey(e => e.Id);
                  entity.HasOne(e => e.User)
                    .WithMany(u => u.Libraries)
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
                  entity.HasOne(e => e.Game)
                    .WithMany()
                    .HasForeignKey(e => e.GameId)
                    .OnDelete(DeleteBehavior.Cascade);
                  // entity.HasOne(e => e.GameKey)
                  //       .WithMany()
                  //       .HasForeignKey(e => e.GameKeyId)
                  //       .OnDelete(DeleteBehavior.SetNull);
                  entity.HasIndex(e => new { e.UserId, e.GameId })
                    .IsUnique();
                  entity.HasIndex(e => e.UserId);
                  entity.Property(e => e.TotalPlayTime)
                    .HasDefaultValue(0);
            });

            // ──────────────── WISHLIST ────────────────
            modelBuilder.Entity<Wishlist>(entity =>
            {
                  entity.HasKey(e => e.Id);
                  entity.HasOne(e => e.User)
                    .WithMany(u => u.Wishlists)
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
                  entity.HasOne(e => e.Game)
                    .WithMany(g => g.Wishlists)
                    .HasForeignKey(e => e.GameId)
                    .OnDelete(DeleteBehavior.Cascade);
                  entity.HasIndex(e => new { e.UserId, e.GameId })
                    .IsUnique();
                  entity.HasIndex(e => e.UserId);
            });

            // ──────────────── REVIEW ────────────────
            modelBuilder.Entity<Review>(entity =>
            {
                  entity.HasKey(e => e.Id);
                  entity.HasOne(e => e.User)
                    .WithMany(u => u.Reviews)
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
                  entity.HasOne(e => e.Game)
                    .WithMany(g => g.Reviews)
                    .HasForeignKey(e => e.GameId)
                    .OnDelete(DeleteBehavior.Cascade);
                  entity.HasIndex(e => new { e.UserId, e.GameId })
                    .IsUnique();
                  entity.HasIndex(e => e.GameId);
                  entity.HasIndex(e => e.CreatedAt);

                  // Check constraints
                  entity.ToTable(t => t.HasCheckConstraint("CK_Review_Rating_Range", "Rating >= 1 AND Rating <= 5"));
                  entity.ToTable(t => t.HasCheckConstraint("CK_Review_Helpful_NonNegative", "HelpfulCount >= 0"));

                  entity.Property(e => e.IsRecommended)
                    .HasDefaultValue(false);
                  entity.Property(e => e.HelpfulCount)
                    .HasDefaultValue(0);
            });

            // ──────────────── ORDER ────────────────
            modelBuilder.Entity<Order>(entity =>
            {
                  entity.HasKey(e => e.Id);
                  entity.Property(e => e.TotalAmount)
                    .HasColumnType("decimal(18,2)");
                  entity.HasOne(e => e.User)
                    .WithMany(u => u.Orders)
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Restrict); // Don't delete orders when user deleted
                  entity.Property(e => e.Status)
                    .HasDefaultValue("Pending");
                  entity.Property(e => e.PaymentMethod)
                    .HasDefaultValue("Wallet");

                  // Check constraints
                  entity.ToTable(t => t.HasCheckConstraint("CK_Order_TotalAmount_NonNegative", "TotalAmount >= 0"));

                  // Indexes for performance
                  entity.HasIndex(e => e.UserId);
                  entity.HasIndex(e => e.Status);
                  entity.HasIndex(e => e.OrderDate);
            });

            // ──────────────── ORDER DETAIL ────────────────
            modelBuilder.Entity<OrderDetail>(entity =>
            {
                  entity.HasKey(e => e.Id);
                  entity.Property(e => e.UnitPrice)
                    .HasColumnType("decimal(18,2)");
                  entity.HasOne(e => e.Order)
                    .WithMany(o => o.OrderDetails)
                    .HasForeignKey(e => e.OrderId)
                    .OnDelete(DeleteBehavior.Cascade);
                  entity.HasOne(e => e.Game)
                    .WithMany(g => g.OrderDetails)
                    .HasForeignKey(e => e.GameId)
                    .OnDelete(DeleteBehavior.Restrict); // Keep history

                  // Check constraints
                  entity.ToTable(t => t.HasCheckConstraint("CK_OrderDetail_Quantity_Positive", "Quantity > 0"));
                  entity.ToTable(t => t.HasCheckConstraint("CK_OrderDetail_UnitPrice_NonNegative", "UnitPrice >= 0"));
            });

            // ──────────────── SETTING ────────────────
            modelBuilder.Entity<Setting>(entity =>
            {
                  entity.HasKey(e => e.Id);
                  entity.HasIndex(e => e.Name)
                    .IsUnique();
                  entity.Property(e => e.IsActive)
                    .HasDefaultValue(true);
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
                      Price = 34.99m,
                      DiscountPrice = 27.99m,
                      Developer = "MADFINGER Games",
                      Publisher = "MADFINGER Games",
                      ReleaseDate = new DateTime(2024, 4, 30),
                      TrailerUrl = "https://www.youtube.com/watch?v=UlNkVsB56Gw",
                      CoverImageUrl = "https://cdn.cloudflare.steamstatic.com/steam/apps/2479810/header.jpg",
                      Screenshots = "[\"https://cdn.cloudflare.steamstatic.com/steam/apps/2479810/ss_1.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/2479810/ss_2.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/2479810/ss_3.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/2479810/ss_4.jpg\"]",
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
                      Description = "World of Tanks is a team-based, massively multiplayer online action game dedicated to armored warfare in the mid-20th century. Throw yourself into epic tank battles with over 600 vehicles from 11 nations. Cooperate with your teammates, plan your strategy, and dominate the battlefield with realistic tank physics and strategic gameplay.",
                      Price = 0m,
                      DiscountPrice = null,
                      Developer = "Wargaming",
                      Publisher = "Wargaming",
                      ReleaseDate = new DateTime(2010, 8, 12),
                      TrailerUrl = "https://www.youtube.com/watch?v=6LreDfD7Zds",
                      CoverImageUrl = "https://cdn.cloudflare.steamstatic.com/steam/apps/1407200/header.jpg",
                      Screenshots = "[\"https://cdn.cloudflare.steamstatic.com/steam/apps/1407200/ss_1.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/1407200/ss_2.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/1407200/ss_3.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/1407200/ss_4.jpg\"]",
                      TotalSales = 5000000,
                      Rating = 4.5,
                      RatingCount = 350000,
                      IsActive = true,
                      MinimumOS = "Windows 7 64-bit",
                      MinimumProcessor = "Intel Core i3-2100 / AMD Phenom II X4 955",
                      MinimumMemory = "4 GB RAM",
                      MinimumGraphics = "NVIDIA GeForce GT 610 / AMD Radeon HD 6450",
                      MinimumStorage = "70 GB available space"
                },
                new Game
                {
                      Id = 3,
                      Title = "War Thunder",
                      Description = "War Thunder is the most comprehensive free-to-play, cross-platform MMO military game dedicated to aviation, armored vehicles, and naval craft from the early 20th century to the most advanced modern combat units. Join now and take part in major battles on land, in the air, and at sea, fighting with millions of players from all over the world in an ever-evolving environment.",
                      Price = 0m,
                      DiscountPrice = null,
                      Developer = "Gaijin Entertainment",
                      Publisher = "Gaijin Entertainment",
                      ReleaseDate = new DateTime(2013, 8, 15),
                      TrailerUrl = "https://www.youtube.com/watch?v=TtFk6Gnx9M4",
                      CoverImageUrl = "https://cdn.cloudflare.steamstatic.com/steam/apps/236390/header.jpg",
                      Screenshots = "[\"https://cdn.cloudflare.steamstatic.com/steam/apps/236390/ss_1.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/236390/ss_2.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/236390/ss_3.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/236390/ss_4.jpg\"]",
                      TotalSales = 8000000,
                      Rating = 4.3,
                      RatingCount = 520000,
                      IsActive = true,
                      MinimumOS = "Windows 10 64-bit",
                      MinimumProcessor = "Intel Core i5-2500 / AMD FX-8350",
                      MinimumMemory = "8 GB RAM",
                      MinimumGraphics = "NVIDIA GeForce GTX 660 / AMD Radeon HD 7850",
                      MinimumStorage = "50 GB available space"
                },
                new Game
                {
                      Id = 4,
                      Title = "Escape from Tarkov",
                      Description = "Escape from Tarkov is a hardcore and realistic online first-person action RPG/Simulator with MMO features and a story-driven walkthrough. With each passing day the situation in the Norvinsk region grows more complicated. Incessant warfare has exhausted the local population, leaving them divided and vulnerable to exploitation by private military companies.",
                      Price = 49.99m,
                      DiscountPrice = 44.99m,
                      Developer = "Battlestate Games",
                      Publisher = "Battlestate Games",
                      ReleaseDate = new DateTime(2017, 7, 27),
                      TrailerUrl = "https://www.youtube.com/watch?v=5HEk2sh9Q_o",
                      CoverImageUrl = "https://cdn.cloudflare.steamstatic.com/steam/apps/1771980/header.jpg",
                      Screenshots = "[\"https://cdn.cloudflare.steamstatic.com/steam/apps/1771980/ss_1.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/1771980/ss_2.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/1771980/ss_3.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/1771980/ss_4.jpg\"]",
                      TotalSales = 3000000,
                      Rating = 4.1,
                      RatingCount = 180000,
                      IsActive = true,
                      MinimumOS = "Windows 10 64-bit",
                      MinimumProcessor = "Intel Core i5-2500K / AMD Ryzen 3 1200",
                      MinimumMemory = "12 GB RAM",
                      MinimumGraphics = "NVIDIA GeForce GTX 1050 / AMD Radeon RX 560",
                      MinimumStorage = "35 GB available space"
                },
                new Game
                {
                      Id = 5,
                      Title = "ARMA 3",
                      Description = "Experience true combat gameplay in a massive military sandbox. Deploying a wide variety of single- and multiplayer content, over 20 vehicles and 40 weapons, and limitless opportunities for content creation, ARMA 3 is the PC's premier military game. Authentic, diverse, open - ARMA 3 sends you to war.",
                      Price = 29.99m,
                      DiscountPrice = 9.99m,
                      Developer = "Bohemia Interactive",
                      Publisher = "Bohemia Interactive",
                      ReleaseDate = new DateTime(2013, 9, 12),
                      TrailerUrl = "https://www.youtube.com/watch?v=OU9LWflcI_Y",
                      CoverImageUrl = "https://cdn.cloudflare.steamstatic.com/steam/apps/107410/header.jpg",
                      Screenshots = "[\"https://cdn.cloudflare.steamstatic.com/steam/apps/107410/ss_1.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/107410/ss_2.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/107410/ss_3.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/107410/ss_4.jpg\"]",
                      TotalSales = 10000000,
                      Rating = 4.7,
                      RatingCount = 450000,
                      IsActive = true,
                      MinimumOS = "Windows 7 64-bit",
                      MinimumProcessor = "Intel Core i5-2300 / AMD Phenom II X4 940",
                      MinimumMemory = "8 GB RAM",
                      MinimumGraphics = "NVIDIA GeForce GTX 560 / AMD Radeon HD 7750",
                      MinimumStorage = "45 GB available space"
                },
                new Game
                {
                      Id = 6,
                      Title = "Hell Let Loose",
                      Description = "Join the ever-expanding Hell Let Loose experience - a hardcore World War Two first person shooter with epic battles of 100 players with infantry, tanks, artillery, a dynamically shifting front line and a unique resource-based RTS-inspired meta-game. Fight in the most iconic battles of the Western Front, including Omaha Beach, Carentan, and Foy.",
                      Price = 39.99m,
                      DiscountPrice = 29.99m,
                      Developer = "Black Matter",
                      Publisher = "Team17",
                      ReleaseDate = new DateTime(2021, 7, 27),
                      TrailerUrl = "https://www.youtube.com/watch?v=mV-ksD1vY5o",
                      CoverImageUrl = "https://cdn.cloudflare.steamstatic.com/steam/apps/686810/header.jpg",
                      Screenshots = "[\"https://cdn.cloudflare.steamstatic.com/steam/apps/686810/ss_1.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/686810/ss_2.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/686810/ss_3.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/686810/ss_4.jpg\"]",
                      TotalSales = 2500000,
                      Rating = 4.6,
                      RatingCount = 85000,
                      IsActive = true,
                      MinimumOS = "Windows 10 64-bit",
                      MinimumProcessor = "Intel Core i5-6600 / AMD Ryzen 5 1400",
                      MinimumMemory = "12 GB RAM",
                      MinimumGraphics = "NVIDIA GeForce GTX 960 / AMD Radeon R9 380",
                      MinimumStorage = "30 GB available space"
                },
                new Game
                {
                      Id = 7,
                      Title = "Squad",
                      Description = "Squad is a tactical FPS that provides authentic combat experiences through teamwork, communication, and realistic combat. It bridges the gap between arcade shooter and military simulation with large-scale combined arms warfare, base building, and integrated voice communication.",
                      Price = 49.99m,
                      DiscountPrice = null,
                      Developer = "Offworld",
                      Publisher = "Offworld",
                      ReleaseDate = new DateTime(2020, 9, 23),
                      TrailerUrl = "https://www.youtube.com/watch?v=YviNkuXLMg4",
                      CoverImageUrl = "https://cdn.cloudflare.steamstatic.com/steam/apps/393380/header.jpg",
                      Screenshots = "[\"https://cdn.cloudflare.steamstatic.com/steam/apps/393380/ss_1.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/393380/ss_2.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/393380/ss_3.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/393380/ss_4.jpg\"]",
                      TotalSales = 4000000,
                      Rating = 4.5,
                      RatingCount = 150000,
                      IsActive = true,
                      MinimumOS = "Windows 10 64-bit",
                      MinimumProcessor = "Intel Core i5-2500K / AMD FX-6300",
                      MinimumMemory = "8 GB RAM",
                      MinimumGraphics = "NVIDIA GeForce GTX 770 / AMD Radeon R9 290",
                      MinimumStorage = "55 GB available space"
                },
                new Game
                {
                      Id = 8,
                      Title = "Ready or Not",
                      Description = "Ready or Not is an intense, tactical, first-person shooter that depicts a modern-day world in which SWAT police units are called to defuse hostile and confronting situations. Inspired by the SWAT series, Ready or Not brings a level of realism, tactical planning, and team-based coordination rarely seen in modern shooters.",
                      Price = 39.99m,
                      DiscountPrice = 34.99m,
                      Developer = "VOID Interactive",
                      Publisher = "VOID Interactive",
                      ReleaseDate = new DateTime(2023, 12, 13),
                      TrailerUrl = "https://www.youtube.com/watch?v=saKvD9xBRts",
                      CoverImageUrl = "https://cdn.cloudflare.steamstatic.com/steam/apps/1144200/header.jpg",
                      Screenshots = "[\"https://cdn.cloudflare.steamstatic.com/steam/apps/1144200/ss_1.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/1144200/ss_2.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/1144200/ss_3.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/1144200/ss_4.jpg\"]",
                      TotalSales = 1800000,
                      Rating = 4.8,
                      RatingCount = 95000,
                      IsActive = true,
                      MinimumOS = "Windows 10 64-bit",
                      MinimumProcessor = "Intel Core i5-4430 / AMD FX-6300",
                      MinimumMemory = "8 GB RAM",
                      MinimumGraphics = "NVIDIA GeForce GTX 960 / AMD Radeon R7 370",
                      MinimumStorage = "90 GB available space"
                },
                new Game
                {
                      Id = 9,
                      Title = "Insurgency: Sandstorm",
                      Description = "Insurgency: Sandstorm is a team-based, tactical FPS based on lethal close quarters combat and objective-oriented multiplayer gameplay. Experience the intensity of modern combat where skill is rewarded, and teamwork wins the fight. Sequenced in a fictional contemporary Middle Eastern conflict, featuring both PvP and co-op modes.",
                      Price = 29.99m,
                      DiscountPrice = 14.99m,
                      Developer = "New World Interactive",
                      Publisher = "Focus Entertainment",
                      ReleaseDate = new DateTime(2018, 12, 12),
                      TrailerUrl = "https://www.youtube.com/watch?v=GwCWgM1JxBs",
                      CoverImageUrl = "https://cdn.cloudflare.steamstatic.com/steam/apps/581320/header.jpg",
                      Screenshots = "[\"https://cdn.cloudflare.steamstatic.com/steam/apps/581320/ss_1.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/581320/ss_2.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/581320/ss_3.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/581320/ss_4.jpg\"]",
                      TotalSales = 3500000,
                      Rating = 4.4,
                      RatingCount = 170000,
                      IsActive = true,
                      MinimumOS = "Windows 7 64-bit",
                      MinimumProcessor = "Intel Core i5-4440 / AMD FX-6300",
                      MinimumMemory = "8 GB RAM",
                      MinimumGraphics = "NVIDIA GeForce GTX 760 / AMD Radeon HD 7970",
                      MinimumStorage = "40 GB available space"
                },
                new Game
                {
                      Id = 10,
                      Title = "Ground Branch",
                      Description = "Ground Branch is a realistic tactical first-person shooter from one of the developers behind the original Rainbow Six and Ghost Recon games. Think, plan, and move carefully through highly detailed environments while engaging enemies in realistic firefights where bullets are deadly and every decision counts.",
                      Price = 29.99m,
                      DiscountPrice = null,
                      Developer = "BlackFoot Studios",
                      Publisher = "BlackFoot Studios",
                      ReleaseDate = new DateTime(2022, 9, 8),
                      TrailerUrl = "https://www.youtube.com/watch?v=QZBmXK-G3-g",
                      CoverImageUrl = "https://cdn.cloudflare.steamstatic.com/steam/apps/16900/header.jpg",
                      Screenshots = "[\"https://cdn.cloudflare.steamstatic.com/steam/apps/16900/ss_1.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/16900/ss_2.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/16900/ss_3.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/16900/ss_4.jpg\"]",
                      TotalSales = 450000,
                      Rating = 4.4,
                      RatingCount = 12000,
                      IsActive = true,
                      MinimumOS = "Windows 10 64-bit",
                      MinimumProcessor = "Intel Core i5-2500K / AMD FX-8350",
                      MinimumMemory = "8 GB RAM",
                      MinimumGraphics = "NVIDIA GeForce GTX 760 / AMD Radeon HD 7950",
                      MinimumStorage = "25 GB available space"
                },
                new Game
                {
                      Id = 11,
                      Title = "DayZ",
                      Description = "DayZ is a hardcore open-world survival game with an extreme emphasis on player interaction. You are one of the few who have survived a mysterious zombie outbreak in the post-Soviet Republic of Chernarus. Scavenge for supplies, craft items, build bases, and fight against zombies and other desperate survivors in a sprawling 230km² landscape.",
                      Price = 49.99m,
                      DiscountPrice = 29.99m,
                      Developer = "Bohemia Interactive",
                      Publisher = "Bohemia Interactive",
                      ReleaseDate = new DateTime(2018, 12, 13),
                      TrailerUrl = "https://www.youtube.com/watch?v=H9PHj4R2l5Y",
                      CoverImageUrl = "https://cdn.cloudflare.steamstatic.com/steam/apps/221100/header.jpg",
                      Screenshots = "[\"https://cdn.cloudflare.steamstatic.com/steam/apps/221100/ss_1.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/221100/ss_2.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/221100/ss_3.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/221100/ss_4.jpg\"]",
                      TotalSales = 6000000,
                      Rating = 3.9,
                      RatingCount = 290000,
                      IsActive = true,
                      MinimumOS = "Windows 10 64-bit",
                      MinimumProcessor = "Intel Core i5-4430 / AMD FX-6300",
                      MinimumMemory = "8 GB RAM",
                      MinimumGraphics = "NVIDIA GeForce GTX 760 / AMD Radeon R9 270",
                      MinimumStorage = "25 GB available space"
                },
                new Game
                {
                      Id = 12,
                      Title = "Post Scriptum",
                      Description = "Post Scriptum is a WW2 simulation game, focusing on historical accuracy, large scale battles, the difficulty of coalition warfare and an intense battlefield, with an emphasis on logistics and combined arms. Fight across the Arnhem bridge, the dunes of Normandy, and through the streets of the Netherlands.",
                      Price = 29.99m,
                      DiscountPrice = 19.99m,
                      Developer = "Periscope Games",
                      Publisher = "Offworld",
                      ReleaseDate = new DateTime(2018, 7, 18),
                      TrailerUrl = "https://www.youtube.com/watch?v=gKlJ4VCGmTE",
                      CoverImageUrl = "https://cdn.cloudflare.steamstatic.com/steam/apps/736220/header.jpg",
                      Screenshots = "[\"https://cdn.cloudflare.steamstatic.com/steam/apps/736220/ss_1.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/736220/ss_2.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/736220/ss_3.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/736220/ss_4.jpg\"]",
                      TotalSales = 1200000,
                      Rating = 4.2,
                      RatingCount = 28000,
                      IsActive = true,
                      MinimumOS = "Windows 7 64-bit",
                      MinimumProcessor = "Intel Core i5-2500K / AMD Ryzen 3 1200",
                      MinimumMemory = "8 GB RAM",
                      MinimumGraphics = "NVIDIA GeForce GTX 970 / AMD Radeon R9 290",
                      MinimumStorage = "35 GB available space"
                }
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
                new GameGenre { Id = 59, GameId = 12, GenreId = 29 }  // Co-op
            );
      }
}
