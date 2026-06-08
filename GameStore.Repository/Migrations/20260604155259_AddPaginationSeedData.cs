using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace GameStore.Repository.Migrations
{
    /// <inheritdoc />
    public partial class AddPaginationSeedData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GameKeys_Games_GameId1",
                table: "GameKeys");

            migrationBuilder.DropIndex(
                name: "IX_GameKeys_GameId1",
                table: "GameKeys");

            migrationBuilder.DropColumn(
                name: "GameId1",
                table: "GameKeys");

            migrationBuilder.CreateTable(
                name: "PasswordResetTokens",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Token = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ExpiresAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsUsed = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PasswordResetTokens", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PasswordResetTokens_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "Screenshots" },
                values: new object[] { new DateTime(2026, 6, 4, 15, 52, 55, 978, DateTimeKind.Utc).AddTicks(4782), "[]" });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "Description", "MinimumGraphics", "MinimumProcessor", "Screenshots", "TrailerUrl" },
                values: new object[] { new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(4941), "World of Tanks is a team-based, massively multiplayer online action game dedicated to armored warfare in the mid-20th century.", "NVIDIA GeForce GT 610", "Intel Core i3-2100", "[]", "" });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "Description", "MinimumGraphics", "MinimumProcessor", "Screenshots", "TrailerUrl" },
                values: new object[] { new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5028), "War Thunder is the most comprehensive free-to-play, cross-platform MMO military game dedicated to aviation, armored vehicles, and naval craft.", "NVIDIA GeForce GTX 660", "Intel Core i5-2500", "[]", "" });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "Description", "MinimumGraphics", "MinimumProcessor", "Screenshots", "TrailerUrl" },
                values: new object[] { new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5043), "Escape from Tarkov is a hardcore and realistic online first-person action RPG/Simulator with MMO features.", "NVIDIA GeForce GTX 1050", "Intel Core i5-2500K", "[]", "" });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "Description", "MinimumGraphics", "MinimumProcessor", "Screenshots", "TrailerUrl" },
                values: new object[] { new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5056), "Experience true combat gameplay in a massive military sandbox with a wide variety of single- and multiplayer content.", "NVIDIA GeForce GTX 560", "Intel Core i5-2300", "[]", "" });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "CreatedAt", "Description", "MinimumGraphics", "MinimumProcessor", "Screenshots", "TrailerUrl" },
                values: new object[] { new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5158), "Join the ever-expanding Hell Let Loose experience - a hardcore World War Two first person shooter with epic battles of 100 players.", "NVIDIA GeForce GTX 960", "Intel Core i5-6600", "[]", "" });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "CreatedAt", "Description", "MinimumGraphics", "MinimumProcessor", "Screenshots", "TrailerUrl" },
                values: new object[] { new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5172), "Squad is a tactical FPS that provides authentic combat experiences through teamwork, communication, and realistic combat.", "NVIDIA GeForce GTX 770", "Intel Core i5-2500K", "[]", "" });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 8,
                columns: new[] { "CreatedAt", "Description", "MinimumGraphics", "MinimumProcessor", "Screenshots", "TrailerUrl" },
                values: new object[] { new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5184), "Ready or Not is an intense, tactical, first-person shooter that depicts a modern-day world in which SWAT police units are called to defuse hostile situations.", "NVIDIA GeForce GTX 960", "Intel Core i5-4430", "[]", "" });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 9,
                columns: new[] { "CreatedAt", "Description", "MinimumGraphics", "MinimumProcessor", "Screenshots", "TrailerUrl" },
                values: new object[] { new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5197), "Insurgency: Sandstorm is a team-based, tactical FPS based on lethal close quarters combat and objective-oriented multiplayer gameplay.", "NVIDIA GeForce GTX 760", "Intel Core i5-4440", "[]", "" });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 10,
                columns: new[] { "CreatedAt", "Description", "MinimumGraphics", "MinimumProcessor", "Screenshots", "TrailerUrl" },
                values: new object[] { new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5208), "Ground Branch is a realistic tactical first-person shooter from one of the developers behind the original Rainbow Six and Ghost Recon games.", "NVIDIA GeForce GTX 760", "Intel Core i5-2500K", "[]", "" });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 11,
                columns: new[] { "CreatedAt", "Description", "MinimumGraphics", "MinimumProcessor", "Screenshots", "TrailerUrl" },
                values: new object[] { new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5218), "DayZ is a hardcore open-world survival game with an extreme emphasis on player interaction in a post-Soviet Republic.", "NVIDIA GeForce GTX 760", "Intel Core i5-4430", "[]", "" });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 12,
                columns: new[] { "CreatedAt", "Description", "MinimumGraphics", "MinimumProcessor", "Screenshots", "TrailerUrl" },
                values: new object[] { new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5228), "Post Scriptum is a WW2 simulation game focusing on historical accuracy, large scale battles, and the difficulty of coalition warfare.", "NVIDIA GeForce GTX 970", "Intel Core i5-2500K", "[]", "" });

            migrationBuilder.InsertData(
                table: "Games",
                columns: new[] { "Id", "CoverImageUrl", "CreatedAt", "Description", "Developer", "DiscountPrice", "IsActive", "MinimumGraphics", "MinimumMemory", "MinimumOS", "MinimumProcessor", "MinimumStorage", "Price", "Publisher", "Rating", "RatingCount", "ReleaseDate", "Screenshots", "Title", "TotalSales", "TrailerUrl" },
                values: new object[,]
                {
                    { 13, "https://picsum.photos/seed/game13/460/215", new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5240), "A neon-drenched action-adventure set in a sprawling futuristic metropolis.", "Neon Dynamics", 20.99m, true, "", "8 GB RAM", "", "", "40 GB available space", 29.99m, "Neon Dynamics", 4.2999999999999998, 45000, new DateTime(2024, 3, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "[]", "Cyber Runner 2077", 850000, "" },
                    { 14, "https://picsum.photos/seed/game14/460/215", new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5250), "An expansive MMORPG set in a fantasy world of magic and dragons.", "Fantasy Forge", 39.99m, true, "", "16 GB RAM", "", "", "80 GB available space", 49.99m, "Fantasy Forge", 4.5999999999999996, 78000, new DateTime(2023, 7, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "[]", "Realm of Eternity", 1200000, "" },
                    { 15, "https://picsum.photos/seed/game15/460/215", new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5258), "A deep strategy game where you command military forces in realistic warfare scenarios.", "War Room Studios", null, true, "", "8 GB RAM", "", "", "30 GB available space", 39.99m, "War Room Studios", 4.4000000000000004, 32000, new DateTime(2024, 1, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "[]", "Tactical Command", 650000, "" },
                    { 16, "https://picsum.photos/seed/game16/460/215", new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5269), "High-speed racing across iconic tracks worldwide with customizable vehicles.", "Velocity Games", 4.99m, true, "", "8 GB RAM", "", "", "25 GB available space", 9.99m, "Velocity Games", 4.0999999999999996, 95000, new DateTime(2023, 5, 8, 0, 0, 0, 0, DateTimeKind.Unspecified), "[]", "Speed Champions", 2200000, "" },
                    { 17, "https://picsum.photos/seed/game17/460/215", new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5278), "A charming indie platformer with retro pixel art and clever puzzles.", "Retro Revival", 14.99m, true, "", "4 GB RAM", "", "", "2 GB available space", 19.99m, "Retro Revival", 4.7999999999999998, 22000, new DateTime(2024, 6, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "[]", "Pixel Quest", 350000, "" },
                    { 18, "https://picsum.photos/seed/game18/460/215", new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5287), "An intense squad-based tactical shooter where teamwork is essential.", "Battlefront Devs", null, true, "", "8 GB RAM", "", "", "50 GB available space", 24.99m, "Battlefront Devs", 4.2000000000000002, 41000, new DateTime(2024, 9, 12, 0, 0, 0, 0, DateTimeKind.Unspecified), "[]", "Frontline Elite", 780000, "" },
                    { 19, "https://picsum.photos/seed/game19/460/215", new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5295), "A terrifying first-person horror game set in an abandoned asylum.", "Shadow Workshop", 24.99m, true, "", "8 GB RAM", "", "", "20 GB available space", 34.99m, "Shadow Workshop", 4.5, 28000, new DateTime(2024, 10, 31, 0, 0, 0, 0, DateTimeKind.Unspecified), "[]", "Dark Corridors", 420000, "" },
                    { 20, "https://picsum.photos/seed/game20/460/215", new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5305), "Design and manage a thriving metropolis from the ground up.", "Urban Nexus", null, true, "", "8 GB RAM", "", "", "15 GB available space", 44.99m, "Urban Nexus", 4.2999999999999998, 38000, new DateTime(2023, 11, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "[]", "City Builder Pro", 910000, "" },
                    { 21, "https://picsum.photos/seed/game21/460/215", new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5312), "An epic open-world RPG where you inherit the power of ancient dragons.", "Mythic Studios", 49.99m, true, "", "16 GB RAM", "", "", "100 GB available space", 59.99m, "Mythic Studios", 4.7000000000000002, 89000, new DateTime(2024, 4, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), "[]", "Dragon's Legacy", 1500000, "" },
                    { 22, "https://picsum.photos/seed/game22/460/215", new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5321), "Fast-paced fighting game with a diverse roster of unique characters.", "Fight Club Games", 9.99m, true, "", "4 GB RAM", "", "", "10 GB available space", 14.99m, "Fight Club Games", 3.8999999999999999, 31000, new DateTime(2024, 2, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), "[]", "Arena Brawl", 560000, "" },
                    { 23, "https://picsum.photos/seed/game23/460/215", new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5351), "Collect, build, and duel in this strategic card game.", "Deck Builders Inc", null, true, "", "4 GB RAM", "", "", "5 GB available space", 4.99m, "Deck Builders Inc", 4.0, 15000, new DateTime(2024, 8, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "[]", "Card Masters", 280000, "" },
                    { 24, "https://picsum.photos/seed/game24/460/215", new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5360), "A delightful platformer through whimsical kingdoms with coins and traps.", "Platform Heroes", 11.99m, true, "", "4 GB RAM", "", "", "8 GB available space", 16.99m, "Platform Heroes", 4.4000000000000004, 19000, new DateTime(2024, 5, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "[]", "Jump Kingdom", 410000, "" },
                    { 25, "https://picsum.photos/seed/game25/460/215", new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5368), "A roguelike dungeon crawler with procedurally generated depths.", "Rogue Devs", null, true, "", "4 GB RAM", "", "", "3 GB available space", 22.99m, "Rogue Devs", 4.5999999999999996, 17000, new DateTime(2024, 3, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "[]", "Dungeon Crawler X", 310000, "" }
                });

            migrationBuilder.InsertData(
                table: "Games",
                columns: new[] { "Id", "CoverImageUrl", "CreatedAt", "Description", "Developer", "DiscountPrice", "IsActive", "MinimumGraphics", "MinimumMemory", "MinimumOS", "MinimumProcessor", "MinimumStorage", "Publisher", "Rating", "RatingCount", "ReleaseDate", "Screenshots", "Title", "TotalSales", "TrailerUrl" },
                values: new object[,]
                {
                    { 26, "https://picsum.photos/seed/game26/460/215", new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5377), "Battle royale with squad-based gameplay and unique class abilities.", "Battle Royale Co", null, true, "", "8 GB RAM", "", "", "30 GB available space", "Battle Royale Co", 3.7999999999999998, 125000, new DateTime(2023, 12, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "[]", "Last Squad Standing", 3500000, "" },
                    { 27, "https://picsum.photos/seed/game27/460/215", new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5388), "A competitive MOBA with diverse heroes and 5v5 battles.", "MOBA Creations", null, true, "", "8 GB RAM", "", "", "20 GB available space", "MOBA Creations", 4.2000000000000002, 200000, new DateTime(2023, 9, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "[]", "Nexus Arena", 4200000, "" }
                });

            migrationBuilder.InsertData(
                table: "Games",
                columns: new[] { "Id", "CoverImageUrl", "CreatedAt", "Description", "Developer", "DiscountPrice", "IsActive", "MinimumGraphics", "MinimumMemory", "MinimumOS", "MinimumProcessor", "MinimumStorage", "Price", "Publisher", "Rating", "RatingCount", "ReleaseDate", "Screenshots", "Title", "TotalSales", "TrailerUrl" },
                values: new object[,]
                {
                    { 28, "https://picsum.photos/seed/game28/460/215", new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5395), "A story-rich narrative adventure where your choices truly matter.", "StoryCraft Games", null, true, "", "4 GB RAM", "", "", "12 GB available space", 25.99m, "StoryCraft Games", 4.9000000000000004, 12000, new DateTime(2024, 4, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "[]", "The Forgotten Tale", 190000, "" },
                    { 29, "https://picsum.photos/seed/game29/460/215", new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5402), "Realistic flight simulation with detailed aircraft and global scenery.", "Aero Dynamics", 44.99m, true, "", "16 GB RAM", "", "", "150 GB available space", 54.99m, "Aero Dynamics", 4.5, 44000, new DateTime(2024, 6, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "[]", "Flight Sim Pro", 720000, "" },
                    { 30, "https://picsum.photos/seed/game30/460/215", new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5411), "A relaxing puzzle game where you cultivate beautiful gardens.", "Calm Dev Studios", null, true, "", "4 GB RAM", "", "", "1 GB available space", 7.99m, "Calm Dev Studios", 4.7000000000000002, 8500, new DateTime(2024, 7, 4, 0, 0, 0, 0, DateTimeKind.Unspecified), "[]", "Zen Garden", 140000, "" },
                    { 31, "https://picsum.photos/seed/game31/460/215", new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5421), "Classic tower defense with modern twists and upgradeable towers.", "Castle Coders", 9.99m, true, "", "4 GB RAM", "", "", "4 GB available space", 12.99m, "Castle Coders", 4.0999999999999996, 11000, new DateTime(2024, 2, 28, 0, 0, 0, 0, DateTimeKind.Unspecified), "[]", "Fortress Defense", 230000, "" },
                    { 32, "https://picsum.photos/seed/game32/460/215", new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5430), "Master turn-based tactical combat in a rich fantasy world.", "Strategy Hub", null, true, "", "8 GB RAM", "", "", "15 GB available space", 32.99m, "Strategy Hub", 4.2999999999999998, 20000, new DateTime(2023, 10, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), "[]", "Turn Based Legends", 380000, "" },
                    { 33, "https://picsum.photos/seed/game33/460/215", new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5438), "An electrifying rhythm game featuring an original soundtrack.", "Rhythm Factory", 14.99m, true, "", "4 GB RAM", "", "", "6 GB available space", 18.99m, "Rhythm Factory", 4.4000000000000004, 9500, new DateTime(2024, 1, 25, 0, 0, 0, 0, DateTimeKind.Unspecified), "[]", "Beat Revolution", 170000, "" },
                    { 34, "https://picsum.photos/seed/game34/460/215", new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5447), "A beautifully illustrated visual novel with multiple endings.", "Narrative Labs", null, true, "", "4 GB RAM", "", "", "8 GB available space", 21.99m, "Narrative Labs", 4.5999999999999996, 7000, new DateTime(2024, 8, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "[]", "Visual Story", 95000, "" },
                    { 35, "https://picsum.photos/seed/game35/460/215", new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5455), "Explore a vast interconnected world in this metroidvania adventure.", "Exploration Games", 22.99m, true, "", "4 GB RAM", "", "", "10 GB available space", 27.99m, "Exploration Games", 4.5, 14000, new DateTime(2024, 5, 8, 0, 0, 0, 0, DateTimeKind.Unspecified), "[]", "Metroid Realm", 260000, "" },
                    { 36, "https://picsum.photos/seed/game36/460/215", new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5464), "Educational games for all ages covering math, science, and language.", "EduSoft Games", null, true, "", "4 GB RAM", "", "", "2 GB available space", 5.99m, "EduSoft Games", 4.0, 5000, new DateTime(2024, 3, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "[]", "Learn & Play", 80000, "" },
                    { 37, "https://picsum.photos/seed/game37/460/215", new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5473), "The ultimate party game with dozens of mini-games for friends.", "Social Fun Studios", null, true, "", "4 GB RAM", "", "", "3 GB available space", 11.99m, "Social Fun Studios", 3.7000000000000002, 16000, new DateTime(2024, 12, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "[]", "Party Mania", 200000, "" },
                    { 38, "https://picsum.photos/seed/game38/460/215", new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5481), "An open-world western adventure where you forge your own path.", "Open World Devs", 34.99m, true, "", "12 GB RAM", "", "", "60 GB available space", 42.99m, "Open World Devs", 4.4000000000000004, 25000, new DateTime(2024, 9, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "[]", "Wild Frontier", 580000, "" },
                    { 39, "https://picsum.photos/seed/game39/460/215", new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5493), "Stranded on a deserted island, scavenge, craft, and survive.", "Survival Tech", 11.99m, true, "", "8 GB RAM", "", "", "15 GB available space", 15.99m, "Survival Tech", 4.2000000000000002, 18000, new DateTime(2024, 4, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "[]", "Island Survivor", 340000, "" },
                    { 40, "https://picsum.photos/seed/game40/460/215", new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5502), "Tactical co-op shooter requiring precise teamwork and planning.", "Teamwork Games", null, true, "", "8 GB RAM", "", "", "35 GB available space", 31.99m, "Teamwork Games", 4.2999999999999998, 21000, new DateTime(2024, 7, 22, 0, 0, 0, 0, DateTimeKind.Unspecified), "[]", "Co-op Commandos", 290000, "" },
                    { 41, "https://picsum.photos/seed/game41/460/215", new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5531), "A nostalgic RPG with charming pixel graphics and turn-based combat.", "Old School Devs", 6.99m, true, "", "4 GB RAM", "", "", "5 GB available space", 8.99m, "Old School Devs", 4.5, 11000, new DateTime(2024, 6, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "[]", "Pixel RPG", 160000, "" }
                });

            migrationBuilder.InsertData(
                table: "Games",
                columns: new[] { "Id", "CoverImageUrl", "CreatedAt", "Description", "Developer", "DiscountPrice", "MinimumGraphics", "MinimumMemory", "MinimumOS", "MinimumProcessor", "MinimumStorage", "Price", "Publisher", "Rating", "RatingCount", "ReleaseDate", "Screenshots", "Title", "TotalSales", "TrailerUrl" },
                values: new object[] { 42, "https://picsum.photos/seed/game42/460/215", new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5541), "Strategy game where you destroy enemy towers and fortify defenses.", "Strategy Labs", null, "", "4 GB RAM", "", "", "8 GB available space", 19.99m, "Strategy Labs", 3.6000000000000001, 8000, new DateTime(2024, 11, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), "[]", "Tower Crash", 110000, "" });

            migrationBuilder.InsertData(
                table: "Games",
                columns: new[] { "Id", "CoverImageUrl", "CreatedAt", "Description", "Developer", "DiscountPrice", "IsActive", "MinimumGraphics", "MinimumMemory", "MinimumOS", "MinimumProcessor", "MinimumStorage", "Price", "Publisher", "Rating", "RatingCount", "ReleaseDate", "Screenshots", "Title", "TotalSales", "TrailerUrl" },
                values: new object[,]
                {
                    { 43, "https://picsum.photos/seed/game43/460/215", new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5549), "A stealth action game where you infiltrate high-security facilities.", "Stealth Inc", 29.99m, true, "", "8 GB RAM", "", "", "40 GB available space", 36.99m, "Stealth Inc", 4.0999999999999996, 23000, new DateTime(2024, 10, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "[]", "Shadow Agent", 440000, "" },
                    { 44, "https://picsum.photos/seed/game44/460/215", new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5557), "Race through treacherous off-road tracks in a demanding rally championship.", "Racing Pixels", 22.99m, true, "", "8 GB RAM", "", "", "25 GB available space", 28.99m, "Racing Pixels", 4.0, 27000, new DateTime(2024, 1, 30, 0, 0, 0, 0, DateTimeKind.Unspecified), "[]", "Grand Prix Rally", 510000, "" },
                    { 45, "https://picsum.photos/seed/game45/460/215", new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5565), "Post-apocalyptic survival shooter set in a radioactive wasteland.", "Post-Apocalypse GS", null, true, "", "8 GB RAM", "", "", "30 GB available space", 23.99m, "Post-Apocalypse GS", 4.2000000000000002, 16000, new DateTime(2024, 8, 12, 0, 0, 0, 0, DateTimeKind.Unspecified), "[]", "Wasteland Warriors", 320000, "" },
                    { 46, "https://picsum.photos/seed/game46/460/215", new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5574), "A massive multiplayer online RPG in a persistent fantasy world.", "MMO Worlds", 35.99m, true, "", "16 GB RAM", "", "", "70 GB available space", 45.99m, "MMO Worlds", 4.4000000000000004, 52000, new DateTime(2023, 6, 18, 0, 0, 0, 0, DateTimeKind.Unspecified), "[]", "Fantasy Online", 980000, "" },
                    { 47, "https://picsum.photos/seed/game47/460/215", new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5584), "Build and manage a self-sustaining colony on a distant planet.", "Orbital Games", null, true, "", "8 GB RAM", "", "", "20 GB available space", 38.99m, "Orbital Games", 4.2999999999999998, 19000, new DateTime(2024, 5, 30, 0, 0, 0, 0, DateTimeKind.Unspecified), "[]", "Space Colony", 370000, "" },
                    { 48, "https://picsum.photos/seed/game48/460/215", new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5591), "Fast-paced multiplayer action game with dynamic arena combat.", "Battle Systems", 13.99m, true, "", "8 GB RAM", "", "", "12 GB available space", 17.99m, "Battle Systems", 3.7999999999999998, 14000, new DateTime(2024, 4, 22, 0, 0, 0, 0, DateTimeKind.Unspecified), "[]", "Combat Arena", 250000, "" }
                });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedDateTime",
                value: new DateTime(2026, 6, 4, 15, 52, 55, 841, DateTimeKind.Utc).AddTicks(9798));

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedDateTime",
                value: new DateTime(2026, 6, 4, 15, 52, 55, 843, DateTimeKind.Utc).AddTicks(924));

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedDateTime",
                value: new DateTime(2026, 6, 4, 15, 52, 55, 843, DateTimeKind.Utc).AddTicks(971));

            migrationBuilder.UpdateData(
                table: "UserRoles",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedDateTime",
                value: new DateTime(2026, 6, 4, 15, 52, 55, 976, DateTimeKind.Utc).AddTicks(7890));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Password", "Salt" },
                values: new object[] { "jRwcZWF2lpOIL7CFY/kiU7K18ASTXFekTZAOMmFDjp4=", new byte[] { 133, 4, 112, 150, 90, 101, 1, 176, 36, 90, 68, 104, 117, 196, 43, 198 } });

            migrationBuilder.InsertData(
                table: "GameGenres",
                columns: new[] { "Id", "GameId", "GenreId" },
                values: new object[,]
                {
                    { 60, 13, 1 },
                    { 61, 13, 7 },
                    { 62, 13, 30 },
                    { 63, 14, 2 },
                    { 64, 14, 16 },
                    { 65, 14, 31 },
                    { 66, 15, 3 },
                    { 67, 15, 20 },
                    { 68, 15, 30 },
                    { 69, 16, 4 },
                    { 70, 16, 14 },
                    { 71, 16, 31 },
                    { 72, 17, 5 },
                    { 73, 17, 9 },
                    { 74, 17, 33 },
                    { 75, 18, 6 },
                    { 76, 18, 1 },
                    { 77, 18, 31 },
                    { 78, 19, 10 },
                    { 79, 19, 11 },
                    { 80, 19, 7 },
                    { 81, 20, 8 },
                    { 82, 20, 3 },
                    { 83, 20, 20 },
                    { 84, 21, 2 },
                    { 85, 21, 12 },
                    { 86, 21, 7 },
                    { 87, 22, 15 },
                    { 88, 22, 1 },
                    { 89, 22, 31 },
                    { 90, 23, 17 },
                    { 91, 23, 3 },
                    { 92, 23, 33 },
                    { 93, 24, 23 },
                    { 94, 24, 9 },
                    { 95, 24, 5 },
                    { 96, 25, 25 },
                    { 97, 25, 26 },
                    { 98, 25, 5 },
                    { 99, 26, 27 },
                    { 100, 26, 31 },
                    { 101, 26, 1 },
                    { 102, 27, 28 },
                    { 103, 27, 31 },
                    { 104, 27, 3 },
                    { 105, 28, 7 },
                    { 106, 28, 35 },
                    { 107, 28, 30 },
                    { 108, 29, 8 },
                    { 109, 29, 14 },
                    { 110, 29, 31 },
                    { 111, 30, 5 },
                    { 112, 30, 9 },
                    { 113, 30, 33 },
                    { 114, 31, 19 },
                    { 115, 31, 3 },
                    { 116, 31, 33 },
                    { 117, 32, 18 },
                    { 118, 32, 2 },
                    { 119, 32, 3 },
                    { 120, 33, 22 },
                    { 121, 33, 5 },
                    { 122, 33, 33 },
                    { 123, 34, 21 },
                    { 124, 34, 35 },
                    { 125, 34, 5 },
                    { 126, 35, 24 },
                    { 127, 35, 7 },
                    { 128, 35, 5 },
                    { 129, 36, 32 },
                    { 130, 36, 33 },
                    { 131, 36, 30 },
                    { 132, 37, 34 },
                    { 133, 37, 31 },
                    { 134, 37, 33 },
                    { 135, 38, 12 },
                    { 136, 38, 1 },
                    { 137, 38, 7 },
                    { 138, 39, 11 },
                    { 139, 39, 5 },
                    { 140, 39, 30 },
                    { 141, 40, 6 },
                    { 142, 40, 29 },
                    { 143, 40, 31 },
                    { 144, 41, 2 },
                    { 145, 41, 25 },
                    { 146, 41, 5 },
                    { 147, 42, 3 },
                    { 148, 42, 19 },
                    { 149, 42, 33 },
                    { 150, 43, 13 },
                    { 151, 43, 1 },
                    { 152, 43, 7 },
                    { 153, 44, 4 },
                    { 154, 44, 14 },
                    { 155, 44, 31 },
                    { 156, 45, 6 },
                    { 157, 45, 11 },
                    { 158, 45, 31 },
                    { 159, 46, 2 },
                    { 160, 46, 12 },
                    { 161, 46, 16 },
                    { 162, 47, 8 },
                    { 163, 47, 20 },
                    { 164, 47, 30 },
                    { 165, 48, 1 },
                    { 166, 48, 31 },
                    { 167, 48, 3 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_PasswordResetTokens_Token",
                table: "PasswordResetTokens",
                column: "Token",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PasswordResetTokens_UserId_IsUsed",
                table: "PasswordResetTokens",
                columns: new[] { "UserId", "IsUsed" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PasswordResetTokens");

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 60);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 61);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 62);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 63);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 64);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 65);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 66);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 67);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 68);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 69);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 70);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 71);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 72);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 73);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 74);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 75);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 76);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 77);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 78);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 79);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 80);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 81);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 82);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 83);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 84);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 85);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 86);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 87);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 88);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 89);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 90);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 91);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 92);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 93);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 94);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 95);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 96);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 97);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 98);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 99);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 100);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 101);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 102);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 103);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 104);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 105);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 106);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 107);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 108);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 109);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 110);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 111);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 112);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 113);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 114);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 115);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 116);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 117);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 118);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 119);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 120);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 121);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 122);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 123);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 124);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 125);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 126);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 127);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 128);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 129);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 130);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 131);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 132);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 133);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 134);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 135);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 136);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 137);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 138);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 139);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 140);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 141);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 142);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 143);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 144);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 145);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 146);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 147);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 148);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 149);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 150);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 151);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 152);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 153);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 154);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 155);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 156);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 157);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 158);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 159);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 160);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 161);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 162);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 163);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 164);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 165);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 166);

            migrationBuilder.DeleteData(
                table: "GameGenres",
                keyColumn: "Id",
                keyValue: 167);

            migrationBuilder.DeleteData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 13);

            migrationBuilder.DeleteData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 14);

            migrationBuilder.DeleteData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 15);

            migrationBuilder.DeleteData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 16);

            migrationBuilder.DeleteData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 17);

            migrationBuilder.DeleteData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 18);

            migrationBuilder.DeleteData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 19);

            migrationBuilder.DeleteData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 20);

            migrationBuilder.DeleteData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 21);

            migrationBuilder.DeleteData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 22);

            migrationBuilder.DeleteData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 23);

            migrationBuilder.DeleteData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 24);

            migrationBuilder.DeleteData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 25);

            migrationBuilder.DeleteData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 26);

            migrationBuilder.DeleteData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 27);

            migrationBuilder.DeleteData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 28);

            migrationBuilder.DeleteData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 29);

            migrationBuilder.DeleteData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 30);

            migrationBuilder.DeleteData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 31);

            migrationBuilder.DeleteData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 32);

            migrationBuilder.DeleteData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 33);

            migrationBuilder.DeleteData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 34);

            migrationBuilder.DeleteData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 35);

            migrationBuilder.DeleteData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 36);

            migrationBuilder.DeleteData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 37);

            migrationBuilder.DeleteData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 38);

            migrationBuilder.DeleteData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 39);

            migrationBuilder.DeleteData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 40);

            migrationBuilder.DeleteData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 41);

            migrationBuilder.DeleteData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 42);

            migrationBuilder.DeleteData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 43);

            migrationBuilder.DeleteData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 44);

            migrationBuilder.DeleteData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 45);

            migrationBuilder.DeleteData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 46);

            migrationBuilder.DeleteData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 47);

            migrationBuilder.DeleteData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 48);

            migrationBuilder.AddColumn<int>(
                name: "GameId1",
                table: "GameKeys",
                type: "int",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "Screenshots" },
                values: new object[] { new DateTime(2026, 5, 10, 13, 27, 54, 954, DateTimeKind.Utc).AddTicks(6054), "[\"https://cdn.cloudflare.steamstatic.com/steam/apps/2479810/ss_1.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/2479810/ss_2.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/2479810/ss_3.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/2479810/ss_4.jpg\"]" });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "Description", "MinimumGraphics", "MinimumProcessor", "Screenshots", "TrailerUrl" },
                values: new object[] { new DateTime(2026, 5, 10, 13, 27, 54, 955, DateTimeKind.Utc).AddTicks(5799), "World of Tanks is a team-based, massively multiplayer online action game dedicated to armored warfare in the mid-20th century. Throw yourself into epic tank battles with over 600 vehicles from 11 nations. Cooperate with your teammates, plan your strategy, and dominate the battlefield with realistic tank physics and strategic gameplay.", "NVIDIA GeForce GT 610 / AMD Radeon HD 6450", "Intel Core i3-2100 / AMD Phenom II X4 955", "[\"https://cdn.cloudflare.steamstatic.com/steam/apps/1407200/ss_1.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/1407200/ss_2.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/1407200/ss_3.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/1407200/ss_4.jpg\"]", "https://www.youtube.com/watch?v=6LreDfD7Zds" });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "Description", "MinimumGraphics", "MinimumProcessor", "Screenshots", "TrailerUrl" },
                values: new object[] { new DateTime(2026, 5, 10, 13, 27, 54, 955, DateTimeKind.Utc).AddTicks(5816), "War Thunder is the most comprehensive free-to-play, cross-platform MMO military game dedicated to aviation, armored vehicles, and naval craft from the early 20th century to the most advanced modern combat units. Join now and take part in major battles on land, in the air, and at sea, fighting with millions of players from all over the world in an ever-evolving environment.", "NVIDIA GeForce GTX 660 / AMD Radeon HD 7850", "Intel Core i5-2500 / AMD FX-8350", "[\"https://cdn.cloudflare.steamstatic.com/steam/apps/236390/ss_1.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/236390/ss_2.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/236390/ss_3.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/236390/ss_4.jpg\"]", "https://www.youtube.com/watch?v=TtFk6Gnx9M4" });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "Description", "MinimumGraphics", "MinimumProcessor", "Screenshots", "TrailerUrl" },
                values: new object[] { new DateTime(2026, 5, 10, 13, 27, 54, 955, DateTimeKind.Utc).AddTicks(5821), "Escape from Tarkov is a hardcore and realistic online first-person action RPG/Simulator with MMO features and a story-driven walkthrough. With each passing day the situation in the Norvinsk region grows more complicated. Incessant warfare has exhausted the local population, leaving them divided and vulnerable to exploitation by private military companies.", "NVIDIA GeForce GTX 1050 / AMD Radeon RX 560", "Intel Core i5-2500K / AMD Ryzen 3 1200", "[\"https://cdn.cloudflare.steamstatic.com/steam/apps/1771980/ss_1.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/1771980/ss_2.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/1771980/ss_3.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/1771980/ss_4.jpg\"]", "https://www.youtube.com/watch?v=5HEk2sh9Q_o" });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "Description", "MinimumGraphics", "MinimumProcessor", "Screenshots", "TrailerUrl" },
                values: new object[] { new DateTime(2026, 5, 10, 13, 27, 54, 955, DateTimeKind.Utc).AddTicks(5825), "Experience true combat gameplay in a massive military sandbox. Deploying a wide variety of single- and multiplayer content, over 20 vehicles and 40 weapons, and limitless opportunities for content creation, ARMA 3 is the PC's premier military game. Authentic, diverse, open - ARMA 3 sends you to war.", "NVIDIA GeForce GTX 560 / AMD Radeon HD 7750", "Intel Core i5-2300 / AMD Phenom II X4 940", "[\"https://cdn.cloudflare.steamstatic.com/steam/apps/107410/ss_1.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/107410/ss_2.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/107410/ss_3.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/107410/ss_4.jpg\"]", "https://www.youtube.com/watch?v=OU9LWflcI_Y" });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "CreatedAt", "Description", "MinimumGraphics", "MinimumProcessor", "Screenshots", "TrailerUrl" },
                values: new object[] { new DateTime(2026, 5, 10, 13, 27, 54, 955, DateTimeKind.Utc).AddTicks(5830), "Join the ever-expanding Hell Let Loose experience - a hardcore World War Two first person shooter with epic battles of 100 players with infantry, tanks, artillery, a dynamically shifting front line and a unique resource-based RTS-inspired meta-game. Fight in the most iconic battles of the Western Front, including Omaha Beach, Carentan, and Foy.", "NVIDIA GeForce GTX 960 / AMD Radeon R9 380", "Intel Core i5-6600 / AMD Ryzen 5 1400", "[\"https://cdn.cloudflare.steamstatic.com/steam/apps/686810/ss_1.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/686810/ss_2.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/686810/ss_3.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/686810/ss_4.jpg\"]", "https://www.youtube.com/watch?v=mV-ksD1vY5o" });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "CreatedAt", "Description", "MinimumGraphics", "MinimumProcessor", "Screenshots", "TrailerUrl" },
                values: new object[] { new DateTime(2026, 5, 10, 13, 27, 54, 955, DateTimeKind.Utc).AddTicks(5835), "Squad is a tactical FPS that provides authentic combat experiences through teamwork, communication, and realistic combat. It bridges the gap between arcade shooter and military simulation with large-scale combined arms warfare, base building, and integrated voice communication.", "NVIDIA GeForce GTX 770 / AMD Radeon R9 290", "Intel Core i5-2500K / AMD FX-6300", "[\"https://cdn.cloudflare.steamstatic.com/steam/apps/393380/ss_1.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/393380/ss_2.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/393380/ss_3.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/393380/ss_4.jpg\"]", "https://www.youtube.com/watch?v=YviNkuXLMg4" });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 8,
                columns: new[] { "CreatedAt", "Description", "MinimumGraphics", "MinimumProcessor", "Screenshots", "TrailerUrl" },
                values: new object[] { new DateTime(2026, 5, 10, 13, 27, 54, 955, DateTimeKind.Utc).AddTicks(5841), "Ready or Not is an intense, tactical, first-person shooter that depicts a modern-day world in which SWAT police units are called to defuse hostile and confronting situations. Inspired by the SWAT series, Ready or Not brings a level of realism, tactical planning, and team-based coordination rarely seen in modern shooters.", "NVIDIA GeForce GTX 960 / AMD Radeon R7 370", "Intel Core i5-4430 / AMD FX-6300", "[\"https://cdn.cloudflare.steamstatic.com/steam/apps/1144200/ss_1.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/1144200/ss_2.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/1144200/ss_3.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/1144200/ss_4.jpg\"]", "https://www.youtube.com/watch?v=saKvD9xBRts" });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 9,
                columns: new[] { "CreatedAt", "Description", "MinimumGraphics", "MinimumProcessor", "Screenshots", "TrailerUrl" },
                values: new object[] { new DateTime(2026, 5, 10, 13, 27, 54, 955, DateTimeKind.Utc).AddTicks(5845), "Insurgency: Sandstorm is a team-based, tactical FPS based on lethal close quarters combat and objective-oriented multiplayer gameplay. Experience the intensity of modern combat where skill is rewarded, and teamwork wins the fight. Sequenced in a fictional contemporary Middle Eastern conflict, featuring both PvP and co-op modes.", "NVIDIA GeForce GTX 760 / AMD Radeon HD 7970", "Intel Core i5-4440 / AMD FX-6300", "[\"https://cdn.cloudflare.steamstatic.com/steam/apps/581320/ss_1.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/581320/ss_2.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/581320/ss_3.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/581320/ss_4.jpg\"]", "https://www.youtube.com/watch?v=GwCWgM1JxBs" });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 10,
                columns: new[] { "CreatedAt", "Description", "MinimumGraphics", "MinimumProcessor", "Screenshots", "TrailerUrl" },
                values: new object[] { new DateTime(2026, 5, 10, 13, 27, 54, 955, DateTimeKind.Utc).AddTicks(5850), "Ground Branch is a realistic tactical first-person shooter from one of the developers behind the original Rainbow Six and Ghost Recon games. Think, plan, and move carefully through highly detailed environments while engaging enemies in realistic firefights where bullets are deadly and every decision counts.", "NVIDIA GeForce GTX 760 / AMD Radeon HD 7950", "Intel Core i5-2500K / AMD FX-8350", "[\"https://cdn.cloudflare.steamstatic.com/steam/apps/16900/ss_1.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/16900/ss_2.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/16900/ss_3.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/16900/ss_4.jpg\"]", "https://www.youtube.com/watch?v=QZBmXK-G3-g" });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 11,
                columns: new[] { "CreatedAt", "Description", "MinimumGraphics", "MinimumProcessor", "Screenshots", "TrailerUrl" },
                values: new object[] { new DateTime(2026, 5, 10, 13, 27, 54, 955, DateTimeKind.Utc).AddTicks(5854), "DayZ is a hardcore open-world survival game with an extreme emphasis on player interaction. You are one of the few who have survived a mysterious zombie outbreak in the post-Soviet Republic of Chernarus. Scavenge for supplies, craft items, build bases, and fight against zombies and other desperate survivors in a sprawling 230km² landscape.", "NVIDIA GeForce GTX 760 / AMD Radeon R9 270", "Intel Core i5-4430 / AMD FX-6300", "[\"https://cdn.cloudflare.steamstatic.com/steam/apps/221100/ss_1.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/221100/ss_2.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/221100/ss_3.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/221100/ss_4.jpg\"]", "https://www.youtube.com/watch?v=H9PHj4R2l5Y" });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 12,
                columns: new[] { "CreatedAt", "Description", "MinimumGraphics", "MinimumProcessor", "Screenshots", "TrailerUrl" },
                values: new object[] { new DateTime(2026, 5, 10, 13, 27, 54, 955, DateTimeKind.Utc).AddTicks(5858), "Post Scriptum is a WW2 simulation game, focusing on historical accuracy, large scale battles, the difficulty of coalition warfare and an intense battlefield, with an emphasis on logistics and combined arms. Fight across the Arnhem bridge, the dunes of Normandy, and through the streets of the Netherlands.", "NVIDIA GeForce GTX 970 / AMD Radeon R9 290", "Intel Core i5-2500K / AMD Ryzen 3 1200", "[\"https://cdn.cloudflare.steamstatic.com/steam/apps/736220/ss_1.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/736220/ss_2.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/736220/ss_3.jpg\",\"https://cdn.cloudflare.steamstatic.com/steam/apps/736220/ss_4.jpg\"]", "https://www.youtube.com/watch?v=gKlJ4VCGmTE" });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedDateTime",
                value: new DateTime(2026, 5, 10, 13, 27, 54, 871, DateTimeKind.Utc).AddTicks(9810));

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedDateTime",
                value: new DateTime(2026, 5, 10, 13, 27, 54, 872, DateTimeKind.Utc).AddTicks(2387));

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedDateTime",
                value: new DateTime(2026, 5, 10, 13, 27, 54, 872, DateTimeKind.Utc).AddTicks(2398));

            migrationBuilder.UpdateData(
                table: "UserRoles",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedDateTime",
                value: new DateTime(2026, 5, 10, 13, 27, 54, 953, DateTimeKind.Utc).AddTicks(6743));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Password", "Salt" },
                values: new object[] { "fcwIuW5Lwv7Bjf6MJYM4ezTIE078ueJr++1RfTyF3IQ=", new byte[] { 188, 220, 162, 68, 4, 15, 3, 34, 226, 185, 189, 70, 81, 84, 71, 0 } });

            migrationBuilder.CreateIndex(
                name: "IX_GameKeys_GameId1",
                table: "GameKeys",
                column: "GameId1");

            migrationBuilder.AddForeignKey(
                name: "FK_GameKeys_Games_GameId1",
                table: "GameKeys",
                column: "GameId1",
                principalTable: "Games",
                principalColumn: "Id");
        }
    }
}
