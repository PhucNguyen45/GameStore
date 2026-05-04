using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace GameStore.Repository.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Games",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false, defaultValue: 0m),
                    DiscountPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Developer = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Publisher = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ReleaseDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    TrailerUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CoverImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Screenshots = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TotalSales = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    Rating = table.Column<double>(type: "float", nullable: false, defaultValue: 0.0),
                    RatingCount = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    MinimumOS = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MinimumProcessor = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MinimumMemory = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MinimumGraphics = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MinimumStorage = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Games", x => x.Id);
                    table.CheckConstraint("CK_Game_DiscountPrice_NonNegative", "DiscountPrice >= 0");
                    table.CheckConstraint("CK_Game_Price_NonNegative", "Price >= 0");
                    table.CheckConstraint("CK_Game_Rating_Range", "Rating >= 0 AND Rating <= 5");
                });

            migrationBuilder.CreateTable(
                name: "Genres",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IconUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Genres", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Roles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Guid = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Created = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedBy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Modified = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    CreatedDateTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedUser = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Settings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Value = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Created = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedBy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Modified = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    CreatedDateTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedUser = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Settings", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Username = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Password = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Salt = table.Column<byte[]>(type: "varbinary(max)", nullable: false),
                    DisplayName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AvatarUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Wallet = table.Column<decimal>(type: "decimal(18,2)", nullable: false, defaultValue: 0m),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                    table.CheckConstraint("CK_User_Wallet_NonNegative", "Wallet >= 0");
                });

            migrationBuilder.CreateTable(
                name: "GameGenres",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    GameId = table.Column<int>(type: "int", nullable: false),
                    GenreId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GameGenres", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GameGenres_Games_GameId",
                        column: x => x.GameId,
                        principalTable: "Games",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_GameGenres_Genres_GenreId",
                        column: x => x.GenreId,
                        principalTable: "Genres",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AccessTokens",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Guid = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Token = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Expirated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Created = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedDateTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedUser = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AccessTokens", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AccessTokens_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Libraries",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    GameId = table.Column<int>(type: "int", nullable: false),
                    GameKeyId = table.Column<int>(type: "int", nullable: true),
                    AcquiredAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastPlayedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    TotalPlayTime = table.Column<int>(type: "int", nullable: false, defaultValue: 0)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Libraries", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Libraries_Games_GameId",
                        column: x => x.GameId,
                        principalTable: "Games",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Libraries_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Orders",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    OrderDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    TotalAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(450)", nullable: false, defaultValue: "Pending"),
                    PaymentMethod = table.Column<string>(type: "nvarchar(max)", nullable: false, defaultValue: "Wallet")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Orders", x => x.Id);
                    table.CheckConstraint("CK_Order_TotalAmount_NonNegative", "TotalAmount >= 0");
                    table.ForeignKey(
                        name: "FK_Orders_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Reviews",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    GameId = table.Column<int>(type: "int", nullable: false),
                    Rating = table.Column<int>(type: "int", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsRecommended = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    HelpfulCount = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reviews", x => x.Id);
                    table.CheckConstraint("CK_Review_Helpful_NonNegative", "HelpfulCount >= 0");
                    table.CheckConstraint("CK_Review_Rating_Range", "Rating >= 1 AND Rating <= 5");
                    table.ForeignKey(
                        name: "FK_Reviews_Games_GameId",
                        column: x => x.GameId,
                        principalTable: "Games",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Reviews_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserRoles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Guid = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    RoleId = table.Column<int>(type: "int", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Created = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedBy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Modified = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    CreatedDateTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedUser = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserRoles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserRoles_Roles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Roles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserRoles_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Wishlists",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    GameId = table.Column<int>(type: "int", nullable: false),
                    AddedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Wishlists", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Wishlists_Games_GameId",
                        column: x => x.GameId,
                        principalTable: "Games",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Wishlists_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "OrderDetails",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OrderId = table.Column<int>(type: "int", nullable: false),
                    GameId = table.Column<int>(type: "int", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    UnitPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderDetails", x => x.Id);
                    table.CheckConstraint("CK_OrderDetail_Quantity_Positive", "Quantity > 0");
                    table.CheckConstraint("CK_OrderDetail_UnitPrice_NonNegative", "UnitPrice >= 0");
                    table.ForeignKey(
                        name: "FK_OrderDetails_Games_GameId",
                        column: x => x.GameId,
                        principalTable: "Games",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_OrderDetails_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Games",
                columns: new[] { "Id", "CoverImageUrl", "CreatedAt", "Description", "Developer", "DiscountPrice", "IsActive", "MinimumGraphics", "MinimumMemory", "MinimumOS", "MinimumProcessor", "MinimumStorage", "Price", "Publisher", "Rating", "RatingCount", "ReleaseDate", "Screenshots", "Title", "TotalSales", "TrailerUrl" },
                values: new object[] { 1, "https://cdn.cloudflare.steamstatic.com/steam/apps/2479810/header.jpg", new DateTime(2026, 5, 3, 15, 11, 15, 672, DateTimeKind.Local).AddTicks(6884), "Gray Zone Warfare is an immersive tactical FPS with a maximum focus on realism. Join a Private Military Company and explore a vast MMO open world where every decision matters. Engage in high-stakes PvEvP and PvE combat, uncover the mysteries of Lamang Island, and fight for survival against both human enemies and AI-controlled factions in an unforgiving environment.", "MADFINGER Games", 27.99m, true, "NVIDIA GeForce GTX 1080 / AMD Radeon RX 5700", "16 GB RAM", "Windows 10 64-bit", "Intel Core i5-8600 / AMD Ryzen 5 2600", "40 GB available space", 34.99m, "MADFINGER Games", 4.2000000000000002, 28500, new DateTime(2024, 4, 30, 0, 0, 0, 0, DateTimeKind.Unspecified), "[\"https://cdn.cloudflare.steamstatic.com/steam/apps/2479810/ss_1.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/2479810/ss_2.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/2479810/ss_3.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/2479810/ss_4.jpg\"]", "Gray Zone Warfare", 150000, "https://www.youtube.com/watch?v=UlNkVsB56Gw" });

            migrationBuilder.InsertData(
                table: "Games",
                columns: new[] { "Id", "CoverImageUrl", "CreatedAt", "Description", "Developer", "DiscountPrice", "IsActive", "MinimumGraphics", "MinimumMemory", "MinimumOS", "MinimumProcessor", "MinimumStorage", "Publisher", "Rating", "RatingCount", "ReleaseDate", "Screenshots", "Title", "TotalSales", "TrailerUrl" },
                values: new object[,]
                {
                    { 2, "https://cdn.cloudflare.steamstatic.com/steam/apps/1407200/header.jpg", new DateTime(2026, 5, 3, 15, 11, 15, 672, DateTimeKind.Local).AddTicks(9945), "World of Tanks is a team-based, massively multiplayer online action game dedicated to armored warfare in the mid-20th century. Throw yourself into epic tank battles with over 600 vehicles from 11 nations. Cooperate with your teammates, plan your strategy, and dominate the battlefield with realistic tank physics and strategic gameplay.", "Wargaming", null, true, "NVIDIA GeForce GT 610 / AMD Radeon HD 6450", "4 GB RAM", "Windows 7 64-bit", "Intel Core i3-2100 / AMD Phenom II X4 955", "70 GB available space", "Wargaming", 4.5, 350000, new DateTime(2010, 8, 12, 0, 0, 0, 0, DateTimeKind.Unspecified), "[\"https://cdn.cloudflare.steamstatic.com/steam/apps/1407200/ss_1.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/1407200/ss_2.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/1407200/ss_3.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/1407200/ss_4.jpg\"]", "World of Tanks", 5000000, "https://www.youtube.com/watch?v=6LreDfD7Zds" },
                    { 3, "https://cdn.cloudflare.steamstatic.com/steam/apps/236390/header.jpg", new DateTime(2026, 5, 3, 15, 11, 15, 672, DateTimeKind.Local).AddTicks(9962), "War Thunder is the most comprehensive free-to-play, cross-platform MMO military game dedicated to aviation, armored vehicles, and naval craft from the early 20th century to the most advanced modern combat units. Join now and take part in major battles on land, in the air, and at sea, fighting with millions of players from all over the world in an ever-evolving environment.", "Gaijin Entertainment", null, true, "NVIDIA GeForce GTX 660 / AMD Radeon HD 7850", "8 GB RAM", "Windows 10 64-bit", "Intel Core i5-2500 / AMD FX-8350", "50 GB available space", "Gaijin Entertainment", 4.2999999999999998, 520000, new DateTime(2013, 8, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "[\"https://cdn.cloudflare.steamstatic.com/steam/apps/236390/ss_1.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/236390/ss_2.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/236390/ss_3.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/236390/ss_4.jpg\"]", "War Thunder", 8000000, "https://www.youtube.com/watch?v=TtFk6Gnx9M4" }
                });

            migrationBuilder.InsertData(
                table: "Games",
                columns: new[] { "Id", "CoverImageUrl", "CreatedAt", "Description", "Developer", "DiscountPrice", "IsActive", "MinimumGraphics", "MinimumMemory", "MinimumOS", "MinimumProcessor", "MinimumStorage", "Price", "Publisher", "Rating", "RatingCount", "ReleaseDate", "Screenshots", "Title", "TotalSales", "TrailerUrl" },
                values: new object[,]
                {
                    { 4, "https://cdn.cloudflare.steamstatic.com/steam/apps/1771980/header.jpg", new DateTime(2026, 5, 3, 15, 11, 15, 672, DateTimeKind.Local).AddTicks(9966), "Escape from Tarkov is a hardcore and realistic online first-person action RPG/Simulator with MMO features and a story-driven walkthrough. With each passing day the situation in the Norvinsk region grows more complicated. Incessant warfare has exhausted the local population, leaving them divided and vulnerable to exploitation by private military companies.", "Battlestate Games", 44.99m, true, "NVIDIA GeForce GTX 1050 / AMD Radeon RX 560", "12 GB RAM", "Windows 10 64-bit", "Intel Core i5-2500K / AMD Ryzen 3 1200", "35 GB available space", 49.99m, "Battlestate Games", 4.0999999999999996, 180000, new DateTime(2017, 7, 27, 0, 0, 0, 0, DateTimeKind.Unspecified), "[\"https://cdn.cloudflare.steamstatic.com/steam/apps/1771980/ss_1.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/1771980/ss_2.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/1771980/ss_3.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/1771980/ss_4.jpg\"]", "Escape from Tarkov", 3000000, "https://www.youtube.com/watch?v=5HEk2sh9Q_o" },
                    { 5, "https://cdn.cloudflare.steamstatic.com/steam/apps/107410/header.jpg", new DateTime(2026, 5, 3, 15, 11, 15, 672, DateTimeKind.Local).AddTicks(9970), "Experience true combat gameplay in a massive military sandbox. Deploying a wide variety of single- and multiplayer content, over 20 vehicles and 40 weapons, and limitless opportunities for content creation, ARMA 3 is the PC's premier military game. Authentic, diverse, open - ARMA 3 sends you to war.", "Bohemia Interactive", 9.99m, true, "NVIDIA GeForce GTX 560 / AMD Radeon HD 7750", "8 GB RAM", "Windows 7 64-bit", "Intel Core i5-2300 / AMD Phenom II X4 940", "45 GB available space", 29.99m, "Bohemia Interactive", 4.7000000000000002, 450000, new DateTime(2013, 9, 12, 0, 0, 0, 0, DateTimeKind.Unspecified), "[\"https://cdn.cloudflare.steamstatic.com/steam/apps/107410/ss_1.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/107410/ss_2.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/107410/ss_3.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/107410/ss_4.jpg\"]", "ARMA 3", 10000000, "https://www.youtube.com/watch?v=OU9LWflcI_Y" },
                    { 6, "https://cdn.cloudflare.steamstatic.com/steam/apps/686810/header.jpg", new DateTime(2026, 5, 3, 15, 11, 15, 672, DateTimeKind.Local).AddTicks(9974), "Join the ever-expanding Hell Let Loose experience - a hardcore World War Two first person shooter with epic battles of 100 players with infantry, tanks, artillery, a dynamically shifting front line and a unique resource-based RTS-inspired meta-game. Fight in the most iconic battles of the Western Front, including Omaha Beach, Carentan, and Foy.", "Black Matter", 29.99m, true, "NVIDIA GeForce GTX 960 / AMD Radeon R9 380", "12 GB RAM", "Windows 10 64-bit", "Intel Core i5-6600 / AMD Ryzen 5 1400", "30 GB available space", 39.99m, "Team17", 4.5999999999999996, 85000, new DateTime(2021, 7, 27, 0, 0, 0, 0, DateTimeKind.Unspecified), "[\"https://cdn.cloudflare.steamstatic.com/steam/apps/686810/ss_1.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/686810/ss_2.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/686810/ss_3.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/686810/ss_4.jpg\"]", "Hell Let Loose", 2500000, "https://www.youtube.com/watch?v=mV-ksD1vY5o" },
                    { 7, "https://cdn.cloudflare.steamstatic.com/steam/apps/393380/header.jpg", new DateTime(2026, 5, 3, 15, 11, 15, 672, DateTimeKind.Local).AddTicks(9977), "Squad is a tactical FPS that provides authentic combat experiences through teamwork, communication, and realistic combat. It bridges the gap between arcade shooter and military simulation with large-scale combined arms warfare, base building, and integrated voice communication.", "Offworld", null, true, "NVIDIA GeForce GTX 770 / AMD Radeon R9 290", "8 GB RAM", "Windows 10 64-bit", "Intel Core i5-2500K / AMD FX-6300", "55 GB available space", 49.99m, "Offworld", 4.5, 150000, new DateTime(2020, 9, 23, 0, 0, 0, 0, DateTimeKind.Unspecified), "[\"https://cdn.cloudflare.steamstatic.com/steam/apps/393380/ss_1.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/393380/ss_2.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/393380/ss_3.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/393380/ss_4.jpg\"]", "Squad", 4000000, "https://www.youtube.com/watch?v=YviNkuXLMg4" },
                    { 8, "https://cdn.cloudflare.steamstatic.com/steam/apps/1144200/header.jpg", new DateTime(2026, 5, 3, 15, 11, 15, 672, DateTimeKind.Local).AddTicks(9980), "Ready or Not is an intense, tactical, first-person shooter that depicts a modern-day world in which SWAT police units are called to defuse hostile and confronting situations. Inspired by the SWAT series, Ready or Not brings a level of realism, tactical planning, and team-based coordination rarely seen in modern shooters.", "VOID Interactive", 34.99m, true, "NVIDIA GeForce GTX 960 / AMD Radeon R7 370", "8 GB RAM", "Windows 10 64-bit", "Intel Core i5-4430 / AMD FX-6300", "90 GB available space", 39.99m, "VOID Interactive", 4.7999999999999998, 95000, new DateTime(2023, 12, 13, 0, 0, 0, 0, DateTimeKind.Unspecified), "[\"https://cdn.cloudflare.steamstatic.com/steam/apps/1144200/ss_1.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/1144200/ss_2.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/1144200/ss_3.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/1144200/ss_4.jpg\"]", "Ready or Not", 1800000, "https://www.youtube.com/watch?v=saKvD9xBRts" },
                    { 9, "https://cdn.cloudflare.steamstatic.com/steam/apps/581320/header.jpg", new DateTime(2026, 5, 3, 15, 11, 15, 672, DateTimeKind.Local).AddTicks(9985), "Insurgency: Sandstorm is a team-based, tactical FPS based on lethal close quarters combat and objective-oriented multiplayer gameplay. Experience the intensity of modern combat where skill is rewarded, and teamwork wins the fight. Sequenced in a fictional contemporary Middle Eastern conflict, featuring both PvP and co-op modes.", "New World Interactive", 14.99m, true, "NVIDIA GeForce GTX 760 / AMD Radeon HD 7970", "8 GB RAM", "Windows 7 64-bit", "Intel Core i5-4440 / AMD FX-6300", "40 GB available space", 29.99m, "Focus Entertainment", 4.4000000000000004, 170000, new DateTime(2018, 12, 12, 0, 0, 0, 0, DateTimeKind.Unspecified), "[\"https://cdn.cloudflare.steamstatic.com/steam/apps/581320/ss_1.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/581320/ss_2.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/581320/ss_3.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/581320/ss_4.jpg\"]", "Insurgency: Sandstorm", 3500000, "https://www.youtube.com/watch?v=GwCWgM1JxBs" },
                    { 10, "https://cdn.cloudflare.steamstatic.com/steam/apps/16900/header.jpg", new DateTime(2026, 5, 3, 15, 11, 15, 672, DateTimeKind.Local).AddTicks(9989), "Ground Branch is a realistic tactical first-person shooter from one of the developers behind the original Rainbow Six and Ghost Recon games. Think, plan, and move carefully through highly detailed environments while engaging enemies in realistic firefights where bullets are deadly and every decision counts.", "BlackFoot Studios", null, true, "NVIDIA GeForce GTX 760 / AMD Radeon HD 7950", "8 GB RAM", "Windows 10 64-bit", "Intel Core i5-2500K / AMD FX-8350", "25 GB available space", 29.99m, "BlackFoot Studios", 4.4000000000000004, 12000, new DateTime(2022, 9, 8, 0, 0, 0, 0, DateTimeKind.Unspecified), "[\"https://cdn.cloudflare.steamstatic.com/steam/apps/16900/ss_1.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/16900/ss_2.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/16900/ss_3.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/16900/ss_4.jpg\"]", "Ground Branch", 450000, "https://www.youtube.com/watch?v=QZBmXK-G3-g" },
                    { 11, "https://cdn.cloudflare.steamstatic.com/steam/apps/221100/header.jpg", new DateTime(2026, 5, 3, 15, 11, 15, 673, DateTimeKind.Local).AddTicks(4), "DayZ is a hardcore open-world survival game with an extreme emphasis on player interaction. You are one of the few who have survived a mysterious zombie outbreak in the post-Soviet Republic of Chernarus. Scavenge for supplies, craft items, build bases, and fight against zombies and other desperate survivors in a sprawling 230km² landscape.", "Bohemia Interactive", 29.99m, true, "NVIDIA GeForce GTX 760 / AMD Radeon R9 270", "8 GB RAM", "Windows 10 64-bit", "Intel Core i5-4430 / AMD FX-6300", "25 GB available space", 49.99m, "Bohemia Interactive", 3.8999999999999999, 290000, new DateTime(2018, 12, 13, 0, 0, 0, 0, DateTimeKind.Unspecified), "[\"https://cdn.cloudflare.steamstatic.com/steam/apps/221100/ss_1.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/221100/ss_2.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/221100/ss_3.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/221100/ss_4.jpg\"]", "DayZ", 6000000, "https://www.youtube.com/watch?v=H9PHj4R2l5Y" },
                    { 12, "https://cdn.cloudflare.steamstatic.com/steam/apps/736220/header.jpg", new DateTime(2026, 5, 3, 15, 11, 15, 673, DateTimeKind.Local).AddTicks(7), "Post Scriptum is a WW2 simulation game, focusing on historical accuracy, large scale battles, the difficulty of coalition warfare and an intense battlefield, with an emphasis on logistics and combined arms. Fight across the Arnhem bridge, the dunes of Normandy, and through the streets of the Netherlands.", "Periscope Games", 19.99m, true, "NVIDIA GeForce GTX 970 / AMD Radeon R9 290", "8 GB RAM", "Windows 7 64-bit", "Intel Core i5-2500K / AMD Ryzen 3 1200", "35 GB available space", 29.99m, "Offworld", 4.2000000000000002, 28000, new DateTime(2018, 7, 18, 0, 0, 0, 0, DateTimeKind.Unspecified), "[\"https://cdn.cloudflare.steamstatic.com/steam/apps/736220/ss_1.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/736220/ss_2.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/736220/ss_3.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/736220/ss_4.jpg\"]", "Post Scriptum", 1200000, "https://www.youtube.com/watch?v=gKlJ4VCGmTE" }
                });

            migrationBuilder.InsertData(
                table: "Genres",
                columns: new[] { "Id", "Description", "IconUrl", "IsActive", "Name" },
                values: new object[,]
                {
                    { 1, "Action games", "", true, "Action" },
                    { 2, "Role-Playing games", "", true, "RPG" },
                    { 3, "Strategy games", "", true, "Strategy" },
                    { 4, "Sports games", "", true, "Sports" },
                    { 5, "Indie games", "", true, "Indie" },
                    { 6, "First-Person Shooter", "", true, "FPS" },
                    { 7, "Adventure games", "", true, "Adventure" },
                    { 8, "Simulation games", "", true, "Simulation" },
                    { 9, "Puzzle games", "", true, "Puzzle" },
                    { 10, "Horror games", "", true, "Horror" },
                    { 11, "Survival games", "", true, "Survival" },
                    { 12, "Open world games", "", true, "Open World" },
                    { 13, "Stealth games", "", true, "Stealth" },
                    { 14, "Racing games", "", true, "Racing" },
                    { 15, "Fighting games", "", true, "Fighting" },
                    { 16, "Massively Multiplayer Online RPG", "", true, "MMORPG" },
                    { 17, "Card-based games", "", true, "Card Game" },
                    { 18, "Turn-based games", "", true, "Turn-Based" },
                    { 19, "Tower defense games", "", true, "Tower Defense" },
                    { 20, "Sandbox games", "", true, "Sandbox" },
                    { 21, "Story-driven visual novel games", "", true, "Visual Novel" },
                    { 22, "Music and rhythm-based games", "", true, "Rhythm" },
                    { 23, "Platform jumping games", "", true, "Platformer" },
                    { 24, "Exploration-based platformer games", "", true, "Metroidvania" },
                    { 25, "Roguelike games with permadeath", "", true, "Roguelike" },
                    { 26, "Roguelike with progression elements", "", true, "Roguelite" },
                    { 27, "Last-man-standing multiplayer games", "", true, "Battle Royale" },
                    { 28, "Multiplayer Online Battle Arena", "", true, "MOBA" },
                    { 29, "Cooperative multiplayer games", "", true, "Co-op" },
                    { 30, "Single-player focused games", "", true, "Singleplayer" },
                    { 31, "Multiplayer focused games", "", true, "Multiplayer" },
                    { 32, "Educational and learning games", "", true, "Educational" },
                    { 33, "Casual and easy-to-play games", "", true, "Casual" },
                    { 34, "Party and social games", "", true, "Party" },
                    { 35, "Story-rich narrative games", "", true, "Narrative" }
                });

            migrationBuilder.InsertData(
                table: "Roles",
                columns: new[] { "Id", "Created", "CreatedBy", "CreatedDateTime", "CreatedUser", "Description", "Guid", "IsActive", "IsDeleted", "Modified", "ModifiedBy", "Name" },
                values: new object[,]
                {
                    { 1, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "", new DateTime(2026, 5, 3, 15, 11, 15, 671, DateTimeKind.Local).AddTicks(7805), "", "Administrator", new Guid("10000000-0000-0000-0000-000000000001"), true, false, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "", "Admin" },
                    { 2, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "", new DateTime(2026, 5, 3, 15, 11, 15, 671, DateTimeKind.Local).AddTicks(9336), "", "Regular User", new Guid("20000000-0000-0000-0000-000000000002"), true, false, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "", "User" },
                    { 3, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "", new DateTime(2026, 5, 3, 15, 11, 15, 671, DateTimeKind.Local).AddTicks(9346), "", "Game Publisher", new Guid("30000000-0000-0000-0000-000000000003"), true, false, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "", "Publisher" }
                });

            migrationBuilder.InsertData(
                table: "GameGenres",
                columns: new[] { "Id", "GameId", "GenreId" },
                values: new object[,]
                {
                    { 1, 1, 6 },
                    { 2, 1, 11 },
                    { 3, 1, 12 },
                    { 4, 1, 29 },
                    { 5, 1, 31 },
                    { 6, 1, 1 },
                    { 7, 2, 31 },
                    { 8, 2, 3 },
                    { 9, 2, 1 },
                    { 10, 2, 8 },
                    { 11, 3, 31 },
                    { 12, 3, 8 },
                    { 13, 3, 1 },
                    { 14, 3, 3 },
                    { 15, 4, 6 },
                    { 16, 4, 11 },
                    { 17, 4, 2 },
                    { 18, 4, 31 },
                    { 19, 4, 1 },
                    { 20, 5, 6 },
                    { 21, 5, 8 },
                    { 22, 5, 12 },
                    { 23, 5, 31 },
                    { 24, 5, 3 },
                    { 25, 5, 29 },
                    { 26, 6, 6 },
                    { 27, 6, 31 },
                    { 28, 6, 3 },
                    { 29, 6, 8 },
                    { 30, 6, 1 },
                    { 31, 7, 6 },
                    { 32, 7, 31 },
                    { 33, 7, 3 },
                    { 34, 7, 8 },
                    { 35, 7, 29 },
                    { 36, 8, 6 },
                    { 37, 8, 29 },
                    { 38, 8, 31 },
                    { 39, 8, 1 },
                    { 40, 8, 8 },
                    { 41, 9, 6 },
                    { 42, 9, 31 },
                    { 43, 9, 29 },
                    { 44, 9, 1 },
                    { 45, 10, 6 },
                    { 46, 10, 29 },
                    { 47, 10, 31 },
                    { 48, 10, 13 },
                    { 49, 10, 1 },
                    { 50, 11, 11 },
                    { 51, 11, 12 },
                    { 52, 11, 31 },
                    { 53, 11, 6 },
                    { 54, 11, 10 },
                    { 55, 12, 6 },
                    { 56, 12, 8 },
                    { 57, 12, 31 },
                    { 58, 12, 3 },
                    { 59, 12, 29 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_AccessTokens_Token",
                table: "AccessTokens",
                column: "Token",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AccessTokens_UserId",
                table: "AccessTokens",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_GameGenres_GameId_GenreId",
                table: "GameGenres",
                columns: new[] { "GameId", "GenreId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_GameGenres_GenreId",
                table: "GameGenres",
                column: "GenreId");

            migrationBuilder.CreateIndex(
                name: "IX_Games_IsActive",
                table: "Games",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_Games_ReleaseDate",
                table: "Games",
                column: "ReleaseDate");

            migrationBuilder.CreateIndex(
                name: "IX_Games_Title",
                table: "Games",
                column: "Title");

            migrationBuilder.CreateIndex(
                name: "IX_Genres_Name",
                table: "Genres",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Libraries_GameId",
                table: "Libraries",
                column: "GameId");

            migrationBuilder.CreateIndex(
                name: "IX_Libraries_UserId",
                table: "Libraries",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Libraries_UserId_GameId",
                table: "Libraries",
                columns: new[] { "UserId", "GameId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_OrderDetails_GameId",
                table: "OrderDetails",
                column: "GameId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderDetails_OrderId",
                table: "OrderDetails",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_OrderDate",
                table: "Orders",
                column: "OrderDate");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_Status",
                table: "Orders",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_UserId",
                table: "Orders",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_CreatedAt",
                table: "Reviews",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_GameId",
                table: "Reviews",
                column: "GameId");

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_UserId_GameId",
                table: "Reviews",
                columns: new[] { "UserId", "GameId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Roles_Name",
                table: "Roles",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Settings_Name",
                table: "Settings",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserRoles_RoleId",
                table: "UserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_UserRoles_UserId_RoleId",
                table: "UserRoles",
                columns: new[] { "UserId", "RoleId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_Username",
                table: "Users",
                column: "Username",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Wishlists_GameId",
                table: "Wishlists",
                column: "GameId");

            migrationBuilder.CreateIndex(
                name: "IX_Wishlists_UserId",
                table: "Wishlists",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Wishlists_UserId_GameId",
                table: "Wishlists",
                columns: new[] { "UserId", "GameId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AccessTokens");

            migrationBuilder.DropTable(
                name: "GameGenres");

            migrationBuilder.DropTable(
                name: "Libraries");

            migrationBuilder.DropTable(
                name: "OrderDetails");

            migrationBuilder.DropTable(
                name: "Reviews");

            migrationBuilder.DropTable(
                name: "Settings");

            migrationBuilder.DropTable(
                name: "UserRoles");

            migrationBuilder.DropTable(
                name: "Wishlists");

            migrationBuilder.DropTable(
                name: "Genres");

            migrationBuilder.DropTable(
                name: "Orders");

            migrationBuilder.DropTable(
                name: "Roles");

            migrationBuilder.DropTable(
                name: "Games");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
