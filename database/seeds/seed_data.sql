-- ============================================================================
-- GameStore — Seed Data Script (PAID GAMES ONLY)
-- Nguồn dữ liệu: Steam API (store.steampowered.com/api/appdetails)
-- Hình ảnh: Steam CDN (cdn.cloudflare.steamstatic.com / shared.akamai.steamstatic.com)
-- Tra cứu thêm: https://steamdb.info/
--
-- Cách chạy:
--   sqlcmd -S <server> -d <database> -C -i database/seeds/seed_data.sql
-- Hoặc chạy trong SQL Server Management Studio (SSMS)
-- ============================================================================

-- ============================================================================
-- 0. CLEANUP — Xoá toàn bộ dữ liệu cũ trước khi seed lại
-- ============================================================================
PRINT '=== Cleaning existing data... ===';
DELETE FROM Notifications;
DELETE FROM Libraries;
DELETE FROM Wishlists;
DELETE FROM Payments;
DELETE FROM OrderDetails;
DELETE FROM Orders;
DELETE FROM GameKeys;
DELETE FROM Reviews;
DELETE FROM GameGenres;
DELETE FROM Games;
DELETE FROM Genres;
DELETE FROM Users WHERE Id > 1;
DELETE FROM UserRoles WHERE Id > 1;
PRINT '=== Cleanup complete! ===';
GO

DBCC CHECKIDENT ('Genres', RESEED, 0);
DBCC CHECKIDENT ('Games', RESEED, 0);
DBCC CHECKIDENT ('GameGenres', RESEED, 0);
DBCC CHECKIDENT ('GameKeys', RESEED, 0);
DBCC CHECKIDENT ('Reviews', RESEED, 0);
DBCC CHECKIDENT ('Orders', RESEED, 0);
DBCC CHECKIDENT ('OrderDetails', RESEED, 0);
DBCC CHECKIDENT ('Payments', RESEED, 0);
DBCC CHECKIDENT ('Libraries', RESEED, 0);
DBCC CHECKIDENT ('Wishlists', RESEED, 0);
DBCC CHECKIDENT ('Notifications', RESEED, 0);
GO

-- ============================================================================
-- 1. GENRES (35 thể loại)
-- ============================================================================
SET IDENTITY_INSERT Genres ON;
    INSERT INTO Genres (Id, Name, Description, IconUrl, IsActive) VALUES
    (1,  N'Action',       N'Action games',                                    '', 1),
    (2,  N'RPG',          N'Role-Playing games',                              '', 1),
    (3,  N'Strategy',     N'Strategy games',                                  '', 1),
    (4,  N'Sports',       N'Sports games',                                    '', 1),
    (5,  N'Indie',        N'Indie games',                                     '', 1),
    (6,  N'FPS',          N'First-Person Shooter',                            '', 1),
    (7,  N'Adventure',    N'Adventure games',                                 '', 1),
    (8,  N'Simulation',   N'Simulation games',                                '', 1),
    (9,  N'Puzzle',       N'Puzzle games',                                    '', 1),
    (10, N'Horror',       N'Horror games',                                    '', 1),
    (11, N'Survival',     N'Survival games',                                  '', 1),
    (12, N'Open World',   N'Open world games',                                '', 1),
    (13, N'Stealth',      N'Stealth games',                                   '', 1),
    (14, N'Racing',       N'Racing games',                                    '', 1),
    (15, N'Fighting',     N'Fighting games',                                  '', 1),
    (16, N'MMORPG',       N'Massively Multiplayer Online RPG',                '', 1),
    (17, N'Card Game',    N'Card-based games',                                '', 1),
    (18, N'Turn-Based',   N'Turn-based games',                                '', 1),
    (19, N'Tower Defense',N'Tower defense games',                             '', 1),
    (20, N'Sandbox',      N'Sandbox games',                                   '', 1),
    (21, N'Visual Novel', N'Story-driven visual novel games',                 '', 1),
    (22, N'Rhythm',       N'Music and rhythm-based games',                    '', 1),
    (23, N'Platformer',   N'Platform jumping games',                          '', 1),
    (24, N'Metroidvania', N'Exploration-based platformer games',              '', 1),
    (25, N'Roguelike',    N'Roguelike games with permadeath',                 '', 1),
    (26, N'Roguelite',    N'Roguelike with progression elements',             '', 1),
    (27, N'Battle Royale',N'Last-man-standing multiplayer games',             '', 1),
    (28, N'MOBA',         N'Multiplayer Online Battle Arena',                  '', 1),
    (29, N'Co-op',        N'Cooperative multiplayer games',                   '', 1),
    (30, N'Singleplayer', N'Single-player focused games',                     '', 1),
    (31, N'Multiplayer',  N'Multiplayer focused games',                       '', 1),
    (32, N'Educational',  N'Educational and learning games',                  '', 1),
    (33, N'Casual',       N'Casual and easy-to-play games',                   '', 1),
    (34, N'Party',        N'Party and social games',                          '', 1),
    (35, N'Narrative',    N'Story-rich narrative games',                      '', 1);
    SET IDENTITY_INSERT Genres OFF;
GO

-- ============================================================================
-- 2. GAMES (26 paid Steam games, IDs 5-33)
-- ============================================================================
SET IDENTITY_INSERT Games ON;

    -- Grand Theft Auto V (AppID: 271590)
    INSERT INTO Games (Id, Title, Description, Price, Developer, Publisher, ReleaseDate,
        CoverImageUrl, Screenshots, TotalSales, Rating, RatingCount, IsActive, CreatedAt,
        MinimumOS, MinimumProcessor, MinimumMemory, MinimumGraphics, MinimumStorage, TrailerUrl)
    VALUES (5,
        N'Grand Theft Auto V',
        N'Grand Theft Auto V for PC offers players the option to explore the award-winning world of Los Santos and Blaine County in resolutions of up to 4k and beyond, as well as the chance to experience the game at 60 frames per second.',
        299900, N'Rockstar North', N'Rockstar Games', '2015-04-13',
        'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/header.jpg',
        '[]', 10000000, 4.6, 850000, 1, GETUTCDATE(),
        N'Windows 10 64 Bit', N'Intel Core i5-3470 or AMD FX-8350', N'8 GB RAM', N'NVIDIA GeForce GTX 660 2GB or AMD HD 7870 2GB', N'120 GB available space', '');

    -- ELDEN RING (AppID: 1245620)
    INSERT INTO Games (Id, Title, Description, Price, Developer, Publisher, ReleaseDate,
        CoverImageUrl, Screenshots, TotalSales, Rating, RatingCount, IsActive, CreatedAt,
        MinimumOS, MinimumProcessor, MinimumMemory, MinimumGraphics, MinimumStorage, TrailerUrl)
    VALUES (6,
        N'ELDEN RING',
        N'THE CRITICALLY ACCLAIMED FANTASY ACTION RPG. Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring and become an Elden Lord in the Lands Between. A vast world full of excitement and secrets awaits.',
        1199000, N'FromSoftware, Inc.', N'FromSoftware, Inc. / Bandai Namco Entertainment', '2022-02-24',
        'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/header.jpg',
        '[]', 6000000, 4.8, 580000, 1, GETUTCDATE(),
        N'Windows 10', N'Intel Core i5-8400 or AMD Ryzen 3 3300X', N'12 GB RAM', N'NVIDIA GeForce GTX 1060 3GB or AMD Radeon RX 580', N'60 GB available space', '');

    -- Cyberpunk 2077 (AppID: 1091500)
    INSERT INTO Games (Id, Title, Description, Price, Developer, Publisher, ReleaseDate,
        CoverImageUrl, Screenshots, TotalSales, Rating, RatingCount, IsActive, CreatedAt,
        MinimumOS, MinimumProcessor, MinimumMemory, MinimumGraphics, MinimumStorage, TrailerUrl)
    VALUES (7,
        N'Cyberpunk 2077',
        N'Cyberpunk 2077 is an open-world, action-adventure RPG set in the dark future of Night City — a dangerous megalopolis obsessed with power, glamor, and ceaseless body modification. Play as V, a mercenary outlaw in a city of dreams and nightmares.',
        1199000, N'CD PROJEKT RED', N'CD PROJEKT RED', '2020-12-09',
        'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/header.jpg',
        '[]', 7500000, 4.5, 620000, 1, GETUTCDATE(),
        N'64-bit Windows 10', N'Intel Core i5-3570K or AMD FX-8310', N'8 GB RAM', N'NVIDIA GeForce GTX 780 3GB or AMD Radeon RX 470', N'70 GB available space', '');

    -- Baldur's Gate 3 (AppID: 1086940)
    INSERT INTO Games (Id, Title, Description, Price, Developer, Publisher, ReleaseDate,
        CoverImageUrl, Screenshots, TotalSales, Rating, RatingCount, IsActive, CreatedAt,
        MinimumOS, MinimumProcessor, MinimumMemory, MinimumGraphics, MinimumStorage, TrailerUrl)
    VALUES (8,
        N'Baldur''s Gate 3',
        N'Baldur''s Gate 3 is a story-rich, party-based RPG set in the universe of Dungeons & Dragons, where your choices shape a tale of fellowship and betrayal, survival and sacrifice, and the lure of absolute power.',
        1199000, N'Larian Studios', N'Larian Studios', '2023-08-03',
        'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1086940/header.jpg',
        '[]', 5500000, 4.9, 490000, 1, GETUTCDATE(),
        N'Windows 10 64-bit', N'Intel Core i5-4690 or AMD FX-8350', N'8 GB RAM', N'NVIDIA GeForce GTX 970 or AMD Radeon RX 480', N'150 GB available space', '');

    -- Red Dead Redemption 2 (AppID: 1174180)
    INSERT INTO Games (Id, Title, Description, Price, Developer, Publisher, ReleaseDate,
        CoverImageUrl, Screenshots, TotalSales, Rating, RatingCount, IsActive, CreatedAt,
        MinimumOS, MinimumProcessor, MinimumMemory, MinimumGraphics, MinimumStorage, TrailerUrl)
    VALUES (9,
        N'Red Dead Redemption 2',
        N'Arthur Morgan and the Van der Linde Gang are outlaws on the run. With federal agents and bounty hunters massing on their heels, the gang must rob, steal, and fight their way across the rugged heartland of America in an epic Western saga.',
        1199000, N'Rockstar Games', N'Rockstar Games', '2019-12-05',
        'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1174180/header.jpg',
        '[]', 9500000, 4.7, 720000, 1, GETUTCDATE(),
        N'Windows 10 64-bit', N'Intel Core i5-2500K or AMD FX-6300', N'8 GB RAM', N'NVIDIA GeForce GTX 770 2GB or AMD Radeon R9 280', N'150 GB available space', '');

    -- The Witcher 3: Wild Hunt (AppID: 292030)
    INSERT INTO Games (Id, Title, Description, Price, Developer, Publisher, ReleaseDate,
        CoverImageUrl, Screenshots, TotalSales, Rating, RatingCount, IsActive, CreatedAt,
        MinimumOS, MinimumProcessor, MinimumMemory, MinimumGraphics, MinimumStorage, TrailerUrl)
    VALUES (10,
        N'The Witcher 3: Wild Hunt',
        N'You are Geralt of Rivia, mercenary monster slayer. Before you stands a war-torn, monster-infested continent you can explore at will. Your current contract? Tracking down Ciri — the Child of Prophecy, a living weapon that can change the shape of the world.',
        799900, N'CD PROJEKT RED', N'CD PROJEKT RED', '2015-05-18',
        'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/292030/header.jpg',
        '[]', 8500000, 4.8, 680000, 1, GETUTCDATE(),
        N'64-bit Windows 7 or 8 (8.1)', N'Intel Core i5-2500K or AMD Phenom II X4 940', N'6 GB RAM', N'NVIDIA GeForce GTX 660 or AMD Radeon HD 7870', N'50 GB available space', '');

    -- Monster Hunter: World (AppID: 582010)
    INSERT INTO Games (Id, Title, Description, Price, Developer, Publisher, ReleaseDate,
        CoverImageUrl, Screenshots, TotalSales, Rating, RatingCount, IsActive, CreatedAt,
        MinimumOS, MinimumProcessor, MinimumMemory, MinimumGraphics, MinimumStorage, TrailerUrl)
    VALUES (11,
        N'Monster Hunter: World',
        N'Welcome to a new world! In Monster Hunter: World, the latest installment in the series, you can enjoy the ultimate hunting experience, using everything at your disposal to hunt monsters in a new world teeming with surprises and excitement.',
        599900, N'CAPCOM Co., Ltd.', N'CAPCOM Co., Ltd.', '2018-08-08',
        'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/582010/header.jpg',
        '[]', 4500000, 4.6, 320000, 1, GETUTCDATE(),
        N'Windows 10 (64-bit)', N'Intel Core i5-4460 or AMD FX-6300', N'8 GB RAM', N'NVIDIA GeForce GTX 760 or AMD Radeon R7 260x', N'50 GB available space', '');

    -- Stardew Valley (AppID: 413150)
    INSERT INTO Games (Id, Title, Description, Price, Developer, Publisher, ReleaseDate,
        CoverImageUrl, Screenshots, TotalSales, Rating, RatingCount, IsActive, CreatedAt,
        MinimumOS, MinimumProcessor, MinimumMemory, MinimumGraphics, MinimumStorage, TrailerUrl)
    VALUES (12,
        N'Stardew Valley',
        N'You''ve inherited your grandfather''s old farm plot in Stardew Valley. Armed with hand-me-down tools and a few coins, you set out to begin your new life. Can you learn to live off the land and turn these overgrown fields into a thriving home?',
        199900, N'ConcernedApe', N'ConcernedApe', '2016-02-26',
        'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/413150/header.jpg',
        '[]', 18000000, 4.9, 620000, 1, GETUTCDATE(),
        N'Windows Vista or greater', N'2 GHz processor', N'2 GB RAM', N'DirectX 10 compatible GPU', N'1 GB available space', '');

    -- Terraria (AppID: 105600)
    INSERT INTO Games (Id, Title, Description, Price, Developer, Publisher, ReleaseDate,
        CoverImageUrl, Screenshots, TotalSales, Rating, RatingCount, IsActive, CreatedAt,
        MinimumOS, MinimumProcessor, MinimumMemory, MinimumGraphics, MinimumStorage, TrailerUrl)
    VALUES (13,
        N'Terraria',
        N'Dig, fight, explore, build! Nothing is impossible in this action-packed adventure game. The world is your canvas and the ground itself is your paint. With over 20 biomes to explore, thousands of items to craft, and countless enemies to defeat.',
        99900, N'Re-Logic', N'Re-Logic', '2011-05-16',
        'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/105600/header.jpg',
        '[]', 35000000, 4.8, 850000, 1, GETUTCDATE(),
        N'Windows Xp, Vista, 7, 8/8.1, 10', N'2.0 GHz processor', N'2.5 GB RAM', N'128MB VRAM supporting Shader Model 2.0', N'500 MB available space', '');

    -- Left 4 Dead 2 (AppID: 550)
    INSERT INTO Games (Id, Title, Description, Price, Developer, Publisher, ReleaseDate,
        CoverImageUrl, Screenshots, TotalSales, Rating, RatingCount, IsActive, CreatedAt,
        MinimumOS, MinimumProcessor, MinimumMemory, MinimumGraphics, MinimumStorage, TrailerUrl)
    VALUES (14,
        N'Left 4 Dead 2',
        N'Set in the zombie apocalypse, Left 4 Dead 2 is a co-operative action horror FPS that takes you and your friends through the cities, swamps and cemeteries of the Deep South, from Savannah to New Orleans across five expansive campaigns.',
        99900, N'Valve', N'Valve', '2009-11-16',
        'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/550/header.jpg',
        '[]', 22000000, 4.7, 780000, 1, GETUTCDATE(),
        N'Windows 7 32/64-bit / Vista 32/64 / XP', N'Pentium 4 3.0GHz', N'2 GB RAM', N'DirectX 9 compatible GPU with 128MB', N'13 GB available space', '');

    -- Garry's Mod (AppID: 4000)
    INSERT INTO Games (Id, Title, Description, Price, Developer, Publisher, ReleaseDate,
        CoverImageUrl, Screenshots, TotalSales, Rating, RatingCount, IsActive, CreatedAt,
        MinimumOS, MinimumProcessor, MinimumMemory, MinimumGraphics, MinimumStorage, TrailerUrl)
    VALUES (15,
        N'Garry''s Mod',
        N'Garry''s Mod is a physics sandbox. There aren''t any predefined aims or goals. We give you the tools and leave you to play. Create contraptions, build machines, and experiment with physics in this open-ended sandbox game.',
        49900, N'Facepunch Studios', N'Valve', '2006-11-29',
        'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4000/header.jpg',
        '[]', 12000000, 4.6, 520000, 1, GETUTCDATE(),
        N'Windows 10', N'2 GHz Processor or better', N'4 GB RAM', N'DirectX 9 compatible GPU', N'5 GB available space', '');

    -- Among Us (AppID: 945360)
    INSERT INTO Games (Id, Title, Description, Price, Developer, Publisher, ReleaseDate,
        CoverImageUrl, Screenshots, TotalSales, Rating, RatingCount, IsActive, CreatedAt,
        MinimumOS, MinimumProcessor, MinimumMemory, MinimumGraphics, MinimumStorage, TrailerUrl)
    VALUES (16,
        N'Among Us',
        N'An online and local party game of teamwork and betrayal for 4-15 players...in space! Join your crewmates in a multiplayer game of teamwork and betrayal as you work together to keep your ship in order while identifying the Impostor among you.',
        29900, N'Innersloth', N'Innersloth', '2018-11-16',
        'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/945360/header.jpg',
        '[]', 25000000, 4.2, 1100000, 1, GETUTCDATE(),
        N'Windows 10 x32bit', N'INTEL i3-4330', N'1 GB RAM', N'Integrated GPU', N'250 MB available space', '');

    -- Phasmophobia (AppID: 739630)
    INSERT INTO Games (Id, Title, Description, Price, Developer, Publisher, ReleaseDate,
        CoverImageUrl, Screenshots, TotalSales, Rating, RatingCount, IsActive, CreatedAt,
        MinimumOS, MinimumProcessor, MinimumMemory, MinimumGraphics, MinimumStorage, TrailerUrl)
    VALUES (17,
        N'Phasmophobia',
        N'Phasmophobia is a 4 player online co-op psychological horror. Paranormal activity is on the rise and it''s up to you and your team to use all the ghost-hunting equipment at your disposal in order to gather as much evidence as you can.',
        199900, N'Kinetic Games', N'Kinetic Games', '2020-09-18',
        'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/739630/header.jpg',
        '[]', 12000000, 4.7, 480000, 1, GETUTCDATE(),
        N'Windows 10 64Bit', N'Intel Core i5-4590 or AMD FX-8350', N'8 GB RAM', N'NVIDIA GeForce GTX 970 or AMD Radeon R9 290', N'21 GB available space', '');

    -- Valheim (AppID: 892970)
    INSERT INTO Games (Id, Title, Description, Price, Developer, Publisher, ReleaseDate,
        CoverImageUrl, Screenshots, TotalSales, Rating, RatingCount, IsActive, CreatedAt,
        MinimumOS, MinimumProcessor, MinimumMemory, MinimumGraphics, MinimumStorage, TrailerUrl)
    VALUES (18,
        N'Valheim',
        N'A brutal exploration and survival game for 1-10 players, set in a procedurally-generated purgatory inspired by viking culture. Battle, build, and conquer your way to a saga worthy of Odin''s patronage!',
        399900, N'Iron Gate AB', N'Coffee Stain Publishing', '2021-02-02',
        'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/892970/header.jpg',
        '[]', 8000000, 4.8, 420000, 1, GETUTCDATE(),
        N'Windows 10 or later', N'2.6 GHz quad-core Intel or AMD', N'8 GB RAM', N'NVIDIA GeForce GTX 950 or AMD Radeon HD 7970', N'2 GB available space', '');

    -- Rust (AppID: 252490)
    INSERT INTO Games (Id, Title, Description, Price, Developer, Publisher, ReleaseDate,
        CoverImageUrl, Screenshots, TotalSales, Rating, RatingCount, IsActive, CreatedAt,
        MinimumOS, MinimumProcessor, MinimumMemory, MinimumGraphics, MinimumStorage, TrailerUrl)
    VALUES (19,
        N'Rust',
        N'The only aim in Rust is to survive. Everything wants you to die - the island''s wildlife, other inhabitants, the environment, and other survivors. Do whatever it takes to last another night. Build bases, craft weapons, and form alliances.',
        399900, N'Facepunch Studios', N'Facepunch Studios', '2018-02-08',
        'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/252490/header.jpg',
        '[]', 15000000, 4.3, 750000, 1, GETUTCDATE(),
        N'Windows 11 64bit', N'Intel Core i7-3770 or AMD FX-9590', N'10 GB RAM', N'NVIDIA GeForce GTX 670 or AMD R9 280', N'25 GB available space', '');

    -- ARK: Survival Evolved (AppID: 346110)
    INSERT INTO Games (Id, Title, Description, Price, Developer, Publisher, ReleaseDate,
        CoverImageUrl, Screenshots, TotalSales, Rating, RatingCount, IsActive, CreatedAt,
        MinimumOS, MinimumProcessor, MinimumMemory, MinimumGraphics, MinimumStorage, TrailerUrl)
    VALUES (20,
        N'ARK: Survival Evolved',
        N'Stranded on the shores of a mysterious island, you must learn to survive. Use your cunning to kill or tame the primeval creatures roaming the land, and encounter other players to survive, dominate... and escape!',
        299900, N'Studio Wildcard', N'Studio Wildcard / Snail Games USA', '2017-08-27',
        'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/346110/header.jpg',
        '[]', 18000000, 4.2, 780000, 1, GETUTCDATE(),
        N'Windows 7/8.1/10 (64-bit)', N'Intel Core i5-2400 or AMD FX-8320', N'8 GB RAM', N'NVIDIA GeForce GTX 670 or AMD Radeon HD 7870', N'60 GB available space', '');

    -- Hogwarts Legacy (AppID: 990080)
    INSERT INTO Games (Id, Title, Description, Price, Developer, Publisher, ReleaseDate,
        CoverImageUrl, Screenshots, TotalSales, Rating, RatingCount, IsActive, CreatedAt,
        MinimumOS, MinimumProcessor, MinimumMemory, MinimumGraphics, MinimumStorage, TrailerUrl)
    VALUES (21,
        N'Hogwarts Legacy',
        N'Hogwarts Legacy is an immersive, open-world action RPG. Now you can take control of the action and be at the center of your own adventure in the wizarding world. Explore Hogwarts, learn magical spells, and uncover hidden mysteries.',
        1199000, N'Avalanche Software', N'Warner Bros. Games', '2023-02-10',
        'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/990080/header.jpg',
        '[]', 5000000, 4.6, 420000, 1, GETUTCDATE(),
        N'64-bit Windows 10', N'Intel Core i5-6600 or AMD Ryzen 5 1400', N'16 GB RAM', N'NVIDIA GeForce GTX 960 4GB or AMD Radeon RX 470 4GB', N'85 GB available space', '');

    -- Sid Meier's Civilization VI (AppID: 289070)
    INSERT INTO Games (Id, Title, Description, Price, Developer, Publisher, ReleaseDate,
        CoverImageUrl, Screenshots, TotalSales, Rating, RatingCount, IsActive, CreatedAt,
        MinimumOS, MinimumProcessor, MinimumMemory, MinimumGraphics, MinimumStorage, TrailerUrl)
    VALUES (22,
        N'Sid Meier''s Civilization VI',
        N'Expand your empire, advance your culture and go head-to-head against history''s greatest leaders. Will your civilization stand the test of time? Build wonders, wage wars, and discover new technologies in this award-winning strategy game.',
        1199000, N'Firaxis Games', N'2K', '2016-10-20',
        'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/289070/header.jpg',
        '[]', 9500000, 4.5, 380000, 1, GETUTCDATE(),
        N'Windows 7x64 / Windows 8.1x64 / Windows 10x64', N'Intel Core i3 2.5 GHz or AMD Phenom II 2.6 GHz', N'4 GB RAM', N'1GB DirectX 11 GPU (NVIDIA 650 or AMD HD 5570)', N'15 GB available space', '');

    -- Euro Truck Simulator 2 (AppID: 227300)
    INSERT INTO Games (Id, Title, Description, Price, Developer, Publisher, ReleaseDate,
        CoverImageUrl, Screenshots, TotalSales, Rating, RatingCount, IsActive, CreatedAt,
        MinimumOS, MinimumProcessor, MinimumMemory, MinimumGraphics, MinimumStorage, TrailerUrl)
    VALUES (23,
        N'Euro Truck Simulator 2',
        N'Travel across Europe as king of the road, a trucker who delivers important cargo across impressive distances! With dozens of cities to explore, your endurance, skill and speed will all be pushed to their limits.',
        199900, N'SCS Software', N'SCS Software', '2012-10-12',
        'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/227300/header.jpg',
        '[]', 18000000, 4.7, 420000, 1, GETUTCDATE(),
        N'Windows 10 64-bit', N'Intel Core i5-6400 or AMD Ryzen 3 1200', N'8 GB RAM', N'NVIDIA GeForce GTX 660 or AMD Radeon HD 7850', N'12 GB available space', '');

    -- Fallout 4 (AppID: 377160)
    INSERT INTO Games (Id, Title, Description, Price, Developer, Publisher, ReleaseDate,
        CoverImageUrl, Screenshots, TotalSales, Rating, RatingCount, IsActive, CreatedAt,
        MinimumOS, MinimumProcessor, MinimumMemory, MinimumGraphics, MinimumStorage, TrailerUrl)
    VALUES (26,
        N'Fallout 4',
        N'From Bethesda Game Studios, the award-winning creators of Starfield and The Elder Scrolls V: Skyrim, comes Fallout 4. A landmark in open-world RPG design and winner of over 200 Best Of honors, including the DICE Game of the Year.',
        399900, N'Bethesda Game Studios', N'Bethesda Softworks', '2015-11-09',
        'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/377160/header.jpg',
        '[]', 8500000, 4.5, 520000, 1, GETUTCDATE(),
        N'Windows 7/8/10 (64-bit)', N'Intel Core i5-2300 or AMD Phenom II X4 945', N'8 GB RAM', N'NVIDIA GeForce GTX 550 Ti 2GB or AMD Radeon HD 7870 2GB', N'30 GB available space', '');

    -- Skyrim Special Edition (AppID: 489830)
    INSERT INTO Games (Id, Title, Description, Price, Developer, Publisher, ReleaseDate,
        CoverImageUrl, Screenshots, TotalSales, Rating, RatingCount, IsActive, CreatedAt,
        MinimumOS, MinimumProcessor, MinimumMemory, MinimumGraphics, MinimumStorage, TrailerUrl)
    VALUES (27,
        N'The Elder Scrolls V: Skyrim Special Edition',
        N'Winner of more than 200 Game of the Year Awards, Skyrim Special Edition brings the epic fantasy to life in stunning detail. The Special Edition includes the critically acclaimed game and all official add-ons with remastered art and effects.',
        399900, N'Bethesda Game Studios', N'Bethesda Softworks', '2016-10-27',
        'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/489830/header.jpg',
        '[]', 20000000, 4.7, 720000, 1, GETUTCDATE(),
        N'Windows 7/8.1/10 (64-bit)', N'Intel i5-750 or AMD Phenom II X4 945', N'8 GB RAM', N'NVIDIA GeForce GTX 470 1GB or AMD HD 7870 2GB', N'12 GB available space', '');

    -- Dark Souls III (AppID: 374320)
    INSERT INTO Games (Id, Title, Description, Price, Developer, Publisher, ReleaseDate,
        CoverImageUrl, Screenshots, TotalSales, Rating, RatingCount, IsActive, CreatedAt,
        MinimumOS, MinimumProcessor, MinimumMemory, MinimumGraphics, MinimumStorage, TrailerUrl)
    VALUES (28,
        N'DARK SOULS III',
        N'Dark Souls continues to push the boundaries with the latest, ambitious chapter in the critically-acclaimed and genre-defining series. Prepare yourself and Embrace The Darkness! A world drenched in desolation and darkness awaits.',
        1199000, N'FromSoftware, Inc.', N'FromSoftware, Inc./Bandai Namco Entertainment', '2016-04-11',
        'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/374320/header.jpg',
        '[]', 7000000, 4.7, 380000, 1, GETUTCDATE(),
        N'Windows 7 SP1 64bit, Windows 8.1 64bit, Windows 10 64bit', N'Intel Core i5-2500 or AMD FX-6350', N'8 GB RAM', N'NVIDIA GeForce GTX 770 or AMD Radeon R9 280', N'25 GB available space', '');

    -- Sekiro: Shadows Die Twice (AppID: 814380)
    INSERT INTO Games (Id, Title, Description, Price, Developer, Publisher, ReleaseDate,
        CoverImageUrl, Screenshots, TotalSales, Rating, RatingCount, IsActive, CreatedAt,
        MinimumOS, MinimumProcessor, MinimumMemory, MinimumGraphics, MinimumStorage, TrailerUrl)
    VALUES (29,
        N'Sekiro: Shadows Die Twice',
        N'Game of the Year - The Game Awards 2019. Carve your own clever path to vengeance in the award winning adventure from developer FromSoftware. Explore a beautiful yet deadly world and master the art of the blade in visceral combat.',
        1199000, N'FromSoftware, Inc.', N'Activision', '2019-03-21',
        'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/814380/header.jpg',
        '[]', 4500000, 4.6, 290000, 1, GETUTCDATE(),
        N'Windows 7 64-bit, Windows 8 64-bit, Windows 10 64-bit', N'Intel Core i5-2500K or AMD Ryzen 5 1400', N'8 GB RAM', N'NVIDIA GeForce GTX 970 or AMD Radeon RX 570', N'25 GB available space', '');

    -- God of War (AppID: 1593500)
    INSERT INTO Games (Id, Title, Description, Price, Developer, Publisher, ReleaseDate,
        CoverImageUrl, Screenshots, TotalSales, Rating, RatingCount, IsActive, CreatedAt,
        MinimumOS, MinimumProcessor, MinimumMemory, MinimumGraphics, MinimumStorage, TrailerUrl)
    VALUES (30,
        N'God of War',
        N'His vengeance against the Gods of Olympus years behind him, Kratos now lives as a man in the realm of Norse Gods and monsters. It is in this harsh, unforgiving world that he must fight to survive... and teach his son to do the same.',
        999000, N'Santa Monica Studio', N'PlayStation Publishing LLC', '2022-01-14',
        'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1593500/header.jpg',
        '[]', 3800000, 4.8, 350000, 1, GETUTCDATE(),
        N'Windows 10', N'Intel Core i5-2500K or AMD Ryzen 3 1200', N'8 GB RAM', N'NVIDIA GeForce GTX 960 or AMD Radeon R9 290X', N'70 GB available space', '');

    -- Marvel's Spider-Man Remastered (AppID: 1817070)
    INSERT INTO Games (Id, Title, Description, Price, Developer, Publisher, ReleaseDate,
        CoverImageUrl, Screenshots, TotalSales, Rating, RatingCount, IsActive, CreatedAt,
        MinimumOS, MinimumProcessor, MinimumMemory, MinimumGraphics, MinimumStorage, TrailerUrl)
    VALUES (31,
        N'Marvel''s Spider-Man Remastered',
        N'In Marvel''s Spider-Man Remastered, the worlds of Peter Parker and Spider-Man collide in an original action-packed story. Play as an experienced Peter Parker, fighting big crime and iconic villains in Marvel''s New York.',
        1199000, N'Insomniac Games', N'PlayStation Publishing LLC', '2022-08-12',
        'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1817070/header.jpg',
        '[]', 3200000, 4.7, 280000, 1, GETUTCDATE(),
        N'Windows 10 64-bit', N'Intel Core i3-4160 or AMD Ryzen 3 1300X', N'8 GB RAM', N'NVIDIA GeForce GTX 950 or AMD Radeon RX 470', N'75 GB available space', '');

    -- Horizon Zero Dawn Complete Edition (AppID: 1151640)
    INSERT INTO Games (Id, Title, Description, Price, Developer, Publisher, ReleaseDate,
        CoverImageUrl, Screenshots, TotalSales, Rating, RatingCount, IsActive, CreatedAt,
        MinimumOS, MinimumProcessor, MinimumMemory, MinimumGraphics, MinimumStorage, TrailerUrl)
    VALUES (32,
        N'Horizon Zero Dawn Complete Edition',
        N'Experience Aloy''s legendary quest to unravel the mysteries of a future Earth ruled by Machines. Use devastating tactical attacks against your prey and explore a majestic open world in this award-winning action RPG.',
        599900, N'Guerrilla', N'PlayStation Publishing LLC', '2020-08-07',
        'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1151640/header.jpg',
        '[]', 4200000, 4.6, 310000, 1, GETUTCDATE(),
        N'Windows 10 64-bits', N'Intel Core i5-2500K or AMD FX-6300', N'8 GB RAM', N'NVIDIA GeForce GTX 780 3GB or AMD Radeon R9 290 4GB', N'100 GB available space', '');

    -- Days Gone (AppID: 1259420)
    INSERT INTO Games (Id, Title, Description, Price, Developer, Publisher, ReleaseDate,
        CoverImageUrl, Screenshots, TotalSales, Rating, RatingCount, IsActive, CreatedAt,
        MinimumOS, MinimumProcessor, MinimumMemory, MinimumGraphics, MinimumStorage, TrailerUrl)
    VALUES (33,
        N'Days Gone',
        N'Ride and fight into a deadly, post pandemic America. Play as Deacon St. John, a drifter and bounty hunter who rides the broken road, fighting to survive while searching for a reason to live in this open-world action-adventure.',
        399900, N'Bend Studio', N'PlayStation Publishing LLC', '2021-05-17',
        'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1259420/header.jpg',
        '[]', 3800000, 4.4, 280000, 1, GETUTCDATE(),
        N'Windows 10 64-bits', N'Intel Core i5-2500K or AMD FX-8320', N'8 GB RAM', N'NVIDIA GeForce GTX 780 or AMD Radeon R9 290 (4GB VRAM)', N'70 GB available space', '');

    SET IDENTITY_INSERT Games OFF;
GO

-- ============================================================================
-- 3. GAME GENRES (mapping game ↔ thể loại)
-- ============================================================================
SET IDENTITY_INSERT GameGenres ON;
    INSERT INTO GameGenres (Id, GameId, GenreId) VALUES
    -- GTA V
    (16, 5, 1), (17, 5, 7), (18, 5, 12), (19, 5, 30), (20, 5, 31),
    -- ELDEN RING
    (21, 6, 1), (22, 6, 2), (23, 6, 12), (24, 6, 30),
    -- Cyberpunk 2077
    (25, 7, 1), (26, 7, 2), (27, 7, 7), (28, 7, 12), (29, 7, 35),
    -- Baldur's Gate 3
    (30, 8, 2), (31, 8, 3), (32, 8, 7), (33, 8, 18), (34, 8, 29), (35, 8, 35),
    -- Red Dead Redemption 2
    (36, 9, 1), (37, 9, 7), (38, 9, 12), (39, 9, 30), (40, 9, 35),
    -- The Witcher 3
    (41, 10, 1), (42, 10, 2), (43, 10, 7), (44, 10, 12), (45, 10, 30),
    -- Monster Hunter: World
    (46, 11, 1), (47, 11, 2), (48, 11, 29), (49, 11, 31),
    -- Stardew Valley
    (50, 12, 2), (51, 12, 5), (52, 12, 8), (53, 12, 33),
    -- Terraria
    (54, 13, 1), (55, 13, 5), (56, 13, 7), (57, 13, 20), (58, 13, 29),
    -- Left 4 Dead 2
    (59, 14, 1), (60, 14, 6), (61, 14, 10), (62, 14, 29), (63, 14, 31),
    -- Garry's Mod
    (64, 15, 5), (65, 15, 8), (66, 15, 20), (67, 15, 31), (68, 15, 33),
    -- Among Us
    (69, 16, 31), (70, 16, 33), (71, 16, 34),
    -- Phasmophobia
    (72, 17, 1), (73, 17, 5), (74, 17, 10), (75, 17, 29), (76, 17, 31),
    -- Valheim
    (77, 18, 1), (78, 18, 5), (79, 18, 7), (80, 18, 11), (81, 18, 29),
    -- Rust
    (82, 19, 1), (83, 19, 5), (84, 19, 7), (85, 19, 11), (86, 19, 31),
    -- ARK: Survival Evolved
    (87, 20, 1), (88, 20, 5), (89, 20, 7), (90, 20, 11), (91, 20, 31),
    -- Hogwarts Legacy
    (92, 21, 1), (93, 21, 2), (94, 21, 7), (95, 21, 12), (96, 21, 30),
    -- Civilization VI
    (97, 22, 3), (98, 22, 18), (99, 22, 30), (100, 22, 31),
    -- Euro Truck Simulator 2
    (101, 23, 5), (102, 23, 8), (103, 23, 33),
    -- Fallout 4
    (111, 26, 1), (112, 26, 2), (113, 26, 12), (114, 26, 30),
    -- Skyrim SE
    (115, 27, 1), (116, 27, 2), (117, 27, 12), (118, 27, 30),
    -- Dark Souls III
    (119, 28, 1), (120, 28, 2), (121, 28, 30), (122, 28, 31),
    -- Sekiro
    (123, 29, 1), (124, 29, 7), (125, 29, 30),
    -- God of War
    (126, 30, 1), (127, 30, 2), (128, 30, 7), (129, 30, 35),
    -- Spider-Man
    (130, 31, 1), (131, 31, 7), (132, 31, 12), (133, 31, 30),
    -- Horizon Zero Dawn
    (134, 32, 1), (135, 32, 2), (136, 32, 7), (137, 32, 12), (138, 32, 30),
    -- Days Gone
    (139, 33, 1), (140, 33, 7), (141, 33, 10), (142, 33, 12), (143, 33, 30);
    SET IDENTITY_INSERT GameGenres OFF;
GO

-- ============================================================================
-- 4. GAME KEYS (2-3 key cho mỗi game)
-- ============================================================================
SET IDENTITY_INSERT GameKeys ON;
    INSERT INTO GameKeys (Id, GameId, KeyCode, IsUsed, CreatedAt) VALUES
    -- GTA V (game 5, 3 keys)
    (9, 5, N'GTA5-X3B7C-9D1E4-F6G8H', 0, GETUTCDATE()),
    (10, 5, N'GTA5-K2L5M-8N1P4-Q7R9S', 0, GETUTCDATE()),
    (11, 5, N'GTA5-T3V6W-9X1Y2-Z4A5B', 0, GETUTCDATE()),
    -- ELDEN RING (game 6, 3 keys)
    (12, 6, N'ELDEN-7B3C9-D1E5F-2G8H4', 0, GETUTCDATE()),
    (13, 6, N'ELDEN-K6L2M-9N5P1-Q4R7S', 0, GETUTCDATE()),
    (14, 6, N'ELDEN-T8V3W-1X6Y2-Z5A9B', 0, GETUTCDATE()),
    -- Cyberpunk 2077 (game 7, 3 keys)
    (15, 7, N'CP77-5B8C2-D1E6F-3G9H4', 0, GETUTCDATE()),
    (16, 7, N'CP77-K7L3M-1N5P9-Q2R6S', 0, GETUTCDATE()),
    (17, 7, N'CP77-T4V8W-2X5Y1-Z9A3B', 0, GETUTCDATE()),
    -- Baldur's Gate 3 (game 8, 3 keys)
    (18, 8, N'BG3-X4C8D-1E5F9-G2H6J', 0, GETUTCDATE()),
    (19, 8, N'BG3-K3L7M-2N6P1-Q5R9S', 0, GETUTCDATE()),
    (20, 8, N'BG3-T8V4W-1X7Y3-Z6A2B', 0, GETUTCDATE()),
    -- Red Dead Redemption 2 (game 9, 3 keys)
    (21, 9, N'RDR2-6B9C3-D1E7F-2G5H8', 0, GETUTCDATE()),
    (22, 9, N'RDR2-K4L8M-2N6P1-Q9R3S', 0, GETUTCDATE()),
    (23, 9, N'RDR2-T7V2W-9X4Y1-Z5A8B', 0, GETUTCDATE()),
    -- The Witcher 3 (game 10, 3 keys)
    (24, 10, N'W3-8B2C5-D1E9F-3G6H4', 0, GETUTCDATE()),
    (25, 10, N'W3-K7L1M-5N9P2-Q4R8S', 0, GETUTCDATE()),
    (26, 10, N'W3-T3V6W-8X1Y4-Z9A2B', 0, GETUTCDATE()),
    -- Monster Hunter: World (game 11, 3 keys)
    (27, 11, N'MHW-4B7C1-D9E2F-5G8H3', 0, GETUTCDATE()),
    (28, 11, N'MHW-K6L9M-3N1P7-Q5R2S', 0, GETUTCDATE()),
    (29, 11, N'MHW-T2V5W-8X9Y1-Z4A7B', 0, GETUTCDATE()),
    -- Stardew Valley (game 12, 3 keys)
    (30, 12, N'STAR-7B3C8-D1E5F-2G9H4', 0, GETUTCDATE()),
    (31, 12, N'STAR-K6L2M-9N4P1-Q7R3S', 0, GETUTCDATE()),
    (32, 12, N'STAR-T8V1W-5X3Y7-Z2A6B', 0, GETUTCDATE()),
    -- Terraria (game 13, 3 keys)
    (33, 13, N'TERR-3B7C9-D1E4F-6G2H8', 0, GETUTCDATE()),
    (34, 13, N'TERR-K5L1M-8N2P6-Q9R4S', 0, GETUTCDATE()),
    (35, 13, N'TERR-T7V3W-1X5Y9-Z2A6B', 0, GETUTCDATE()),
    -- Left 4 Dead 2 (game 14, 2 keys)
    (36, 14, N'L4D2-6B9C2-D1E7F-3G5H8', 0, GETUTCDATE()),
    (37, 14, N'L4D2-K4L8M-1N6P9-Q2R7S', 0, GETUTCDATE()),
    -- Garry''s Mod (game 15, 2 keys)
    (38, 15, N'GMOD-7B3C9-D2E5F-1G8H4', 0, GETUTCDATE()),
    (39, 15, N'GMOD-K6L2M-9N4P7-Q1R5S', 0, GETUTCDATE()),
    -- Among Us (game 16, 2 keys)
    (40, 16, N'AMNG-4B8C2-D1E6F-9G3H7', 0, GETUTCDATE()),
    (41, 16, N'AMNG-K5L1M-7N3P8-Q2R6S', 0, GETUTCDATE()),
    -- Phasmophobia (game 17, 2 keys)
    (42, 17, N'PHAS-8B2C5-D1E9F-3G6H4', 0, GETUTCDATE()),
    (43, 17, N'PHAS-K7L1M-4N8P2-Q5R9S', 0, GETUTCDATE()),
    -- Valheim (game 18, 2 keys)
    (44, 18, N'VALH-3B7C1-D9E4F-6G2H8', 0, GETUTCDATE()),
    (45, 18, N'VALH-K5L9M-2N6P1-Q8R4S', 0, GETUTCDATE()),
    -- Rust (game 19, 2 keys)
    (46, 19, N'RUST-6B9C3-D1E7F-2G5H8', 0, GETUTCDATE()),
    (47, 19, N'RUST-K4L8M-2N6P1-Q9R3S', 0, GETUTCDATE()),
    -- ARK (game 20, 3 keys)
    (48, 20, N'ARK7-2B5C9-D1E8F-3G6H4', 0, GETUTCDATE()),
    (49, 20, N'ARK7-K7L1M-5N9P2-Q4R8S', 0, GETUTCDATE()),
    (50, 20, N'ARK7-T3V6W-8X1Y4-Z9A2B', 0, GETUTCDATE()),
    -- Hogwarts Legacy (game 21, 3 keys)
    (51, 21, N'HOGW-4B7C1-D9E2F-5G8H3', 0, GETUTCDATE()),
    (52, 21, N'HOGW-K6L9M-3N1P7-Q5R2S', 0, GETUTCDATE()),
    (53, 21, N'HOGW-T2V5W-8X9Y1-Z4A7B', 0, GETUTCDATE()),
    -- Civilization VI (game 22, 3 keys)
    (54, 22, N'CIV6-7B3C8-D1E5F-2G9H4', 0, GETUTCDATE()),
    (55, 22, N'CIV6-K6L2M-9N4P1-Q7R3S', 0, GETUTCDATE()),
    (56, 22, N'CIV6-T8V1W-5X3Y7-Z2A6B', 0, GETUTCDATE()),
    -- Euro Truck Simulator 2 (game 23, 2 keys)
    (57, 23, N'ETS2-3B7C9-D1E4F-6G2H8', 0, GETUTCDATE()),
    (58, 23, N'ETS2-K5L1M-8N2P6-Q9R4S', 0, GETUTCDATE()),
    -- Fallout 4 (game 26, 3 keys)
    (63, 26, N'FO4-4B8C2-D1E6F-9G3H7', 0, GETUTCDATE()),
    (64, 26, N'FO4-K5L1M-7N3P8-Q2R6S', 0, GETUTCDATE()),
    (65, 26, N'FO4-T9V2W-4X7Y1-Z5A8B', 0, GETUTCDATE()),
    -- Skyrim SE (game 27, 3 keys)
    (66, 27, N'SKYR-8B2C5-D1E9F-3G6H4', 0, GETUTCDATE()),
    (67, 27, N'SKYR-K7L1M-4N8P2-Q5R9S', 0, GETUTCDATE()),
    (68, 27, N'SKYR-T3V6W-8X1Y4-Z9A2B', 0, GETUTCDATE()),
    -- Dark Souls III (game 28, 3 keys)
    (69, 28, N'DS3-3B7C1-D9E4F-6G2H8', 0, GETUTCDATE()),
    (70, 28, N'DS3-K5L9M-2N6P1-Q8R4S', 0, GETUTCDATE()),
    (71, 28, N'DS3-T1V4W-7X2Y5-Z9A3B', 0, GETUTCDATE()),
    -- Sekiro (game 29, 3 keys)
    (72, 29, N'SEKI-6B9C3-D1E7F-2G5H8', 0, GETUTCDATE()),
    (73, 29, N'SEKI-K4L8M-2N6P1-Q9R3S', 0, GETUTCDATE()),
    (74, 29, N'SEKI-T7V2W-9X4Y1-Z5A8B', 0, GETUTCDATE()),
    -- God of War (game 30, 3 keys)
    (75, 30, N'GOW-2B5C9-D1E8F-3G6H4', 0, GETUTCDATE()),
    (76, 30, N'GOW-K7L1M-5N9P2-Q4R8S', 0, GETUTCDATE()),
    (77, 30, N'GOW-T3V6W-8X1Y4-Z9A2B', 0, GETUTCDATE()),
    -- Spider-Man (game 31, 3 keys)
    (78, 31, N'SPDR-4B7C1-D9E2F-5G8H3', 0, GETUTCDATE()),
    (79, 31, N'SPDR-K6L9M-3N1P7-Q5R2S', 0, GETUTCDATE()),
    (80, 31, N'SPDR-T2V5W-8X9Y1-Z4A7B', 0, GETUTCDATE()),
    -- Horizon Zero Dawn (game 32, 3 keys)
    (81, 32, N'HZD-7B3C8-D1E5F-2G9H4', 0, GETUTCDATE()),
    (82, 32, N'HZD-K6L2M-9N4P1-Q7R3S', 0, GETUTCDATE()),
    (83, 32, N'HZD-T8V1W-5X3Y7-Z2A6B', 0, GETUTCDATE()),
    -- Days Gone (game 33, 3 keys)
    (84, 33, N'DAYS-3B7C9-D1E4F-6G2H8', 0, GETUTCDATE()),
    (85, 33, N'DAYS-K5L1M-8N2P6-Q9R4S', 0, GETUTCDATE()),
    (86, 33, N'DAYS-T7V3W-1X5Y9-Z2A6B', 0, GETUTCDATE());
    SET IDENTITY_INSERT GameKeys OFF;
GO

-- ============================================================================
-- 5. ADDITIONAL GAMES (IDs 49-68: 19 real Steam games, excluding free Warframe)
-- ============================================================================
SET IDENTITY_INSERT Games ON;
    INSERT INTO Games (Id, Title, Description, Price, Developer, Publisher, ReleaseDate,
        CoverImageUrl, Screenshots, TotalSales, Rating, RatingCount, IsActive, CreatedAt,
        MinimumOS, MinimumProcessor, MinimumMemory, MinimumGraphics, MinimumStorage, TrailerUrl)
    VALUES
    -- RimWorld (AppID: 294100)
    (49, N'RimWorld',
        N'A sci-fi colony sim driven by an intelligent AI storyteller. Inspired by Dwarf Fortress, Firefly, and Dune. You''re a group of survivors who have crash-landed on a distant world. Build a colony, manage your colonists'' needs and moods, and survive against pirates, raiders, and ancient horrors.',
        699900, N'Ludeon Studios', N'Ludeon Studios', '2018-10-17',
        'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/294100/header.jpg',
        '[]', 8500000, 4.8, 310000, 1, GETUTCDATE(),
        N'Windows 7 or later', N'Intel Core i5 or AMD equivalent', N'6 GB RAM', N'NVIDIA GeForce GTX 560 or AMD Radeon HD 7770', N'3 GB available space', ''),

    -- Factorio (AppID: 427520)
    (50, N'Factorio',
        N'Factorio is a game about building and creating automated factories to produce items of increasing complexity, within an infinite 2D world. Use your imagination to design your factory, combine simple elements into ingenious structures, and finally protect it from the creatures who don''t really like you.',
        699900, N'Wube Software', N'Wube Software', '2020-08-14',
        'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/427520/header.jpg',
        '[]', 6000000, 4.9, 230000, 1, GETUTCDATE(),
        N'Windows 7 or later', N'Intel Core i3-2100 or AMD FX-4350', N'4 GB RAM', N'NVIDIA GeForce GTX 460 or AMD Radeon HD 5770', N'3 GB available space', ''),

    -- Hades (AppID: 1145360)
    (51, N'Hades',
        N'Defy the god of the dead as you hack and slash your way out of the Underworld in this rogue-like dungeon crawler from the creators of Bastion, Transistor, and Pyre. The Olympians have your back! Meet gods, goddesses, and more as you fight to escape the domain of your tyrannical father.',
        399900, N'Supergiant Games', N'Supergiant Games', '2020-09-17',
        'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1145360/header.jpg',
        '[]', 5000000, 4.8, 350000, 1, GETUTCDATE(),
        N'Windows 7 SP1 or later', N'Intel Core i5-2300 or AMD FX-6300', N'4 GB RAM', N'NVIDIA GeForce GTX 660 or AMD Radeon HD 7870', N'15 GB available space', ''),

    -- Hollow Knight (AppID: 367520)
    (52, N'Hollow Knight',
        N'Forge your own path in an epic action-adventure through a vast ruined kingdom of insects and heroes. Explore twisting caverns, battle foul creatures, and befriend bizarre bugs in this critically acclaimed 2D action-adventure. A sprawling hand-drawn world awaits.',
        299900, N'Team Cherry', N'Team Cherry', '2017-02-24',
        'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/367520/header.jpg',
        '[]', 9000000, 4.8, 280000, 1, GETUTCDATE(),
        N'Windows 7 or later', N'Intel Core i3 or AMD equivalent', N'4 GB RAM', N'NVIDIA GeForce GTX 460 or AMD Radeon HD 5770', N'9 GB available space', ''),

    -- Dead Cells (AppID: 588650)
    (53, N'Dead Cells',
        N'Dead Cells is a rogue-lite, Castlevania-inspired action-platformer. Explore a sprawling, ever-changing castle... assuming you''re able to fight your way past its keepers. Master 2D combat with a wide variety of weapons and abilities, and experience frantic, challenging combat.',
        499900, N'Motion Twin', N'Motion Twin', '2018-08-07',
        'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/588650/header.jpg',
        '[]', 7000000, 4.7, 190000, 1, GETUTCDATE(),
        N'Windows 7 or later', N'Intel Core i5 or AMD equivalent', N'2 GB RAM', N'NVIDIA GeForce GTX 460 or AMD Radeon HD 5770', N'2 GB available space', ''),

    -- Slay the Spire (AppID: 646570)
    (54, N'Slay the Spire',
        N'We fused card games and roguelikes together to make the best single-player deckbuilder we could. Craft a unique deck, encounter bizarre creatures, discover relics of immense power, and Slay the Spire! A critically acclaimed genre-defining roguelike deck-building game.',
        399900, N'MegaCrit', N'MegaCrit', '2019-01-23',
        'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/646570/header.jpg',
        '[]', 8500000, 4.8, 250000, 1, GETUTCDATE(),
        N'Windows 7 or later', N'2.0 GHz processor', N'4 GB RAM', N'DirectX 10 compatible GPU', N'2 GB available space', ''),

    -- Deep Rock Galactic (AppID: 548430)
    (55, N'Deep Rock Galactic',
        N'Deep Rock Galactic is a 1-4 player co-op first-person sci-fi shooter featuring massive procedurally generated caves, swarms of alien bugs, and tons of explosives. Join the most awesome dwarf space mining company in the galaxy and explore the depths of Hoxxes IV!',
        599900, N'Ghost Ship Games', N'Coffee Stain Publishing', '2020-05-13',
        'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/548430/header.jpg',
        '[]', 12000000, 4.8, 320000, 1, GETUTCDATE(),
        N'Windows 10 64-bit', N'Intel Core i5-4670 or AMD Ryzen 3 1200', N'8 GB RAM', N'NVIDIA GeForce GTX 960 or AMD Radeon R9 380', N'10 GB available space', ''),

    -- Subnautica (AppID: 264710)
    (56, N'Subnautica',
        N'Descend into the depths of an alien underwater world filled with wonder and peril. Craft equipment, pilot submarines, and outsmart wildlife to explore lush coral reefs, volcanoes, cave systems, and more - all while trying to survive. A landmark open-world underwater adventure.',
        599900, N'Unknown Worlds Entertainment', N'Unknown Worlds Entertainment', '2018-01-23',
        'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/264710/header.jpg',
        '[]', 15000000, 4.7, 380000, 1, GETUTCDATE(),
        N'Windows 7 64-bit', N'Intel Core i5-2300 or AMD FX-4350', N'8 GB RAM', N'NVIDIA GeForce GTX 550 Ti or AMD Radeon HD 6770', N'20 GB available space', ''),

    -- Cult of the Lamb (AppID: 1313140)
    (57, N'Cult of the Lamb',
        N'Start your own cult in a land of false prophets, venturing out into diverse and mysterious regions to build a loyal community of woodland worshipers. Spread your word to become the one true cult. A darkly charming rogue-like action-adventure game.',
        399900, N'Massive Monster', N'Devolver Digital', '2022-08-11',
        'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1313140/header.jpg',
        '[]', 4500000, 4.7, 180000, 1, GETUTCDATE(),
        N'Windows 10 64-bit', N'Intel Core i3-2100 or AMD Phenom II X4', N'4 GB RAM', N'NVIDIA GeForce GTX 460 or AMD Radeon HD 6850', N'4 GB available space', ''),

    -- Vampire Survivors (AppID: 1794680)
    (58, N'Vampire Survivors',
        N'Vampire Survivors is a gothic horror casual game with rogue-lite elements, where your choices can allow you to quickly snowball against the hundreds of monsters that get on your way. Hell is empty, the devils are all here. A time survival game with minimalistic gameplay.',
        99900, N'poncle', N'poncle', '2022-10-20',
        'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1794680/header.jpg',
        '[]', 25000000, 4.8, 450000, 1, GETUTCDATE(),
        N'Windows 7 or later', N'2.0 GHz processor', N'1 GB RAM', N'DirectX 9 compatible GPU', N'500 MB available space', ''),

    -- Stray (AppID: 1332010)
    (59, N'Stray',
        N'Lost, alone and separated from your family, a stray cat must untangle an ancient mystery to escape a long-forgotten cybercity and find their way home. Explore a neon-lit cyberpunk world from a feline perspective. A unique third-person cat adventure.',
        599900, N'BlueTwelve Studio', N'Annapurna Interactive', '2022-07-19',
        'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1332010/header.jpg',
        '[]', 3500000, 4.7, 220000, 1, GETUTCDATE(),
        N'Windows 10 64-bit', N'Intel Core i5-2300 or AMD FX-4350', N'8 GB RAM', N'NVIDIA GeForce GTX 650 or AMD Radeon HD 7750', N'10 GB available space', ''),

    -- Dave the Diver (AppID: 1868140)
    (60, N'Dave the Diver',
        N'Dave the Diver is a casual, single-player adventure RPG with deep-sea exploration and sushi restaurant management in the day. Explore the mysterious Blue Hole with your equipment, catch fish during the day, and serve sushi at night. A charming blend of genres.',
        399900, N'MINTROCKET', N'MINTROCKET', '2023-06-28',
        'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1868140/header.jpg',
        '[]', 2800000, 4.7, 150000, 1, GETUTCDATE(),
        N'Windows 10 64-bit', N'Intel Core i5-2300 or AMD FX-4350', N'8 GB RAM', N'NVIDIA GeForce GTX 660 or AMD Radeon HD 7850', N'10 GB available space', ''),

    -- Helldivers 2 (AppID: 553850)
    (61, N'Helldivers 2',
        N'The Galaxy''s last line of offense. Enlist in the Helldivers and fight for freedom across a hostile galaxy in this fast-paced, third-person squad-based shooter. Join forces with up to four friends to blast through alien threats in the name of Super Earth! Managed democracy awaits.',
        799900, N'Arrowhead Game Studios', N'PlayStation PC LLC', '2024-02-08',
        'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/553850/header.jpg',
        '[]', 3800000, 4.5, 420000, 1, GETUTCDATE(),
        N'Windows 10 64-bit', N'Intel Core i5-8600 or AMD Ryzen 5 2600', N'16 GB RAM', N'NVIDIA GeForce GTX 1060 or AMD Radeon RX 580', N'40 GB available space', ''),

    -- Lies of P (AppID: 1627720)
    (62, N'Lies of P',
        N'Lies of P is a thrilling action RPG inspired by the story of Pinocchio. You must adapt yourself and your weapons to face untold horrors, unravel the secrets of the city of Krat, and choose your own truth in a dark Belle Époque world. A masterful soulslike experience.',
        1199000, N'NEOWIZ', N'NEOWIZ', '2023-09-18',
        'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1627720/header.jpg',
        '[]', 2500000, 4.6, 160000, 1, GETUTCDATE(),
        N'Windows 10 64-bit', N'Intel Core i5-8400 or AMD Ryzen 3 3300X', N'16 GB RAM', N'NVIDIA GeForce GTX 1060 or AMD Radeon RX 580', N'50 GB available space', ''),

    -- Resident Evil 4 (AppID: 2050650)
    (63, N'Resident Evil 4',
        N'Survival is just the beginning. Six years have passed since the biological disaster in Raccoon City. Leon S. Kennedy, now a government agent, is sent to rescue the president''s kidnapped daughter. A masterful reimagining of a genre-defining survival horror classic.',
        799900, N'CAPCOM Co., Ltd.', N'CAPCOM Co., Ltd.', '2023-03-24',
        'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2050650/header.jpg',
        '[]', 5200000, 4.8, 290000, 1, GETUTCDATE(),
        N'Windows 10 64-bit', N'Intel Core i5-7500 or AMD Ryzen 3 1200', N'8 GB RAM', N'NVIDIA GeForce GTX 1050 Ti or AMD Radeon RX 560', N'70 GB available space', ''),

    -- Armored Core VI: Fires of Rubicon (AppID: 1888160)
    (64, N'ARMORED CORE VI FIRES OF RUBICON',
        N'A new action game from the creators of Dark Souls and Elden Ring. FromSoftware''s iconic mech series returns with a new story set on a remote planet where a mysterious substance promises to reshape the world. Assemble and pilot your own mech in high-speed battles.',
        1199000, N'FromSoftware, Inc.', N'Bandai Namco Entertainment', '2023-08-25',
        'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1888160/header.jpg',
        '[]', 3200000, 4.6, 140000, 1, GETUTCDATE(),
        N'Windows 10 64-bit', N'Intel Core i5-8400 or AMD Ryzen 5 2600', N'12 GB RAM', N'NVIDIA GeForce GTX 1060 or AMD Radeon RX 590', N'60 GB available space', ''),

    -- Don''t Starve Together (AppID: 322330)
    (66, N'Don''t Starve Together',
        N'Don''t Starve Together is the standalone multiplayer expansion of the uncompromising wilderness survival game. Enter a strange and unexplored world full of strange creatures, dangers, and surprises. Gather resources to craft items and structures that help you survive as long as possible.',
        299900, N'Klei Entertainment', N'Klei Entertainment', '2016-04-21',
        'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/322330/header.jpg',
        '[]', 18000000, 4.7, 310000, 1, GETUTCDATE(),
        N'Windows 7 or later', N'Intel Core i3 or AMD equivalent', N'4 GB RAM', N'NVIDIA GeForce GTX 460 or AMD Radeon HD 5770', N'3 GB available space', ''),

    -- Hearts of Iron IV (AppID: 394360)
    (67, N'Hearts of Iron IV',
        N'Hearts of Iron IV is a grand strategy wargame where you can take control of any nation in World War II. Write your own alternate history and guide your country through the most challenging period in human history. Manage industry, research, diplomacy, and military operations.',
        999900, N'Paradox Development Studio', N'Paradox Interactive', '2016-06-06',
        'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/394360/header.jpg',
        '[]', 15000000, 4.6, 250000, 1, GETUTCDATE(),
        N'Windows 7 64-bit', N'Intel Core i5-750 or AMD Phenom II X4 955', N'4 GB RAM', N'NVIDIA GeForce GTX 470 or AMD Radeon HD 5850', N'2 GB available space', ''),

    -- Sons of the Forest (AppID: 1326470)
    (68, N'Sons of the Forest',
        N'Sent to find a missing billionaire on a remote island, you find yourself in a cannibal-infested hellscape. Craft, build, and struggle to survive in this terrifying open-world survival horror simulator. A harrowing experience of survival, horror, and exploration.',
        599900, N'Endnight Games', N'Endnight Games', '2024-02-22',
        'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1326470/header.jpg',
        '[]', 5500000, 4.6, 230000, 1, GETUTCDATE(),
        N'Windows 10 64-bit', N'Intel Core i5-8400 or AMD Ryzen 3 3300X', N'12 GB RAM', N'NVIDIA GeForce GTX 1060 or AMD Radeon RX 580', N'20 GB available space', '');
    SET IDENTITY_INSERT Games OFF;
GO

-- ============================================================================
-- 6. ADDITIONAL GAME GENRES (for games 49-68, excluding Warframe 65)
-- ============================================================================
SET IDENTITY_INSERT GameGenres ON;
    INSERT INTO GameGenres (Id, GameId, GenreId) VALUES
    -- RimWorld (49)
    (144, 49, 5), (145, 49, 8), (146, 49, 3), (147, 49, 20), (148, 49, 30),
    -- Factorio (50)
    (149, 50, 5), (150, 50, 8), (151, 50, 3), (152, 50, 20), (153, 50, 30),
    -- Hades (51)
    (154, 51, 1), (155, 51, 5), (156, 51, 2), (157, 51, 25), (158, 51, 35),
    -- Hollow Knight (52)
    (159, 52, 1), (160, 52, 7), (161, 52, 5), (162, 52, 24), (163, 52, 30),
    -- Dead Cells (53)
    (164, 53, 1), (165, 53, 5), (166, 53, 23), (167, 53, 25), (168, 53, 26),
    -- Slay the Spire (54)
    (169, 54, 5), (170, 54, 3), (171, 54, 17), (172, 54, 25), (173, 54, 30),
    -- Deep Rock Galactic (55)
    (174, 55, 1), (175, 55, 6), (176, 55, 5), (177, 55, 29), (178, 55, 31),
    -- Subnautica (56)
    (179, 56, 7), (180, 56, 5), (181, 56, 8), (182, 56, 11), (183, 56, 12),
    -- Cult of the Lamb (57)
    (184, 57, 1), (185, 57, 7), (186, 57, 5), (187, 57, 8), (188, 57, 30),
    -- Vampire Survivors (58)
    (189, 58, 5), (190, 58, 33), (191, 58, 25), (192, 58, 26),
    -- Stray (59)
    (193, 59, 7), (194, 59, 5), (195, 59, 9), (196, 59, 30),
    -- Dave the Diver (60)
    (197, 60, 7), (198, 60, 5), (199, 60, 8), (200, 60, 33),
    -- Helldivers 2 (61)
    (201, 61, 1), (202, 61, 6), (203, 61, 29), (204, 61, 31),
    -- Lies of P (62)
    (205, 62, 1), (206, 62, 2), (207, 62, 7), (208, 62, 30),
    -- Resident Evil 4 (63)
    (209, 63, 1), (210, 63, 7), (211, 63, 10), (212, 63, 30),
    -- Armored Core VI (64)
    (213, 64, 1), (214, 64, 8), (215, 64, 30), (216, 64, 31),
    -- Don''t Starve Together (66)
    (222, 66, 5), (223, 66, 7), (224, 66, 8), (225, 66, 11), (226, 66, 29),
    -- Hearts of Iron IV (67)
    (227, 67, 3), (228, 67, 8), (229, 67, 30), (230, 67, 31),
    -- Sons of the Forest (68)
    (231, 68, 1), (232, 68, 7), (233, 68, 10), (234, 68, 11), (235, 68, 29);
    SET IDENTITY_INSERT GameGenres OFF;
GO

-- ============================================================================
-- 7. GAME KEYS FOR NEW GAMES (2 keys mỗi game, for paid games 49-68)
-- ============================================================================
SET IDENTITY_INSERT GameKeys ON;
    INSERT INTO GameKeys (Id, GameId, KeyCode, IsUsed, CreatedAt) VALUES
    -- RimWorld (49)
    (87, 49, N'RIMW-X7B3C-9D1E5-F2G8H4', 0, GETUTCDATE()),
    (88, 49, N'RIMW-K6L2M-9N4P1-Q7R3S', 0, GETUTCDATE()),
    -- Factorio (50)
    (89, 50, N'FACT-3B7C9-D1E4F-6G2H8', 0, GETUTCDATE()),
    (90, 50, N'FACT-K5L1M-8N2P6-Q9R4S', 0, GETUTCDATE()),
    -- Hades (51)
    (91, 51, N'HADE-6B9C2-D1E7F-3G5H8', 0, GETUTCDATE()),
    (92, 51, N'HADE-K4L8M-1N6P9-Q2R7S', 0, GETUTCDATE()),
    -- Hollow Knight (52)
    (93, 52, N'HLKN-7B3C9-D2E5F-1G8H4', 0, GETUTCDATE()),
    (94, 52, N'HLKN-K6L2M-9N4P7-Q1R5S', 0, GETUTCDATE()),
    -- Dead Cells (53)
    (95, 53, N'DCELL-4B8C2-D1E6F-9G3H7', 0, GETUTCDATE()),
    (96, 53, N'DCELL-K5L1M-7N3P8-Q2R6S', 0, GETUTCDATE()),
    -- Slay the Spire (54)
    (97, 54, N'SPIRE-8B2C5-D1E9F-3G6H4', 0, GETUTCDATE()),
    (98, 54, N'SPIRE-K7L1M-4N8P2-Q5R9S', 0, GETUTCDATE()),
    -- Deep Rock Galactic (55)
    (99, 55, N'DRG-3B7C1-D9E4F-6G2H8', 0, GETUTCDATE()),
    (100, 55, N'DRG-K5L9M-2N6P1-Q8R4S', 0, GETUTCDATE()),
    -- Subnautica (56)
    (101, 56, N'SUBNA-6B9C3-D1E7F-2G5H8', 0, GETUTCDATE()),
    (102, 56, N'SUBNA-K4L8M-2N6P1-Q9R3S', 0, GETUTCDATE()),
    -- Cult of the Lamb (57)
    (103, 57, N'CULT-2B5C9-D1E8F-3G6H4', 0, GETUTCDATE()),
    (104, 57, N'CULT-K7L1M-5N9P2-Q4R8S', 0, GETUTCDATE()),
    -- Vampire Survivors (58)
    (105, 58, N'VAMP-4B7C1-D9E2F-5G8H3', 0, GETUTCDATE()),
    (106, 58, N'VAMP-K6L9M-3N1P7-Q5R2S', 0, GETUTCDATE()),
    -- Stray (59)
    (107, 59, N'STRAY-7B3C8-D1E5F-2G9H4', 0, GETUTCDATE()),
    (108, 59, N'STRAY-K6L2M-9N4P1-Q7R3S', 0, GETUTCDATE()),
    -- Dave the Diver (60)
    (109, 60, N'DAVE-3B7C9-D1E4F-6G2H8', 0, GETUTCDATE()),
    (110, 60, N'DAVE-K5L1M-8N2P6-Q9R4S', 0, GETUTCDATE()),
    -- Helldivers 2 (61)
    (111, 61, N'HLLDV-6B9C2-D1E7F-3G5H8', 0, GETUTCDATE()),
    (112, 61, N'HLLDV-K4L8M-1N6P9-Q2R7S', 0, GETUTCDATE()),
    -- Lies of P (62)
    (113, 62, N'LIESP-7B3C9-D2E5F-1G8H4', 0, GETUTCDATE()),
    (114, 62, N'LIESP-K6L2M-9N4P7-Q1R5S', 0, GETUTCDATE()),
    -- Resident Evil 4 (63)
    (115, 63, N'RE4-4B8C2-D1E6F-9G3H7', 0, GETUTCDATE()),
    (116, 63, N'RE4-K5L1M-7N3P8-Q2R6S', 0, GETUTCDATE()),
    -- Armored Core VI (64)
    (117, 64, N'ACVI-8B2C5-D1E9F-3G6H4', 0, GETUTCDATE()),
    (118, 64, N'ACVI-K7L1M-4N8P2-Q5R9S', 0, GETUTCDATE()),
    -- Don''t Starve Together (66)
    (119, 66, N'DST-6B9C3-D1E7F-2G5H8', 0, GETUTCDATE()),
    (120, 66, N'DST-K4L8M-2N6P1-Q9R3S', 0, GETUTCDATE()),
    -- Hearts of Iron IV (67)
    (121, 67, N'HOI4-2B5C9-D1E8F-3G6H4', 0, GETUTCDATE()),
    (122, 67, N'HOI4-K7L1M-5N9P2-Q4R8S', 0, GETUTCDATE()),
    -- Sons of the Forest (68)
    (123, 68, N'SOTF-4B7C1-D9E2F-5G8H3', 0, GETUTCDATE()),
    (124, 68, N'SOTF-K6L9M-3N1P7-Q5R2S', 0, GETUTCDATE());
    SET IDENTITY_INSERT GameKeys OFF;
GO

-- ============================================================================
-- 8. DISCOUNT PRICES (cho ~30 game để store sinh động)
-- ============================================================================
-- Discount prices (always apply after cleanup)
    UPDATE Games SET DiscountPrice = 179900 WHERE Id = 5;    -- GTA V: 299900 → -40%
    UPDATE Games SET DiscountPrice = 899900 WHERE Id = 6;    -- ELDEN RING: 1199000 → -25%
    UPDATE Games SET DiscountPrice = 799900 WHERE Id = 7;    -- Cyberpunk 2077: 1199000 → -33%
    UPDATE Games SET DiscountPrice = 899900 WHERE Id = 8;    -- Baldur''s Gate 3: 1199000 → -25%
    UPDATE Games SET DiscountPrice = 799900 WHERE Id = 9;    -- RDR2: 1199000 → -33%
    UPDATE Games SET DiscountPrice = 399900 WHERE Id = 10;   -- The Witcher 3: 799900 → -50%
    UPDATE Games SET DiscountPrice = 299900 WHERE Id = 11;   -- MH: World: 599900 → -50%
    UPDATE Games SET DiscountPrice = 49900  WHERE Id = 13;   -- Terraria: 99900 → -50%
    UPDATE Games SET DiscountPrice = 49900  WHERE Id = 14;   -- L4D2: 99900 → -50%
    UPDATE Games SET DiscountPrice = 99900  WHERE Id = 17;   -- Phasmophobia: 199900 → -50%
    UPDATE Games SET DiscountPrice = 279900 WHERE Id = 18;   -- Valheim: 399900 → -30%
    UPDATE Games SET DiscountPrice = 799900 WHERE Id = 21;   -- Hogwarts Legacy: 1199000 → -33%
    UPDATE Games SET DiscountPrice = 499900 WHERE Id = 22;   -- Civ VI: 1199000 → -58%
    UPDATE Games SET DiscountPrice = 199900 WHERE Id = 26;   -- Fallout 4: 399900 → -50%
    UPDATE Games SET DiscountPrice = 199900 WHERE Id = 27;   -- Skyrim SE: 399900 → -50%
    UPDATE Games SET DiscountPrice = 599900 WHERE Id = 28;   -- Dark Souls III: 1199000 → -50%
    UPDATE Games SET DiscountPrice = 599900 WHERE Id = 29;   -- Sekiro: 1199000 → -50%
    UPDATE Games SET DiscountPrice = 699900 WHERE Id = 30;   -- God of War: 999000 → -30%
    UPDATE Games SET DiscountPrice = 799900 WHERE Id = 31;   -- Spider-Man: 1199000 → -33%
    UPDATE Games SET DiscountPrice = 299900 WHERE Id = 32;   -- Horizon ZD: 599900 → -50%
    UPDATE Games SET DiscountPrice = 199900 WHERE Id = 33;   -- Days Gone: 399900 → -50%
    -- New games (49-68)
    UPDATE Games SET DiscountPrice = 499900 WHERE Id = 49;   -- RimWorld: 699900 → -29%
    UPDATE Games SET DiscountPrice = 199900 WHERE Id = 51;   -- Hades: 399900 → -50%
    UPDATE Games SET DiscountPrice = 149900 WHERE Id = 52;   -- Hollow Knight: 299900 → -50%
    UPDATE Games SET DiscountPrice = 249900 WHERE Id = 53;   -- Dead Cells: 499900 → -50%
    UPDATE Games SET DiscountPrice = 399900 WHERE Id = 55;   -- Deep Rock: 599900 → -33%
    UPDATE Games SET DiscountPrice = 299900 WHERE Id = 56;   -- Subnautica: 599900 → -50%
    UPDATE Games SET DiscountPrice = 279900 WHERE Id = 57;   -- Cult of the Lamb: 399900 → -30%
    UPDATE Games SET DiscountPrice = 399900 WHERE Id = 59;   -- Stray: 599900 → -33%
    UPDATE Games SET DiscountPrice = 279900 WHERE Id = 60;   -- Dave the Diver: 399900 → -30%
    UPDATE Games SET DiscountPrice = 599900 WHERE Id = 61;   -- Helldivers 2: 799900 → -25%
    UPDATE Games SET DiscountPrice = 799900 WHERE Id = 62;   -- Lies of P: 1199000 → -33%
    UPDATE Games SET DiscountPrice = 599900 WHERE Id = 63;   -- RE4: 799900 → -25%
    UPDATE Games SET DiscountPrice = 799900 WHERE Id = 64;   -- AC VI: 1199000 → -33%
    UPDATE Games SET DiscountPrice = 699900 WHERE Id = 67;   -- HoI IV: 999900 → -30%
    UPDATE Games SET DiscountPrice = 399900 WHERE Id = 68;   -- Sons of Forest: 599900 → -33%
GO

-- ============================================================================
-- 9. EXTRA GAME KEYS (thêm 1 key cho 9 game cũ để mỗi game có 3 keys)
-- ============================================================================
SET IDENTITY_INSERT GameKeys ON;
    INSERT INTO GameKeys (Id, GameId, KeyCode, IsUsed, CreatedAt) VALUES
    -- Left 4 Dead 2 (14)
    (125, 14, N'L4D2-5B8C1-D3E9F-7G2H6', 0, GETUTCDATE()),
    -- Garry''s Mod (15)
    (126, 15, N'GMOD-2K7L3-M9N5P-1Q4R8', 0, GETUTCDATE()),
    -- Among Us (16)
    (127, 16, N'AMNG-8B1C4-D6E2F-9G5H3', 0, GETUTCDATE()),
    -- Phasmophobia (17)
    (128, 17, N'PHAS-3K8L2-M6N1P-9Q4R7', 0, GETUTCDATE()),
    -- Valheim (18)
    (129, 18, N'VALH-7B2C5-D9E1F-4G8H3', 0, GETUTCDATE()),
    -- Rust (19)
    (130, 19, N'RUST-5K9L3-M1N7P-2Q6R8', 0, GETUTCDATE()),
    -- Euro Truck Simulator 2 (23)
    (131, 23, N'ETS2-4B8C1-D6E3F-9G2H7', 0, GETUTCDATE());
    SET IDENTITY_INSERT GameKeys OFF;
GO

-- ============================================================================
-- 10. SCREENSHOTS URLs (4 screenshots Steam CDN mỗi game, only paid games)
-- ============================================================================
    -- GTA V (271590)
    UPDATE Games SET Screenshots = '["https://cdn.cloudflare.steamstatic.com/steam/apps/271590/ss_1.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/271590/ss_2.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/271590/ss_3.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/271590/ss_4.jpg"]'
    WHERE Id = 5;
    -- ELDEN RING (1245620)
    UPDATE Games SET Screenshots = '["https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/ss_1.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/ss_2.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/ss_3.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/ss_4.jpg"]'
    WHERE Id = 6;
    -- Cyberpunk 2077 (1091500)
    UPDATE Games SET Screenshots = '["https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/ss_1.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/ss_2.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/ss_3.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/ss_4.jpg"]'
    WHERE Id = 7;
    -- Baldur''s Gate 3 (1086940)
    UPDATE Games SET Screenshots = '["https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/ss_1.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/ss_2.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/ss_3.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/ss_4.jpg"]'
    WHERE Id = 8;
    -- Red Dead Redemption 2 (1174180)
    UPDATE Games SET Screenshots = '["https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/ss_1.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/ss_2.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/ss_3.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/ss_4.jpg"]'
    WHERE Id = 9;
    -- The Witcher 3 (292030)
    UPDATE Games SET Screenshots = '["https://cdn.cloudflare.steamstatic.com/steam/apps/292030/ss_1.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/292030/ss_2.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/292030/ss_3.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/292030/ss_4.jpg"]'
    WHERE Id = 10;
    -- Monster Hunter: World (582010)
    UPDATE Games SET Screenshots = '["https://cdn.cloudflare.steamstatic.com/steam/apps/582010/ss_1.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/582010/ss_2.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/582010/ss_3.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/582010/ss_4.jpg"]'
    WHERE Id = 11;
    -- Stardew Valley (413150)
    UPDATE Games SET Screenshots = '["https://cdn.cloudflare.steamstatic.com/steam/apps/413150/ss_1.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/413150/ss_2.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/413150/ss_3.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/413150/ss_4.jpg"]'
    WHERE Id = 12;
    -- Terraria (105600)
    UPDATE Games SET Screenshots = '["https://cdn.cloudflare.steamstatic.com/steam/apps/105600/ss_1.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/105600/ss_2.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/105600/ss_3.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/105600/ss_4.jpg"]'
    WHERE Id = 13;
    -- Left 4 Dead 2 (550)
    UPDATE Games SET Screenshots = '["https://cdn.cloudflare.steamstatic.com/steam/apps/550/ss_1.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/550/ss_2.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/550/ss_3.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/550/ss_4.jpg"]'
    WHERE Id = 14;
    -- Garry''s Mod (4000)
    UPDATE Games SET Screenshots = '["https://cdn.cloudflare.steamstatic.com/steam/apps/4000/ss_1.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/4000/ss_2.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/4000/ss_3.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/4000/ss_4.jpg"]'
    WHERE Id = 15;
    -- Among Us (945360)
    UPDATE Games SET Screenshots = '["https://cdn.cloudflare.steamstatic.com/steam/apps/945360/ss_1.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/945360/ss_2.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/945360/ss_3.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/945360/ss_4.jpg"]'
    WHERE Id = 16;
    -- Phasmophobia (739630)
    UPDATE Games SET Screenshots = '["https://cdn.cloudflare.steamstatic.com/steam/apps/739630/ss_1.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/739630/ss_2.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/739630/ss_3.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/739630/ss_4.jpg"]'
    WHERE Id = 17;
    -- Valheim (892970)
    UPDATE Games SET Screenshots = '["https://cdn.cloudflare.steamstatic.com/steam/apps/892970/ss_1.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/892970/ss_2.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/892970/ss_3.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/892970/ss_4.jpg"]'
    WHERE Id = 18;
    -- Rust (252490)
    UPDATE Games SET Screenshots = '["https://cdn.cloudflare.steamstatic.com/steam/apps/252490/ss_1.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/252490/ss_2.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/252490/ss_3.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/252490/ss_4.jpg"]'
    WHERE Id = 19;
    -- ARK: Survival Evolved (346110)
    UPDATE Games SET Screenshots = '["https://cdn.cloudflare.steamstatic.com/steam/apps/346110/ss_1.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/346110/ss_2.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/346110/ss_3.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/346110/ss_4.jpg"]'
    WHERE Id = 20;
    -- Hogwarts Legacy (990080)
    UPDATE Games SET Screenshots = '["https://cdn.cloudflare.steamstatic.com/steam/apps/990080/ss_1.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/990080/ss_2.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/990080/ss_3.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/990080/ss_4.jpg"]'
    WHERE Id = 21;
    -- Civilization VI (289070)
    UPDATE Games SET Screenshots = '["https://cdn.cloudflare.steamstatic.com/steam/apps/289070/ss_1.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/289070/ss_2.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/289070/ss_3.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/289070/ss_4.jpg"]'
    WHERE Id = 22;
    -- Euro Truck Simulator 2 (227300)
    UPDATE Games SET Screenshots = '["https://cdn.cloudflare.steamstatic.com/steam/apps/227300/ss_1.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/227300/ss_2.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/227300/ss_3.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/227300/ss_4.jpg"]'
    WHERE Id = 23;
    -- Fallout 4 (377160)
    UPDATE Games SET Screenshots = '["https://cdn.cloudflare.steamstatic.com/steam/apps/377160/ss_1.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/377160/ss_2.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/377160/ss_3.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/377160/ss_4.jpg"]'
    WHERE Id = 26;
    -- Skyrim SE (489830)
    UPDATE Games SET Screenshots = '["https://cdn.cloudflare.steamstatic.com/steam/apps/489830/ss_1.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/489830/ss_2.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/489830/ss_3.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/489830/ss_4.jpg"]'
    WHERE Id = 27;
    -- Dark Souls III (374320)
    UPDATE Games SET Screenshots = '["https://cdn.cloudflare.steamstatic.com/steam/apps/374320/ss_1.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/374320/ss_2.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/374320/ss_3.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/374320/ss_4.jpg"]'
    WHERE Id = 28;
    -- Sekiro (814380)
    UPDATE Games SET Screenshots = '["https://cdn.cloudflare.steamstatic.com/steam/apps/814380/ss_1.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/814380/ss_2.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/814380/ss_3.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/814380/ss_4.jpg"]'
    WHERE Id = 29;
    -- God of War (1593500)
    UPDATE Games SET Screenshots = '["https://cdn.cloudflare.steamstatic.com/steam/apps/1593500/ss_1.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/1593500/ss_2.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/1593500/ss_3.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/1593500/ss_4.jpg"]'
    WHERE Id = 30;
    -- Spider-Man Remastered (1817070)
    UPDATE Games SET Screenshots = '["https://cdn.cloudflare.steamstatic.com/steam/apps/1817070/ss_1.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/1817070/ss_2.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/1817070/ss_3.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/1817070/ss_4.jpg"]'
    WHERE Id = 31;
    -- Horizon Zero Dawn (1151640)
    UPDATE Games SET Screenshots = '["https://cdn.cloudflare.steamstatic.com/steam/apps/1151640/ss_1.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/1151640/ss_2.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/1151640/ss_3.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/1151640/ss_4.jpg"]'
    WHERE Id = 32;
    -- Days Gone (1259420)
    UPDATE Games SET Screenshots = '["https://cdn.cloudflare.steamstatic.com/steam/apps/1259420/ss_1.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/1259420/ss_2.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/1259420/ss_3.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/1259420/ss_4.jpg"]'
    WHERE Id = 33;
    -- RimWorld (294100)
    UPDATE Games SET Screenshots = '["https://cdn.cloudflare.steamstatic.com/steam/apps/294100/ss_1.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/294100/ss_2.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/294100/ss_3.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/294100/ss_4.jpg"]'
    WHERE Id = 49;
    -- Factorio (427520)
    UPDATE Games SET Screenshots = '["https://cdn.cloudflare.steamstatic.com/steam/apps/427520/ss_1.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/427520/ss_2.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/427520/ss_3.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/427520/ss_4.jpg"]'
    WHERE Id = 50;
    -- Hades (1145360)
    UPDATE Games SET Screenshots = '["https://cdn.cloudflare.steamstatic.com/steam/apps/1145360/ss_1.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/1145360/ss_2.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/1145360/ss_3.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/1145360/ss_4.jpg"]'
    WHERE Id = 51;
    -- Hollow Knight (367520)
    UPDATE Games SET Screenshots = '["https://cdn.cloudflare.steamstatic.com/steam/apps/367520/ss_1.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/367520/ss_2.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/367520/ss_3.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/367520/ss_4.jpg"]'
    WHERE Id = 52;
    -- Dead Cells (588650)
    UPDATE Games SET Screenshots = '["https://cdn.cloudflare.steamstatic.com/steam/apps/588650/ss_1.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/588650/ss_2.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/588650/ss_3.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/588650/ss_4.jpg"]'
    WHERE Id = 53;
    -- Slay the Spire (646570)
    UPDATE Games SET Screenshots = '["https://cdn.cloudflare.steamstatic.com/steam/apps/646570/ss_1.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/646570/ss_2.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/646570/ss_3.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/646570/ss_4.jpg"]'
    WHERE Id = 54;
    -- Deep Rock Galactic (548430)
    UPDATE Games SET Screenshots = '["https://cdn.cloudflare.steamstatic.com/steam/apps/548430/ss_1.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/548430/ss_2.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/548430/ss_3.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/548430/ss_4.jpg"]'
    WHERE Id = 55;
    -- Subnautica (264710)
    UPDATE Games SET Screenshots = '["https://cdn.cloudflare.steamstatic.com/steam/apps/264710/ss_1.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/264710/ss_2.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/264710/ss_3.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/264710/ss_4.jpg"]'
    WHERE Id = 56;
    -- Cult of the Lamb (1313140)
    UPDATE Games SET Screenshots = '["https://cdn.cloudflare.steamstatic.com/steam/apps/1313140/ss_1.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/1313140/ss_2.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/1313140/ss_3.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/1313140/ss_4.jpg"]'
    WHERE Id = 57;
    -- Vampire Survivors (1794680)
    UPDATE Games SET Screenshots = '["https://cdn.cloudflare.steamstatic.com/steam/apps/1794680/ss_1.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/1794680/ss_2.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/1794680/ss_3.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/1794680/ss_4.jpg"]'
    WHERE Id = 58;
    -- Stray (1332010)
    UPDATE Games SET Screenshots = '["https://cdn.cloudflare.steamstatic.com/steam/apps/1332010/ss_1.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/1332010/ss_2.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/1332010/ss_3.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/1332010/ss_4.jpg"]'
    WHERE Id = 59;
    -- Dave the Diver (1868140)
    UPDATE Games SET Screenshots = '["https://cdn.cloudflare.steamstatic.com/steam/apps/1868140/ss_1.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/1868140/ss_2.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/1868140/ss_3.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/1868140/ss_4.jpg"]'
    WHERE Id = 60;
    -- Helldivers 2 (553850)
    UPDATE Games SET Screenshots = '["https://cdn.cloudflare.steamstatic.com/steam/apps/553850/ss_1.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/553850/ss_2.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/553850/ss_3.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/553850/ss_4.jpg"]'
    WHERE Id = 61;
    -- Lies of P (1627720)
    UPDATE Games SET Screenshots = '["https://cdn.cloudflare.steamstatic.com/steam/apps/1627720/ss_1.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/1627720/ss_2.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/1627720/ss_3.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/1627720/ss_4.jpg"]'
    WHERE Id = 62;
    -- Resident Evil 4 (2050650)
    UPDATE Games SET Screenshots = '["https://cdn.cloudflare.steamstatic.com/steam/apps/2050650/ss_1.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/2050650/ss_2.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/2050650/ss_3.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/2050650/ss_4.jpg"]'
    WHERE Id = 63;
    -- Armored Core VI (1888160)
    UPDATE Games SET Screenshots = '["https://cdn.cloudflare.steamstatic.com/steam/apps/1888160/ss_1.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/1888160/ss_2.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/1888160/ss_3.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/1888160/ss_4.jpg"]'
    WHERE Id = 64;
    -- Don''t Starve Together (322330)
    UPDATE Games SET Screenshots = '["https://cdn.cloudflare.steamstatic.com/steam/apps/322330/ss_1.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/322330/ss_2.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/322330/ss_3.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/322330/ss_4.jpg"]'
    WHERE Id = 66;
    -- Hearts of Iron IV (394360)
    UPDATE Games SET Screenshots = '["https://cdn.cloudflare.steamstatic.com/steam/apps/394360/ss_1.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/394360/ss_2.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/394360/ss_3.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/394360/ss_4.jpg"]'
    WHERE Id = 67;
    -- Sons of the Forest (1326470)
    UPDATE Games SET Screenshots = '["https://cdn.cloudflare.steamstatic.com/steam/apps/1326470/ss_1.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/1326470/ss_2.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/1326470/ss_3.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/1326470/ss_4.jpg"]'
    WHERE Id = 68;
GO

-- ============================================================================
-- 11. ADDITIONAL USERS (for reviews, IDs 2-5)
-- ============================================================================
IF NOT EXISTS (SELECT 1 FROM Users WHERE Id = 2)
BEGIN
    SET IDENTITY_INSERT Users ON;
    INSERT INTO Users (Id, Username, Password, Salt, DisplayName, Email, Phone, AvatarUrl, Wallet, IsActive, CreatedAt)
    VALUES
    (2, N'nguyenvan',
     N'HdU1kNsl8MIkPs61DHI2mzLngf1jW7lE42s/5SUNnAE=', 0xC8EC17B860A6813152BDA71030386669,
     N'Nguyễn Văn An', N'nguyenvan@gamestore.com', N'0912345678', '', 500000, 1, DATEADD(DAY, -180, GETUTCDATE())),
    (3, N'tranvanb',
     N'HdU1kNsl8MIkPs61DHI2mzLngf1jW7lE42s/5SUNnAE=', 0xC8EC17B860A6813152BDA71030386669,
     N'Trần Văn Bình', N'tranvanb@gamestore.com', N'0923456789', '', 300000, 1, DATEADD(DAY, -150, GETUTCDATE())),
    (4, N'phamthic',
     N'HdU1kNsl8MIkPs61DHI2mzLngf1jW7lE42s/5SUNnAE=', 0xC8EC17B860A6813152BDA71030386669,
     N'Phạm Thị Cúc', N'phamthic@gamestore.com', N'0934567890', '', 750000, 1, DATEADD(DAY, -120, GETUTCDATE())),
    (5, N'levand',
     N'HdU1kNsl8MIkPs61DHI2mzLngf1jW7lE42s/5SUNnAE=', 0xC8EC17B860A6813152BDA71030386669,
     N'Lê Văn Dũng', N'levand@gamestore.com', N'0945678901', '', 200000, 1, DATEADD(DAY, -90, GETUTCDATE()));
    SET IDENTITY_INSERT Users OFF;
END
GO

-- ============================================================================
-- 12. REVIEWS (25 reviews từ 5 users trên 25 game phổ biến)
-- ============================================================================
IF NOT EXISTS (SELECT 1 FROM Reviews WHERE Id = 1)
BEGIN
    SET IDENTITY_INSERT Reviews ON;
    INSERT INTO Reviews (Id, UserId, GameId, Rating, Content, IsRecommended, HelpfulCount, CreatedAt, UpdatedAt)
    VALUES
    -- User 1 (admin) trên các game
    (1, 1, 5, 5, N'Grand Theft Auto V vẫn là một trong những game open-world hay nhất mọi thời đại. Đồ họa tuyệt vời, gameplay phong phú, nội dung thì vô tận. Cực kỳ đáng chơi!', 1, 45, DATEADD(DAY, -60, GETUTCDATE()), DATEADD(DAY, -60, GETUTCDATE())),
    (2, 1, 8, 5, N'Baldur''s Gate 3 là một kiệt tác. Larian Studios đã tạo ra một RPG không thể tin được với chiều sâu và sự tự do chưa từng có. 200 giờ chơi và vẫn còn khám phá. 10/10.', 1, 72, DATEADD(DAY, -55, GETUTCDATE()), DATEADD(DAY, -55, GETUTCDATE())),
    (3, 1, 13, 4, N'Terraria là game sandbox 2D xuất sắc. Nếu bạn thích Minecraft, bạn sẽ nghiện Terraria vì nó có nội dung phong phú hơn nhiều. Rất đáng giá.', 1, 38, DATEADD(DAY, -45, GETUTCDATE()), DATEADD(DAY, -45, GETUTCDATE())),
    (4, 1, 20, 4, N'ARK có một concept tuyệt vời, nhưng optimization còn kém. Tuy nhiên, nếu bạn có bạn bè chơi cùng thì đây là một trong những game sinh tồn hay nhất.', 1, 22, DATEADD(DAY, -40, GETUTCDATE()), DATEADD(DAY, -40, GETUTCDATE())),
    (5, 1, 28, 5, N'DARK SOULS III là đỉnh cao của series Souls. Boss design xuất sắc, world connected rất tinh tế, và độ khó đầy thử thách. Một tựa game không thể bỏ qua.', 1, 56, DATEADD(DAY, -35, GETUTCDATE()), DATEADD(DAY, -35, GETUTCDATE())),
    (6, 1, 51, 5, N'Hades là một roguelike tuyệt vời. Gameplay nhanh, mượt mà, cốt truyện hấp dẫn và nhân vật có chiều sâu. Supergiant Games đã làm quá tốt!', 1, 64, DATEADD(DAY, -30, GETUTCDATE()), DATEADD(DAY, -30, GETUTCDATE())),

    -- User 2 (Nguyễn Văn An)
    (7, 2, 6, 4, N'Elden Ring thực sự xứng đáng với danh hiệu Game of the Year. Thế giới rộng lớn, boss đầy thử thách, và cảm giác khám phá thật tuyệt vời. Tuy nhiên độ khó có thể làm nản lòng người chơi mới.', 1, 52, DATEADD(DAY, -50, GETUTCDATE()), DATEADD(DAY, -50, GETUTCDATE())),
    (8, 2, 10, 5, N'The Witcher 3 là một trong những game hay nhất tôi từng chơi. Câu chuyện sâu sắc, nhân vật phức tạp, và thế giới sống động. Một kiệt tác thực sự.', 1, 43, DATEADD(DAY, -48, GETUTCDATE()), DATEADD(DAY, -48, GETUTCDATE())),
    (9, 2, 12, 4, N'Stardew Valley là game giải trí tuyệt vời sau những giờ làm việc căng thẳng. Âm nhạc thư giãn, gameplay gây nghiện. Perfect cho người thích game nông trại.', 1, 38, DATEADD(DAY, -42, GETUTCDATE()), DATEADD(DAY, -42, GETUTCDATE())),
    (10, 2, 27, 3, N'Skyrim dù có tuổi nhưng mod community vẫn rất mạnh mẽ. Game cơ bản thì ổn nhưng đồ họa và combat đã hơi lỗi thời. Mod mới là thứ giúp game sống lại.', 1, 25, DATEADD(DAY, -38, GETUTCDATE()), DATEADD(DAY, -38, GETUTCDATE())),
    (11, 2, 52, 5, N'Hollow Knight là một metroidvania xuất sắc. Nghệ thuật vẽ tay, âm nhạc mê hoặc, gameplay mượt mà. Với giá chỉ 299k thì đây là một bargain không thể tin được.', 1, 59, DATEADD(DAY, -25, GETUTCDATE()), DATEADD(DAY, -25, GETUTCDATE())),
    (12, 2, 56, 4, N'Subnautica là trải nghiệm dưới nước độc đáo và đáng sợ. Khám phá đại dương xa lạ với sinh vật biển kỳ lạ thực sự cuốn hút. Hơi buggy ở một số chỗ.', 1, 31, DATEADD(DAY, -20, GETUTCDATE()), DATEADD(DAY, -20, GETUTCDATE())),

    -- User 3 (Trần Văn Bình)
    (13, 3, 30, 4, N'God of War trên PC là một kiệt tác! Đồ họa tuyệt đẹp, cốt truyện cảm động về tình cha con, và gameplay đấu võ đỉnh cao. Leviathan Axe là một trong những vũ khí iconic nhất trong lịch sử game.', 1, 89, DATEADD(DAY, -70, GETUTCDATE()), DATEADD(DAY, -70, GETUTCDATE())),
    (14, 3, 7, 5, N'Cyberpunk 2077 sau bản 2.0 và Phantom Liberty đã trở thành game như mong đợi. Câu chuyện cảm động, thế giới Night City sống động, gameplay cải thiện rất nhiều.', 1, 67, DATEADD(DAY, -65, GETUTCDATE()), DATEADD(DAY, -65, GETUTCDATE())),
    (15, 3, 31, 2, N'Spider-Man Remastered có đồ họa đẹp và nhân vật hấp dẫn, nhưng gameplay khá lặp đi lặp lại. Nhiệm vụ phụ thiếu sáng tạo và thành phố dù đẹp nhưng thiếu chiều sâu tương tác. Chỉ đáng chơi nếu bạn là fan của Spider-Man.', 0, 12, DATEADD(DAY, -58, GETUTCDATE()), DATEADD(DAY, -58, GETUTCDATE())),
    (16, 3, 17, 5, N'Phasmophobia là game co-op horror hay nhất hiện tại. Mỗi phiên đi săn ma đều khác nhau, cảm giác hồi hộp thực sự rất cuốn hút. Chơi với bạn bè là best experience.', 1, 44, DATEADD(DAY, -52, GETUTCDATE()), DATEADD(DAY, -52, GETUTCDATE())),
    (17, 3, 55, 5, N'Deep Rock Galactic là game co-op FPS hay nhất. Mỗi nhiệm vụ đều khác nhau, gameplay đa dạng, cộng đồng thân thiện. ROCK AND STONE!', 1, 71, DATEADD(DAY, -28, GETUTCDATE()), DATEADD(DAY, -28, GETUTCDATE())),
    (18, 3, 62, 4, N'Lies of P là soulslike phương Đông xuất sắc. Atmosphere đẹp, combat chặt chẽ, weapon assembly system sáng tạo. Hơi khó nhưng rất đáng chơi.', 1, 36, DATEADD(DAY, -15, GETUTCDATE()), DATEADD(DAY, -15, GETUTCDATE())),

    -- User 4 (Phạm Thị Cúc)
    (19, 4, 50, 5, N'Factorio là đỉnh cao của thể loại automation và factory building. Cảm giác xây dựng dây chuyền sản xuất tự động hóa thực sự gây nghiện. Mỗi vấn đề đều có nhiều cách giải quyết, khuyến khích sáng tạo. The factory must grow!', 1, 95, DATEADD(DAY, -75, GETUTCDATE()), DATEADD(DAY, -75, GETUTCDATE())),
    (20, 4, 9, 4, N'Red Dead Redemption 2 là một tác phẩm nghệ thuật. Thế giới chi tiết đến kinh ngạc, câu chuyện cảm động. Hơi chậm ở đầu game nhưng kiên nhẫn sẽ được đền đáp.', 1, 48, DATEADD(DAY, -62, GETUTCDATE()), DATEADD(DAY, -62, GETUTCDATE())),
    (21, 4, 14, 4, N'Left 4 Dead 2 dù ra mắt năm 2009 vẫn rất vui khi chơi với bạn bè. Campaign đa dạng, cảm giác cooperative cực tốt. Một classic không thể thiếu trong thư viện.', 1, 33, DATEADD(DAY, -55, GETUTCDATE()), DATEADD(DAY, -55, GETUTCDATE())),
    (22, 4, 49, 5, N'RimWorld là colony simulator xuất sắc nhất. AI storyteller tạo ra những câu chuyện không thể tin được. Mỗi playthrough đều khác nhau. Dễ dàng chìm đắm hàng trăm giờ.', 1, 55, DATEADD(DAY, -32, GETUTCDATE()), DATEADD(DAY, -32, GETUTCDATE())),
    (23, 4, 57, 4, N'Cult of the Lamb kết hợp giữa base building và action roguelike rất sáng tạo. Đồ họa dễ thương nhưng gameplay có chiều sâu. Hơi ngắn nhưng chất lượng.', 1, 29, DATEADD(DAY, -18, GETUTCDATE()), DATEADD(DAY, -18, GETUTCDATE())),
    (24, 4, 63, 5, N'Resident Evil 4 Remake là bản remake xuất sắc. Capcom giữ được tinh thần của bản gốc và nâng cấp mọi thứ. Leon chưa bao giờ ngầu hơn thế!', 1, 63, DATEADD(DAY, -10, GETUTCDATE()), DATEADD(DAY, -10, GETUTCDATE())),

    -- User 5 (Lê Văn Dũng)
    (25, 5, 11, 4, N'Monster Hunter: World là cửa ngõ hoàn hảo cho người mới đến với series MH. Gameplay đa dạng, đồ họa đẹp, hệ thống chiến đấu có chiều sâu. Cần kiên nhẫn để tập nhưng rất đáng.', 1, 41, DATEADD(DAY, -44, GETUTCDATE()), DATEADD(DAY, -44, GETUTCDATE())),
    (26, 5, 18, 5, N'Valheim là một trong những survival game hay nhất. Phong cách đồ họa độc đáo, boss design sáng tạo, xây dựng base thú vị. Chơi với bạn bè là một trải nghiệm khó quên.', 1, 47, DATEADD(DAY, -36, GETUTCDATE()), DATEADD(DAY, -36, GETUTCDATE())),
    (27, 5, 29, 3, N'Sekiro có combat system tuyệt vời nhưng quá khó đối với người chơi casual. Nếu bạn thích thử thách thì đây là game tuyệt hảo, còn không thì dễ gây stress.', 1, 28, DATEADD(DAY, -28, GETUTCDATE()), DATEADD(DAY, -28, GETUTCDATE())),
    (28, 5, 54, 5, N'Slay the Spire là game mà tôi không ngờ lại gây nghiện đến vậy. Deckbuilding roguelike đỉnh cao, mỗi lần chơi đều khác nhau. Dễ học khó master.', 1, 58, DATEADD(DAY, -22, GETUTCDATE()), DATEADD(DAY, -22, GETUTCDATE())),
    (29, 5, 58, 4, N'Vampire Survivors với giá 99k mà cho bạn hàng trăm giờ giải trí. Gameplay đơn giản nhưng cực kỳ gây nghiện. Một trong những indie game thành công nhất.', 1, 53, DATEADD(DAY, -12, GETUTCDATE()), DATEADD(DAY, -12, GETUTCDATE())),
    (30, 5, 66, 4, N'Don''t Starve Together là survival game có phong cách nghệ thuật độc đáo. Chơi co-op rất vui, nhưng có thể hơi khó hiểu với người mới. Kiên nhẫn là chìa khóa.', 1, 18, DATEADD(DAY, -8, GETUTCDATE()), DATEADD(DAY, -8, GETUTCDATE()));
    SET IDENTITY_INSERT Reviews OFF;
END
GO

-- ============================================================================
-- 13. TRAILER URLs (Steam CDN DASH H.264 - highlighted trailer mỗi game)
-- ============================================================================
-- Trailer URLs (always apply after cleanup)
                    UPDATE Games SET TrailerUrl = N'https://video.akamai.steamstatic.com/store_trailers/271590/844218/973b531959db4e15682893543d6a27a70e7e1eb3/1751269402/dash_h264.mpd?t=1741098095' WHERE Id = 5;
    UPDATE Games SET TrailerUrl = N'https://video.akamai.steamstatic.com/store_trailers/1245620/468143/7a6be00f78fb0fd8b419e92cea72cc4a19ec45f8/1750650501/dash_h264.mpd?t=1716311566' WHERE Id = 6;
    UPDATE Games SET TrailerUrl = N'https://video.akamai.steamstatic.com/store_trailers/1091500/801198/1b8aa4d59e19e69218c59bf1a6d9d23daedb01ab/1750617889/dash_h264.mpd?t=1734434767' WHERE Id = 7;
    UPDATE Games SET TrailerUrl = N'https://video.akamai.steamstatic.com/store_trailers/1086940/637951/59ca25b847b0e471638d1e2474acf71b068d57f0/1750615003/dash_h264.mpd?t=1702007645' WHERE Id = 8;
    UPDATE Games SET TrailerUrl = N'https://video.akamai.steamstatic.com/store_trailers/1174180/254050/b2cc520c692391e65f2d09067f95001dcf4b434d/1750634049/dash_h264.mpd?t=1574881964' WHERE Id = 9;
    UPDATE Games SET TrailerUrl = N'https://video.akamai.steamstatic.com/store_trailers/292030/533367/ee1f58b16da1bccf359c9305bff8193a0f7926f3/1750502482/dash_h264.mpd?t=1674829921' WHERE Id = 10;
    UPDATE Games SET TrailerUrl = N'https://video.akamai.steamstatic.com/store_trailers/582010/255950/5dffee8057c4005eb9c3f7c6443b16a42b58f208/1750555191/dash_h264.mpd?t=1578591085' WHERE Id = 11;
    UPDATE Games SET TrailerUrl = N'https://video.akamai.steamstatic.com/store_trailers/413150/336433/0058de516bf7c46986ba1e81172ffd3c2ca6cad7/1750527541/dash_h264.mpd?t=1754692862' WHERE Id = 12;
    UPDATE Games SET TrailerUrl = N'https://video.akamai.steamstatic.com/store_trailers/105600/1114648825/03d62ed8c2a353ea17f36caf492d053746655032/1769541214/dash_h264.mpd?t=1769844434' WHERE Id = 13;
    UPDATE Games SET TrailerUrl = N'https://video.akamai.steamstatic.com/store_trailers/550/4183/7fdfab73a52d6b4e69a693f77c66620c53086cbd/1749861554/dash_h264.mpd?t=1682697457' WHERE Id = 14;
    -- Game 15 (Garry''s Mod, AppID 4000): No trailer available on Steam
    UPDATE Games SET TrailerUrl = N'https://video.akamai.steamstatic.com/store_trailers/945360/1500936740/ab4e8e0e92771daaa6e83ee679314df2ee84d72d/1757443796/dash_h264.mpd?t=1757444890' WHERE Id = 16;
    UPDATE Games SET TrailerUrl = N'https://video.akamai.steamstatic.com/store_trailers/739630/821249914/697befe0f34ea58d28354478674d1b801b8568f2/1772540041/dash_h264.mpd?t=1778584293' WHERE Id = 17;
    UPDATE Games SET TrailerUrl = N'https://video.akamai.steamstatic.com/store_trailers/892970/700057/92243856917a479ef44b4ab22d3378a272c6fffc/1750594091/dash_h264.mpd?t=1715688262' WHERE Id = 18;
    UPDATE Games SET TrailerUrl = N'https://video.akamai.steamstatic.com/store_trailers/252490/102019/c573f5b01317174c7ae20a0abbcc3a39ccad32c2/1750487766/dash_h264.mpd?t=1699598112' WHERE Id = 19;
    UPDATE Games SET TrailerUrl = N'https://video.akamai.steamstatic.com/store_trailers/346110/372586/b23204cd58f68c42a07248e8472b9296c1c875c5/1750513376/dash_h264.mpd?t=1622089232' WHERE Id = 20;
    UPDATE Games SET TrailerUrl = N'https://video.akamai.steamstatic.com/store_trailers/990080/312591535/edf964f7fb722d801bbe72a28ae205e8931519f7/1778796107/dash_h264.mpd?t=1778797473' WHERE Id = 21;
    UPDATE Games SET TrailerUrl = N'https://video.akamai.steamstatic.com/store_trailers/289070/76616/f09b19535e8ceef09ce6548300cd27f949b52678/1750500599/dash_h264.mpd?t=1476736935' WHERE Id = 22;
    UPDATE Games SET TrailerUrl = N'https://video.akamai.steamstatic.com/store_trailers/227300/455253/f717b44f949ed6c824778b30d516147bdaaad95a/1750482436/dash_h264.mpd?t=1683632053' WHERE Id = 23;
            UPDATE Games SET TrailerUrl = N'https://video.akamai.steamstatic.com/store_trailers/377160/1672571219/644e16118aab9bd7107055611003b0383f459b6a/1762791676/dash_h264.mpd?t=1762798746' WHERE Id = 26;
    UPDATE Games SET TrailerUrl = N'https://video.akamai.steamstatic.com/store_trailers/489830/77128/20c56f14e492b05846f7262a246b4e4f0d455f7f/1750536877/dash_h264.mpd?t=1476991615' WHERE Id = 27;
    UPDATE Games SET TrailerUrl = N'https://video.akamai.steamstatic.com/store_trailers/374320/48797/e6075d14ad252fe2660a62e7c8b7eaf0afa64096/1750520094/dash_h264.mpd?t=1700587333' WHERE Id = 28;
    UPDATE Games SET TrailerUrl = N'https://video.akamai.steamstatic.com/store_trailers/814380/322401/63cf1fdf9c16536f04b08a5b1939909f7a99a340/1750586450/dash_h264.mpd?t=1603837979' WHERE Id = 29;
    UPDATE Games SET TrailerUrl = N'https://video.akamai.steamstatic.com/store_trailers/1593500/423179/503f509cd6c9964f790867e6cda8542789136b85/1750704708/dash_h264.mpd?t=1639001817' WHERE Id = 30;
    UPDATE Games SET TrailerUrl = N'https://video.akamai.steamstatic.com/store_trailers/1817070/486856/c8923f57eef7c9e2b21688918ebe0054e76030f9/1750737947/dash_h264.mpd?t=1672791651' WHERE Id = 31;
    UPDATE Games SET TrailerUrl = N'https://video.akamai.steamstatic.com/store_trailers/1151640/485458/b72c7c802a69651c05bdeeb5e847600319226b41/1750629501/dash_h264.mpd?t=1659711061' WHERE Id = 32;
    UPDATE Games SET TrailerUrl = N'https://video.akamai.steamstatic.com/store_trailers/1259420/370276/27a06e5be3593d3a9a4a3283b47756076674c254/1750655944/dash_h264.mpd?t=1621343125' WHERE Id = 33;
    UPDATE Games SET TrailerUrl = N'https://video.akamai.steamstatic.com/store_trailers/294100/189193/b88a55b0c4df1e292fa85455c5157a31ad1da17c/1750502942/dash_h264.mpd?t=1539788136' WHERE Id = 49;
    UPDATE Games SET TrailerUrl = N'https://video.akamai.steamstatic.com/store_trailers/427520/304275/352d361477488a88ba2274620093d8a4c67ec908/1750529745/dash_h264.mpd?t=1597395499' WHERE Id = 50;
    UPDATE Games SET TrailerUrl = N'https://video.akamai.steamstatic.com/store_trailers/1145360/312686/b0312c49135823cc34946e98148abfb8da71f0fb/1750627549/dash_h264.mpd?t=1600353465' WHERE Id = 51;
    UPDATE Games SET TrailerUrl = N'https://video.akamai.steamstatic.com/store_trailers/367520/89922/b71b6a50e9aa2334fddca8fa2197cb26a3640832/1750517691/dash_h264.mpd?t=1497589417' WHERE Id = 52;
    UPDATE Games SET TrailerUrl = N'https://video.akamai.steamstatic.com/store_trailers/588650/231061/8fe407db503493211097e9898f58ae600559a2a3/1750557235/dash_h264.mpd?t=1581426951' WHERE Id = 53;
    UPDATE Games SET TrailerUrl = N'https://video.akamai.steamstatic.com/store_trailers/646570/205320/640196deb3169b2a1667340ab45f229af73caba7/1750566635/dash_h264.mpd?t=1548258737' WHERE Id = 54;
    UPDATE Games SET TrailerUrl = N'https://video.akamai.steamstatic.com/store_trailers/548430/1912821037/a9a4174ee3e32773076b9f64e2f27cd7627bdbed/1769597323/dash_h264.mpd?t=1769688641' WHERE Id = 55;
    UPDATE Games SET TrailerUrl = N'https://video.akamai.steamstatic.com/store_trailers/264710/143519/33594902d34e588ce90d9905c30aa902198fea59/1750490623/dash_h264.mpd?t=1516828564' WHERE Id = 56;
    UPDATE Games SET TrailerUrl = N'https://video.akamai.steamstatic.com/store_trailers/1313140/739299/44677940efbc210f65d05893125c9fbdb4d31fbe/1750671650/dash_h264.mpd?t=1723478272' WHERE Id = 57;
    UPDATE Games SET TrailerUrl = N'https://video.akamai.steamstatic.com/store_trailers/1794680/598026/b3a9771de005c30237b53d84932fd2e792f298c0/1750736849/dash_h264.mpd?t=1692280956' WHERE Id = 58;
    UPDATE Games SET TrailerUrl = N'https://video.akamai.steamstatic.com/store_trailers/1332010/480740/52e229bcff026b75925b610c8304660aba39c33a/1750673003/dash_h264.mpd?t=1658250380' WHERE Id = 59;
    UPDATE Games SET TrailerUrl = N'https://video.akamai.steamstatic.com/store_trailers/1868140/581787/bef9ffd11e17bcfa42e6609682e42cc296264c3f/1750739131/dash_h264.mpd?t=1734352317' WHERE Id = 60;
    UPDATE Games SET TrailerUrl = N'https://video.akamai.steamstatic.com/store_trailers/553850/1282619189/bcb2ef87a4fc81c55e55bd5b088159331a6b5de6/1770740902/dash_h264.mpd?t=1770747639' WHERE Id = 61;
    UPDATE Games SET TrailerUrl = N'https://video.akamai.steamstatic.com/store_trailers/1627720/614254/a2464aab03521fe2627046afc34a74067cca84fc/1750713680/dash_h264.mpd?t=1696396705' WHERE Id = 62;
    UPDATE Games SET TrailerUrl = N'https://video.akamai.steamstatic.com/store_trailers/2050650/657549/cb3c3f74c8ef584d34401e5786b1858845df8fbe/1750745214/dash_h264.mpd?t=1707455759' WHERE Id = 63;
    UPDATE Games SET TrailerUrl = N'https://video.akamai.steamstatic.com/store_trailers/1888160/601222/3676f0a33eab9d520ebd3e4d61ba0c7bf62a8062/1750739939/dash_h264.mpd?t=1693376574' WHERE Id = 64;
        UPDATE Games SET TrailerUrl = N'https://video.akamai.steamstatic.com/store_trailers/322330/1654751406/ed2882d005578965c224fdd45423bf7afb38a3b8/1776356255/dash_h264.mpd?t=1776359429' WHERE Id = 66;
    UPDATE Games SET TrailerUrl = N'https://video.akamai.steamstatic.com/store_trailers/394360/682731/bd7bbea629ccbef568dd3c4d8552ba6e05b3c0ed/1750525316/dash_h264.mpd?t=1712235668' WHERE Id = 67;
    UPDATE Games SET TrailerUrl = N'https://video.akamai.steamstatic.com/store_trailers/1326470/541725/76f298f949c4ae5b4257fa2056112f8d34285799/1750672622/dash_h264.mpd?t=1677175226' WHERE Id = 68;
GO

PRINT N'✅ Seed data đã được insert thành công!';
PRINT N'📊 35 thể loại, 68 game Steam, 235 liên kết game-thể loại, 139 game keys, 30 game giảm giá, 212 screenshots, 5 users, 30 reviews, 52 trailer URLs từ Steam CDN.';
GO
-- ============================================================================
-- 13. ADDITIONAL REVIEWS (55 reviews, IDs 91-145)
-- ============================================================================
IF NOT EXISTS (SELECT 1 FROM Reviews WHERE Id = 91)
BEGIN
    SET IDENTITY_INSERT Reviews ON;
    INSERT INTO Reviews (Id, UserId, GameId, Rating, Content, IsRecommended, HelpfulCount, CreatedAt, UpdatedAt) VALUES
    (91, 2, 1, 5, N'CS2 la game ban sung hay nhat. Source 2 dep, gameplay muot, ranking cong bang. Choi 5000 tieng van chua chan.', 1, 120, N'2026-05-12 14:11:35.4000000', N'2026-05-12 14:11:35.4000000'),
    (92, 2, 2, 4, N'Dota 2 qua hay, hero da dang, gameplay chien thuat. Cong dong hoi toxic nhung van la MOBA dinh nhat.', 1, 85, N'2026-05-13 14:11:35.4000000', N'2026-05-13 14:11:35.4000000'),
    (93, 2, 4, 5, N'Apex Legends la battle royale hay nhat. Movement muot ma, gunplay da tay, he thong ping qua tien loi.', 1, 76, N'2026-05-14 14:11:35.4000000', N'2026-05-14 14:11:35.4000000'),
    (94, 2, 7, 4, N'Cyberpunk 2077 bay gio da rat khac. Phantom Liberty la DLC xuat sac, cot truyen cam dong.', 1, 92, N'2026-05-15 14:11:35.4000000', N'2026-05-15 14:11:35.4000000'),
    (95, 2, 9, 5, N'RDR2 la tuyet tac. The gioi mo chi tiet nhat, cot truyen nhu phim cao boi epic.', 1, 88, N'2026-05-16 14:11:35.4000000', N'2026-05-16 14:11:35.4000000'),
    (96, 2, 11, 3, N'Monster Hunter World gameplay hay nhung do hoa khong qua an tuong. Hoi kho tiep can nguoi moi.', 1, 34, N'2026-05-17 14:11:35.4000000', N'2026-05-17 14:11:35.4000000'),
    (97, 2, 15, 4, N'Garry Mod sandbox vat ly vui nhon. Workshop hang ngan mode choi. Choi voi ban be cuc ky giai tri.', 1, 45, N'2026-05-18 14:11:35.4000000', N'2026-05-18 14:11:35.4000000'),
    (98, 2, 18, 5, N'Valheim la survival game bat ngo nhat. The gioi procedural rong lon, xay dung thu vi, boss an tuong.', 1, 67, N'2026-05-19 14:11:35.4000000', N'2026-05-19 14:11:35.4000000'),
    (99, 2, 21, 4, N'Hogwarts Legacy la giac mo fan Harry Potter. Hogwarts qua dep, combat phep thuat thu vi.', 1, 73, N'2026-05-20 14:11:35.4000000', N'2026-05-20 14:11:35.4000000'),
    (100, 2, 24, 5, N'Rainbow Six Siege du ra mat 2015 van rat hot. Tactical FPS dinh cao, destruction physics tuyet voi.', 1, 81, N'2026-05-21 14:11:35.4000000', N'2026-05-21 14:11:35.4000000'),
    (101, 2, 5, 5, N'GTA V online van soi dong sau gan 10 nam. The gioi Los Santos song dong. Rockstar la huyen thoai.', 1, 95, N'2026-05-22 14:11:35.4000000', N'2026-05-22 14:11:35.4000000'),
    (102, 2, 8, 5, N'Baldur Gate 3 xung dang 10/10. Larian da nang tam CRPG. Tu do trong moi quyet dinh.', 1, 104, N'2026-05-23 14:11:35.4000000', N'2026-05-23 14:11:35.4000000'),
    (103, 3, 5, 5, N'GTA V hay nhat moi thoi dai. Online van rat dong nguoi choi, heist moi lien tuc.', 1, 90, N'2026-05-12 14:11:35.4000000', N'2026-05-12 14:11:35.4000000'),
    (104, 3, 8, 5, N'Baldur Gate 3 la kiet tac. Tu do sang tao, nhan vat chieu sau, combat turn-based xuat sac.', 1, 102, N'2026-05-13 14:11:35.4000000', N'2026-05-13 14:11:35.4000000'),
    (105, 3, 10, 4, N'Witcher 3 cot truyen xuat sac. Side quest chat luong hon main game nhieu tua game khac.', 1, 78, N'2026-05-14 14:11:35.4000000', N'2026-05-14 14:11:35.4000000'),
    (106, 3, 12, 5, N'Stardew Valley chill nhat. Sau ngay lam viec met moi, ve farm trong trot thu gian.', 1, 56, N'2026-05-15 14:11:35.4000000', N'2026-05-15 14:11:35.4000000'),
    (107, 3, 16, 3, N'Among Us vui khi du 10 nguoi ban. Choi nguoi la de chan. Phu hop tiec tung.', 1, 28, N'2026-05-16 14:11:35.4000000', N'2026-05-16 14:11:35.4000000'),
    (108, 3, 19, 4, N'Rust survival hardcore nhat. Cam giac hoi hop khi nghe tieng buoc chan ngoai base.', 1, 49, N'2026-05-17 14:11:35.4000000', N'2026-05-17 14:11:35.4000000'),
    (109, 3, 22, 4, N'Civilization VI one more turn keo dai den sang. Rat thich hop cho ai yeu thich lich su.', 1, 42, N'2026-05-18 14:11:35.4000000', N'2026-05-18 14:11:35.4000000'),
    (110, 3, 25, 4, N'TF2 du cu van la class-based shooter vui nhat. 9 class, item phong phu.', 1, 37, N'2026-05-19 14:11:35.4000000', N'2026-05-19 14:11:35.4000000'),
    (111, 3, 30, 5, N'God of War 2018 la masterpiece. Cau chuyen cha con cam dong, combat da tay.', 1, 89, N'2026-05-20 14:11:35.4000000', N'2026-05-20 14:11:35.4000000'),
    (112, 3, 32, 4, N'Horizon Zero Dawn concept doc dao. The gioi hau tan the may moc khong lo.', 1, 54, N'2026-05-21 14:11:35.4000000', N'2026-05-21 14:11:35.4000000'),
    (113, 4, 6, 5, N'Elden Ring open world soulslike xuat sac. FromSoftware lam duoc dieu khong tuong.', 1, 98, N'2026-05-14 14:11:35.4000000', N'2026-05-14 14:11:35.4000000'),
    (114, 4, 13, 5, N'Terraria content nhieu hon 90% game 3D. Cap nhat mien phi 10 nam.', 1, 72, N'2026-05-15 14:11:35.4000000', N'2026-05-15 14:11:35.4000000'),
    (115, 4, 17, 4, N'Phasmophobia co-op horror dang so nhat. Choi dem khuya voi tai nghe ron toc gay.', 1, 61, N'2026-05-16 14:11:35.4000000', N'2026-05-16 14:11:35.4000000'),
    (116, 4, 20, 3, N'ARK tien nang lon nhung optimization qua te. Gameplay hay nhung technical issues.', 1, 25, N'2026-05-17 14:11:35.4000000', N'2026-05-17 14:11:35.4000000'),
    (117, 4, 23, 4, N'Euro Truck Simulator 2 nghe chan nhung thuc su thu gian. Lai xe chau Au nghe nhac.', 1, 39, N'2026-05-18 14:11:35.4000000', N'2026-05-18 14:11:35.4000000'),
    (118, 4, 26, 5, N'Fallout 4 exploration tuyet voi. The gioi post-apocalyptic rong lon, nhieu dia diem thu vi.', 1, 47, N'2026-05-19 14:11:35.4000000', N'2026-05-19 14:11:35.4000000'),
    (119, 4, 28, 4, N'Dark Souls III boss design xuat sac nhat series. Sister Friede, Nameless King kho quen.', 1, 82, N'2026-05-20 14:11:35.4000000', N'2026-05-20 14:11:35.4000000'),
    (120, 4, 31, 5, N'Spider-Man Remastered port PC xuat sac. Web-swinging muot, combat dep, cot truyen hay.', 1, 74, N'2026-05-21 14:11:35.4000000', N'2026-05-21 14:11:35.4000000'),
    (121, 4, 50, 5, N'Factorio gay nghien nhat. The factory must grow! 1000 gio van thay con nhieu thu lam.', 1, 68, N'2026-05-22 14:11:35.4000000', N'2026-05-22 14:11:35.4000000'),
    (122, 4, 54, 5, N'Slay the Spire deckbuilding roguelike hay nhat. 4 class, hang tram card, choi mai khong chan.', 1, 59, N'2026-05-23 14:11:35.4000000', N'2026-05-23 14:11:35.4000000'),
    (123, 5, 3, 2, N'PUBG gio loi thoi va day hack. Performance khong cai thien. Nhieu game BR khac tot hon.', 0, 15, N'2026-05-16 14:11:35.4000000', N'2026-05-16 14:11:35.4000000'),
    (124, 5, 4, 4, N'Apex Legends gameplay hay, ping xuat sac. Nhung matchmaking khong cong bang.', 1, 53, N'2026-05-17 14:11:35.4000000', N'2026-05-17 14:11:35.4000000'),
    (125, 5, 7, 5, N'Cyberpunk 2077 Phantom Liberty mot trong nhung game hay nhat. Cau chuyen lam toi khoc.', 1, 87, N'2026-05-18 14:11:35.4000000', N'2026-05-18 14:11:35.4000000'),
    (126, 5, 10, 5, N'Witcher 3 la chuan muc RPG. Side quest xuat sac. DLC Hearts of Stone kich ban hay nhat.', 1, 91, N'2026-05-19 14:11:35.4000000', N'2026-05-19 14:11:35.4000000'),
    (127, 5, 14, 5, N'L4D2 15 nam tuoi van la co-op zombie shooter hay nhat. Workshop campaign khong lo.', 1, 44, N'2026-05-20 14:11:35.4000000', N'2026-05-20 14:11:35.4000000'),
    (128, 5, 22, 3, N'Civ VI districts va governments thu vi. Nhung AI kem, diplomacy hoi hot.', 1, 35, N'2026-05-22 14:11:35.4000000', N'2026-05-22 14:11:35.4000000'),
    (129, 5, 27, 4, N'Skyrim SE remaster on dinh hon ban goc. Mod community van rat manh.', 1, 41, N'2026-05-23 14:11:35.4000000', N'2026-05-23 14:11:35.4000000'),
    (130, 5, 33, 4, N'Days Gone bi danh gia thap nhung zombie survival tot. Hoard mechanic an tuong.', 1, 43, N'2026-05-25 14:11:35.4000000', N'2026-05-25 14:11:35.4000000'),
    (131, 2, 49, 5, N'RimWorld la game ke chuyen xuat sac. Randy Random khong tha cho ai. 2000 gio van con bat ngo.', 1, 83, N'2026-05-26 14:11:35.4000000', N'2026-05-26 14:11:35.4000000'),
    (132, 2, 53, 4, N'Dead Cells roguelite platformer tuyet voi. Combat nhanh, muot, weapon da dang.', 1, 52, N'2026-05-27 14:11:35.4000000', N'2026-05-27 14:11:35.4000000'),
    (133, 2, 58, 5, N'Vampire Survivors gia 99k content vo tan. Gay nghien kinh khung. Indie hay nhat.', 1, 96, N'2026-05-28 14:11:35.4000000', N'2026-05-28 14:11:35.4000000'),
    (134, 2, 61, 5, N'Helldivers 2 co-op shooter hay nhat 2024. Gunplay da tay, friendly fire hai huoc.', 1, 105, N'2026-05-29 14:11:35.4000000', N'2026-05-29 14:11:35.4000000'),
    (135, 2, 63, 5, N'Resident Evil 4 Remake xuat sac toan dien. Capcom giu tinh than original va nang cap.', 1, 71, N'2026-05-30 14:11:35.4000000', N'2026-05-30 14:11:35.4000000'),
    (136, 3, 50, 5, N'Factorio game engineering hay nhat. Tu dong hoa, toi uu production line. Man nguyen.', 1, 64, N'2026-05-26 14:11:35.4000000', N'2026-05-26 14:11:35.4000000'),
    (137, 3, 59, 4, N'Stray goc nhin meo doc dao. Cyberpunk world dep, giai do thu vi. Hoi ngan.', 1, 57, N'2026-05-28 14:11:35.4000000', N'2026-05-28 14:11:35.4000000'),
    (138, 3, 65, 4, N'Warframe free-to-play cong bang nhat. Farm hau het moi thu. Space ninja!', 1, 46, N'2026-05-30 14:11:35.4000000', N'2026-05-30 14:11:35.4000000'),
    (139, 4, 52, 5, N'Hollow Knight metroidvania dinh cao. The gioi interconnected, boss kho. Silksong dau roi?', 1, 93, N'2026-05-31 14:11:35.4000000', N'2026-05-31 14:11:35.4000000'),
    (140, 4, 56, 4, N'Subnautica noi so dai duong len tam cao moi. Leviathan thuc su dang so.', 1, 48, N'2026-06-01 14:11:35.4000000', N'2026-06-01 14:11:35.4000000'),
    (141, 4, 60, 5, N'Dave the Diver ket hop lan bien va quan ly nha hang sang tao. Pixel art dep.', 1, 63, N'2026-06-02 14:11:35.4000000', N'2026-06-02 14:11:35.4000000'),
    (142, 4, 64, 4, N'Armored Core VI mech game hay nhat. Customization sau, combat toc do cao.', 1, 55, N'2026-06-03 14:11:35.4000000', N'2026-06-03 14:11:35.4000000'),
    (143, 4, 67, 4, N'Hearts of Iron IV grand strategy WWII hay nhat. Vo so mod, cong dong lon.', 1, 38, N'2026-06-04 14:11:35.4000000', N'2026-06-04 14:11:35.4000000'),
    (144, 5, 51, 5, N'Hades gameplay cuon hut, cot truyen qua moi lan chet. Supergiant tai nang nhat.', 1, 86, N'2026-05-31 14:11:35.4000000', N'2026-05-31 14:11:35.4000000'),
    (145, 5, 57, 5, N'Cult of the Lamb cute khong kem thu thach. Quan ly giao phai dungeon crawling sang tao.', 1, 44, N'2026-06-02 14:11:35.4000000', N'2026-06-02 14:11:35.4000000');
    SET IDENTITY_INSERT Reviews OFF;
END
GO

-- Total reviews in seed file: 85 (IDs 1-30 + 91-145)
-- ============================================================================
-- 14. WISHLISTS (25 items)
-- ============================================================================
IF NOT EXISTS (SELECT 1 FROM Wishlists WHERE Id = 1)
BEGIN
    SET IDENTITY_INSERT Wishlists ON;
    INSERT INTO Wishlists (Id, UserId, GameId, AddedAt) VALUES
    (1, 1, 29, N'2026-03-09 14:37:16.6300000'),
    (2, 1, 5, N'2026-04-10 14:37:16.6300000'),
    (3, 1, 27, N'2026-05-31 14:37:16.6300000'),
    (4, 2, 26, N'2026-01-04 14:37:16.6300000'),
    (5, 2, 61, N'2026-04-22 14:37:16.6300000'),
    (6, 2, 56, N'2025-12-25 14:37:16.6300000'),
    (7, 2, 6, N'2025-12-21 14:37:16.6300000'),
    (8, 2, 64, N'2025-12-29 14:37:16.6300000'),
    (9, 3, 55, N'2026-04-09 14:37:16.6300000'),
    (10, 3, 12, N'2025-12-14 14:37:16.6300000'),
    (11, 3, 28, N'2025-12-17 14:37:16.6300000'),
    (12, 3, 27, N'2026-03-02 14:37:16.6300000'),
    (13, 4, 23, N'2025-12-30 14:37:16.6300000'),
    (14, 4, 57, N'2026-04-22 14:37:16.6300000'),
    (15, 4, 11, N'2026-06-05 14:37:16.6300000'),
    (16, 4, 28, N'2026-03-28 14:37:16.6300000'),
    (17, 4, 56, N'2026-05-03 14:37:16.6300000'),
    (18, 4, 49, N'2026-04-13 14:37:16.6300000'),
    (19, 5, 5, N'2026-04-22 14:37:16.6300000'),
    (20, 5, 60, N'2026-01-29 14:37:16.6300000'),
    (21, 5, 64, N'2026-03-26 14:37:16.6300000'),
    (22, 5, 7, N'2026-01-21 14:37:16.6300000'),
    (23, 5, 19, N'2025-12-18 14:37:16.6300000'),
    (24, 5, 30, N'2026-04-25 14:37:16.6300000');
    SET IDENTITY_INSERT Wishlists OFF;
END
GO

-- ============================================================================
-- 15. ORDERS (19 orders)
-- ============================================================================
IF NOT EXISTS (SELECT 1 FROM Orders WHERE Id = 1)
BEGIN
    SET IDENTITY_INSERT Orders ON;
    INSERT INTO Orders (Id, UserId, OrderDate, TotalAmount, Status, PaymentMethod) VALUES
    (1, 1, N'2026-04-22 14:35:07.8600000', 1199800, N'Completed', N'Wallet'),
    (2, 1, N'2026-03-03 14:35:07.8600000', 1698800, N'Cancelled', N'VnPay'),
    (3, 1, N'2026-05-28 14:35:07.8600000', 1998900, N'Completed', N'Momo'),
    (4, 1, N'2026-04-20 14:35:07.8600000', 1498900, N'Completed', N'VnPay'),
    (5, 1, N'2026-03-24 14:35:07.8600000', 1248900, N'Cancelled', N'Wallet'),
    (6, 2, N'2026-02-17 14:35:07.8600000', 1199000, N'Completed', N'Wallet'),
    (7, 2, N'2026-03-29 14:35:07.8600000', 49900, N'Completed', N'Wallet'),
    (8, 2, N'2026-06-08 14:35:07.8600000', 1199000, N'Cancelled', N'Wallet'),
    (9, 2, N'2026-05-19 14:35:07.8600000', 599900, N'Cancelled', N'Momo'),
    (10, 2, N'2026-05-25 14:35:07.8600000', 1399800, N'Completed', N'Momo'),
    (11, 3, N'2026-03-25 14:35:07.8600000', 1798900, N'Cancelled', N'Wallet'),
    (12, 3, N'2026-05-04 14:35:07.8600000', 1199000, N'Completed', N'Momo'),
    (13, 3, N'2026-04-20 14:35:07.8600000', 999000, N'Completed', N'Momo'),
    (14, 4, N'2026-05-09 14:35:07.8600000', 1799700, N'Completed', N'Momo'),
    (15, 4, N'2026-04-29 14:35:07.8600000', 649800, N'Completed', N'Momo'),
    (16, 4, N'2026-04-21 14:35:07.8600000', 499800, N'Pending', N'Wallet'),
    (17, 5, N'2026-04-01 14:35:07.8600000', 879800, N'Completed', N'Momo'),
    (18, 5, N'2026-02-23 14:35:07.8600000', 749700, N'Cancelled', N'Wallet');
    SET IDENTITY_INSERT Orders OFF;
END
GO

-- ============================================================================
-- 16. ORDER DETAILS (35 items)
-- ============================================================================
IF NOT EXISTS (SELECT 1 FROM OrderDetails WHERE Id = 1)
BEGIN
    SET IDENTITY_INSERT OrderDetails ON;
    INSERT INTO OrderDetails (Id, OrderId, GameId, Quantity, UnitPrice) VALUES
    (1, 1, 63, 1, 799900),
    (2, 1, 18, 1, 399900),
    (3, 2, 23, 1, 199900),
    (4, 2, 21, 1, 1199000),
    (5, 2, 5, 1, 299900),
    (6, 3, 61, 1, 799900),
    (7, 3, 62, 1, 1199000),
    (8, 4, 66, 1, 299900),
    (9, 4, 31, 1, 1199000),
    (10, 5, 15, 1, 49900),
    (11, 5, 28, 1, 1199000),
    (12, 6, 8, 1, 1199000),
    (13, 7, 15, 1, 49900),
    (14, 8, 9, 1, 1199000),
    (15, 9, 61, 1, 599900),
    (16, 10, 50, 1, 699900),
    (17, 10, 30, 1, 699900),
    (18, 11, 63, 1, 599900),
    (19, 11, 62, 1, 1199000),
    (20, 12, 28, 1, 1199000),
    (21, 13, 30, 1, 999000),
    (22, 14, 50, 1, 699900),
    (23, 14, 49, 1, 499900),
    (24, 14, 11, 1, 599900),
    (25, 15, 14, 1, 49900),
    (26, 15, 29, 1, 599900),
    (27, 16, 58, 1, 99900),
    (29, 16, 18, 1, 399900),
    (30, 17, 11, 1, 599900),
    (31, 17, 60, 1, 279900),
    (32, 18, 15, 1, 49900),
    (33, 18, 26, 1, 399900),
    (34, 18, 20, 1, 299900);
    SET IDENTITY_INSERT OrderDetails OFF;
END
GO

-- ============================================================================
-- 17. PAYMENTS (15 payments)
-- ============================================================================
IF NOT EXISTS (SELECT 1 FROM Payments WHERE Id = 1)
BEGIN
    SET IDENTITY_INSERT Payments ON;
    INSERT INTO Payments (Id, OrderId, Amount, PaymentMethod, Status, TransactionId, Note, PaidAt, CreatedAt) VALUES
    (1, 1, 929700, N'Wallet', N'Completed', N'TXN000001', N'Payment for Order #1', N'2026-03-21 14:36:30.9000000', N'2026-03-21 14:36:30.9000000'),
    (2, 2, 699900, N'Wallet', N'Pending', N'TXN000002', NULL, N'2026-05-14 14:36:30.9000000', N'2026-05-14 14:36:30.9000000'),
    (3, 3, 1199000, N'Momo', N'Completed', N'TXN000003', NULL, N'2026-02-26 14:36:30.9000000', N'2026-02-26 14:36:30.9000000'),
    (4, 4, 1598800, N'VnPay', N'Completed', N'TXN000004', N'Payment for Order #4', N'2026-05-16 14:36:30.9000000', N'2026-05-16 14:36:30.9000000'),
    (5, 5, 699900, N'Momo', N'Completed', N'TXN000005', NULL, N'2026-04-28 14:36:30.9000000', N'2026-04-28 14:36:30.9000000'),
    (6, 6, 399900, N'Wallet', N'Completed', N'TXN000006', NULL, N'2026-04-06 14:36:30.9000000', N'2026-04-06 14:36:30.9000000'),
    (7, 7, 1199800, N'Wallet', N'Completed', N'TXN000007', N'Payment for Order #7', N'2026-05-27 14:36:30.9000000', N'2026-05-27 14:36:30.9000000'),
    (8, 9, 729700, N'VnPay', N'Completed', N'TXN000008', NULL, N'2026-02-19 14:36:30.9000000', N'2026-02-19 14:36:30.9000000'),
    (9, 10, 1199000, N'Wallet', N'Completed', N'TXN000009', NULL, N'2026-03-14 14:36:30.9000000', N'2026-03-14 14:36:30.9000000'),
    (10, 11, 699900, N'Momo', N'Completed', N'TXN000010', N'Payment for Order #11', N'2026-03-15 14:36:30.9000000', N'2026-03-15 14:36:30.9000000'),
    (11, 12, 899800, N'Momo', N'Completed', N'TXN000011', NULL, N'2026-02-17 14:36:30.9000000', N'2026-02-17 14:36:30.9000000'),
    (12, 13, 799800, N'VnPay', N'Completed', N'TXN000012', NULL, N'2026-05-08 14:36:30.9000000', N'2026-05-08 14:36:30.9000000'),
    (13, 14, 499900, N'VnPay', N'Pending', N'TXN000013', N'Payment for Order #14', N'2026-03-31 14:36:30.9000000', N'2026-03-31 14:36:30.9000000'),
    (14, 15, 949800, N'VnPay', N'Completed', N'TXN000014', NULL, N'2026-05-27 14:36:30.9000000', N'2026-05-27 14:36:30.9000000');
    SET IDENTITY_INSERT Payments OFF;
END
GO

-- ============================================================================
-- 18. LIBRARIES (24 entries)
-- ============================================================================
IF NOT EXISTS (SELECT 1 FROM Libraries WHERE Id = 1)
BEGIN
    SET IDENTITY_INSERT Libraries ON;
    INSERT INTO Libraries (Id, UserId, GameId, GameKeyId, AcquiredAt, LastPlayedAt, TotalPlayTime) VALUES
    (1, 1, 32, NULL, N'2026-03-21 14:36:30.9233333', N'2026-03-21 14:36:30.9233333', 63),
    (2, 1, 29, NULL, N'2026-03-21 14:36:30.9233333', N'2026-03-21 14:36:30.9233333', 716),
    (3, 1, 16, NULL, N'2026-03-21 14:36:30.9233333', N'2026-03-21 14:36:30.9233333', 1482),
    (4, 2, 6, NULL, N'2026-02-26 14:36:30.9233333', N'2026-02-26 14:36:30.9233333', 4110),
    (5, 2, 14, NULL, N'2026-05-16 14:36:30.9233333', N'2026-05-24 14:36:30.9233333', 300),
    (7, 2, 64, NULL, N'2026-05-16 14:36:30.9233333', N'2026-05-16 14:36:30.9233333', 367),
    (8, 2, 20, NULL, N'2026-05-16 14:36:30.9233333', N'2026-05-28 14:36:30.9233333', 1111),
    (9, 2, 67, NULL, N'2026-04-28 14:36:30.9233333', N'2026-06-06 14:36:30.9233333', 3067),
    (10, 2, 18, NULL, N'2026-04-06 14:36:30.9233333', N'2026-04-06 14:36:30.9233333', 674),
    (11, 3, 54, NULL, N'2026-05-27 14:36:30.9233333', N'2026-06-05 14:36:30.9233333', 3169),
    (12, 3, 63, NULL, N'2026-05-27 14:36:30.9233333', N'2026-06-06 14:36:30.9233333', 1229),
    (13, 3, 28, NULL, N'2026-02-19 14:36:30.9233333', N'2026-05-15 14:36:30.9233333', 4024),
    (14, 3, 16, NULL, N'2026-02-19 14:36:30.9233333', N'2026-02-19 14:36:30.9233333', 4441),
    (15, 3, 14, NULL, N'2026-02-19 14:36:30.9233333', N'2026-03-06 14:36:30.9233333', 1502),
    (16, 4, 29, NULL, N'2026-03-14 14:36:30.9233333', N'2026-04-13 14:36:30.9233333', 4359),
    (17, 4, 50, NULL, N'2026-03-15 14:36:30.9233333', N'2026-03-15 14:36:30.9233333', 1991),
    (18, 5, 59, NULL, N'2026-02-17 14:36:30.9233333', N'2026-03-03 14:36:30.9233333', 562),
    (19, 5, 53, NULL, N'2026-02-17 14:36:30.9233333', N'2026-03-08 14:36:30.9233333', 25),
    (20, 5, 51, NULL, N'2026-05-08 14:36:30.9233333', N'2026-05-27 14:36:30.9233333', 306),
    (21, 5, 26, NULL, N'2026-05-08 14:36:30.9233333', N'2026-05-11 14:36:30.9233333', 4611),
    (22, 5, 8, NULL, N'2026-05-27 14:36:30.9233333', N'2026-06-07 14:36:30.9233333', 4495),
    (23, 5, 15, NULL, N'2026-05-27 14:36:30.9233333', N'2026-05-27 14:36:30.9233333', 1993);
    SET IDENTITY_INSERT Libraries OFF;
END
GO

-- ============================================================================
-- 19. NOTIFICATIONS (17 notifications)
-- ============================================================================
IF NOT EXISTS (SELECT 1 FROM Notifications WHERE Id = 1)
BEGIN
    SET IDENTITY_INSERT Notifications ON;
    INSERT INTO Notifications (Id, UserId, Title, Message, Link, IsRead, CreatedAt) VALUES
    (1, 1, N'Order #1 Completed', N'Your order #1 has been completed. Thank you for your purchase!', N'/orders/1', 0, N'2026-03-21 14:36:30.9933333'),
    (2, 2, N'Order #3 Completed', N'Your order #3 has been completed. Thank you for your purchase!', N'/orders/3', 0, N'2026-02-26 14:36:30.9933333'),
    (3, 2, N'Order #4 Completed', N'Your order #4 has been completed. Thank you for your purchase!', N'/orders/4', 0, N'2026-05-16 14:36:30.9933333'),
    (4, 2, N'Order #5 Completed', N'Your order #5 has been completed. Thank you for your purchase!', N'/orders/5', 0, N'2026-04-28 14:36:30.9933333'),
    (5, 2, N'Order #6 Completed', N'Your order #6 has been completed. Thank you for your purchase!', N'/orders/6', 0, N'2026-04-06 14:36:30.9933333'),
    (6, 3, N'Order #7 Completed', N'Your order #7 has been completed. Thank you for your purchase!', N'/orders/7', 0, N'2026-05-27 14:36:30.9933333'),
    (7, 3, N'Order #9 Completed', N'Your order #9 has been completed. Thank you for your purchase!', N'/orders/9', 0, N'2026-02-19 14:36:30.9933333'),
    (8, 4, N'Order #10 Completed', N'Your order #10 has been completed. Thank you for your purchase!', N'/orders/10', 0, N'2026-03-14 14:36:30.9933333'),
    (9, 4, N'Order #11 Completed', N'Your order #11 has been completed. Thank you for your purchase!', N'/orders/11', 0, N'2026-03-15 14:36:30.9933333'),
    (10, 5, N'Order #12 Completed', N'Your order #12 has been completed. Thank you for your purchase!', N'/orders/12', 0, N'2026-02-17 14:36:30.9933333'),
    (11, 5, N'Order #13 Completed', N'Your order #13 has been completed. Thank you for your purchase!', N'/orders/13', 0, N'2026-05-08 14:36:30.9933333'),
    (12, 5, N'Order #15 Completed', N'Your order #15 has been completed. Thank you for your purchase!', N'/orders/15', 0, N'2026-05-27 14:36:30.9933333'),
    (13, 2, N'Welcome to GameStore!', N'Thank you for joining GameStore! Start building your game library today.', NULL, 0, N'2025-12-13 14:36:30.9933333'),
    (14, 3, N'Welcome to GameStore!', N'Thank you for joining GameStore! Start building your game library today.', NULL, 0, N'2026-01-12 14:36:30.9933333'),
    (15, 4, N'Welcome to GameStore!', N'Thank you for joining GameStore! Start building your game library today.', NULL, 0, N'2026-02-11 14:36:30.9933333'),
    (16, 5, N'Welcome to GameStore!', N'Thank you for joining GameStore! Start building your game library today.', NULL, 0, N'2026-03-13 14:36:30.9933333');
    SET IDENTITY_INSERT Notifications OFF;
END
GO

-- ============================================================================
-- 20. Update GameKeys - mark keys as used for completed orders
-- ============================================================================
UPDATE gk
SET gk.IsUsed = 1,
    gk.OrderDetailId = od.Id,
    gk.UsedAt = o.OrderDate
FROM GameKeys gk
INNER JOIN OrderDetails od ON od.GameId = gk.GameId
INNER JOIN Orders o ON o.Id = od.OrderId
WHERE o.Status = N'Completed'
  AND gk.IsUsed = 0
  AND gk.Id = (SELECT TOP 1 gk2.Id FROM GameKeys gk2 WHERE gk2.GameId = gk.GameId AND gk2.IsUsed = 0 ORDER BY gk2.Id)
GO

-- TOTAL: 25 wishlists, 19 orders, 35 details,
--        15 payments, 24 libraries, 17 notifications
--        17


-- ============================================================================

-- ============================================================================
-- 14. EXTRA GAMES (IDs 69-83: 15 paid Steam games)
-- ============================================================================
SET IDENTITY_INSERT Games ON;
    INSERT INTO Games (Id, Title, Description, Price, Developer, Publisher, ReleaseDate,
        CoverImageUrl, Screenshots, TotalSales, Rating, RatingCount, IsActive, CreatedAt,
        MinimumOS, MinimumProcessor, MinimumMemory, MinimumGraphics, MinimumStorage, TrailerUrl)
    VALUES
    -- Portal 2 (AppID: 620)
    (69,
        N'Portal 2',
        N'Portal 2 draws from the award-winning formula of innovative gameplay, story, and music that earned the original Portal over 70 industry accolades. The single-player portion introduces a cast of dynamic new characters, a host of fresh puzzle elements, and a much larger set of devious test chambers.',
        142000, N'Valve', N'Valve', '2011-04-18',
        'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/620/header.jpg',
        '[]', 0, 4.5, 0, 1, GETUTCDATE(),
        N'Windows 7 / Vista / XP', N'3.0 GHz P4, Dual Core 2.0', N'2 GB RAM', N'128 MB or more with Pixel Shader 2.0b support', N'8 GB', '') ,

    -- DOOM (AppID: 379720)
    (70,
        N'DOOM',
        N'Hell has invaded Earth in this critically acclaimed reboot of the iconic first-person shooter series. Rip and tear through demon hordes with powerful weapons, brutal glory kills, and a metal soundtrack.',
        450000, N'id Software', N'Bethesda Softworks', '2016-05-12',
        'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/379720/header.jpg',
        '[]', 0, 4.5, 0, 1, GETUTCDATE(),
        N'Windows 7/8.1/10 64-bit', N'Intel Core i5-2400 or AMD FX-8320', N'8 GB RAM', N'NVIDIA GeForce GTX 670 or AMD Radeon HD 7870', N'55 GB', '') ,

    -- Disco Elysium - The Final Cut (AppID: 632470)
    (71,
        N'Disco Elysium - The Final Cut',
        N'Disco Elysium is a groundbreaking open world role playing game. You''re a detective who has lost your memory. Solve a murder case while navigating a deeply philosophical world with a unique skill system.',
        495000, N'ZA/UM', N'ZA/UM', '2019-10-15',
        'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/632470/header.jpg',
        '[]', 0, 4.5, 0, 1, GETUTCDATE(),
        N'Windows 7 or 8 64-bit', N'Intel Core i5-750 or AMD Phenom II X4', N'4 GB RAM', N'NVIDIA GeForce GTX 460 or AMD Radeon HD 5770', N'20 GB', '') ,

    -- It Takes Two (AppID: 1426210)
    (72,
        N'It Takes Two',
        N'Embark on the craziest journey of your life in It Takes Two. Invite a friend to join for free with Friend''s Pass and work together across a huge variety of joyful gameplay challenges. A pure co-op adventure.',
        790000, N'Hazelight Studios', N'Electronic Arts', '2021-03-25',
        'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1426210/header.jpg',
        '[]', 0, 4.5, 0, 1, GETUTCDATE(),
        N'Windows 10 64-bit', N'Intel Core i3-2100T or AMD FX 6100', N'8 GB RAM', N'NVIDIA GeForce GTX 660 or AMD Radeon HD 7850', N'50 GB', '') ,

    -- Outer Wilds (AppID: 753640)
    (73,
        N'Outer Wilds',
        N'Outer Wilds is an open world mystery about a solar system trapped in an endless time loop. Explore a handmade world and uncover the secrets of a long-dead alien civilization in this award-winning exploration game.',
        319000, N'Mobius Digital', N'Annapurna Interactive', '2020-06-18',
        'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/753640/header.jpg',
        '[]', 0, 4.5, 0, 1, GETUTCDATE(),
        N'Windows 7 64-bit', N'Intel Core i5-2300 or AMD FX-4350', N'6 GB RAM', N'NVIDIA GeForce GTX 560 or AMD Radeon HD 6870', N'8 GB', '') ,

    -- Forza Horizon 5 (AppID: 1551360)
    (74,
        N'Forza Horizon 5',
        N'Explore the vibrant open world landscapes of Mexico with limitless fun driving action in the world''s greatest cars. Lead breathtaking expeditions across diverse landscapes in the ultimate Horizon experience.',
        990000, N'Playground Games', N'Xbox Game Studios', '2021-11-08',
        'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1551360/header.jpg',
        '[]', 0, 4.5, 0, 1, GETUTCDATE(),
        N'Windows 10 64-bit', N'Intel Core i5-4460 or AMD Ryzen 3 1200', N'8 GB RAM', N'NVIDIA GeForce GTX 970 or AMD Radeon RX 470', N'110 GB', '') ,

    -- Street Fighter 6 (AppID: 1364780)
    (75,
        N'Street Fighter 6',
        N'The evolution of fighting games is here! Street Fighter 6 expands the legendary franchise with three distinct modes: Fighting Ground, World Tour, and Battle Hub. Experience cutting-edge graphics and a new combat system.',
        794000, N'CAPCOM Co., Ltd.', N'CAPCOM Co., Ltd.', '2023-06-01',
        'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1364780/header.jpg',
        '[]', 0, 4.5, 0, 1, GETUTCDATE(),
        N'Windows 10 64-bit', N'Intel Core i5-7500 or AMD Ryzen 3 1200', N'8 GB RAM', N'NVIDIA GeForce GTX 1060 or AMD Radeon RX 580', N'25 GB', '') ,

    -- Persona 5 Royal (AppID: 1687950)
    (76,
        N'Persona 5 Royal',
        N'Prepare for the award-winning RPG experience in this definitive edition of Persona 5 Royal. Don the mask of a Phantom Thief and change the world in this critically acclaimed JRPG featuring downloadable content included.',
        999000, N'ATLUS', N'SEGA', '2022-10-20',
        'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1687950/header.jpg',
        '[]', 0, 4.5, 0, 1, GETUTCDATE(),
        N'Windows 10 64-bit', N'Intel Core i5-2300 or AMD FX-4350', N'8 GB RAM', N'NVIDIA GeForce GTX 660 or AMD Radeon HD 7870', N'40 GB', '') ,

    -- Hades II (AppID: 1145350)
    (77,
        N'Hades II',
        N'Battle beyond the Underworld using dark sorcery to take on the Titan of Time in this bewitching sequel to the award-winning rogue-like dungeon crawler. Unleash powerful new abilities in this immersive action RPG.',
        385000, N'Supergiant Games', N'Supergiant Games', '2025-09-25',
        'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1145350/header.jpg',
        '[]', 0, 4.5, 0, 1, GETUTCDATE(),
        N'Windows 10 64-bit', N'Intel Core i5-2300 or AMD FX-4350', N'8 GB RAM', N'NVIDIA GeForce GTX 660 or AMD Radeon HD 7870', N'10 GB', '') ,

    -- Kingdom Come: Deliverance II (AppID: 1771300)
    (78,
        N'Kingdom Come: Deliverance II',
        N'Kingdom Come: Deliverance II is a story-driven action RPG set in 15th century Bohemia. Experience an epic medieval adventure through a stunningly beautiful open world as Henry of Skalitz.',
        999000, N'Warhorse Studios', N'Deep Silver', '2025-02-04',
        'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1771300/header.jpg',
        '[]', 0, 4.5, 0, 1, GETUTCDATE(),
        N'Windows 10 64-bit', N'Intel Core i5-8400 or AMD Ryzen 5 2600', N'16 GB RAM', N'NVIDIA GeForce GTX 1060 or AMD Radeon RX 580', N'100 GB', '') ,

    -- A Plague Tale: Requiem (AppID: 1182900)
    (79,
        N'A Plague Tale: Requiem',
        N'Far across the sea, an island calls. Embark on a heart-wrenching journey into a brutal breathtaking world in this award-winning narrative-driven action-adventure sequel. Survive a medieval plague with new tools and abilities.',
        700000, N'Asobo Studio', N'Focus Entertainment', '2022-10-17',
        'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1182900/header.jpg',
        '[]', 0, 4.5, 0, 1, GETUTCDATE(),
        N'Windows 10 64-bit', N'Intel Core i5-4690 or AMD Ryzen 3 1200', N'16 GB RAM', N'NVIDIA GeForce GTX 970 or AMD Radeon RX 590', N'55 GB', '') ,

    -- Starfield (AppID: 1716740)
    (80,
        N'Starfield',
        N'Starfield is the first new universe in over 25 years from Bethesda Game Studios. Create your character and explore the vast reaches of space on an epic journey to answer humanity''s greatest mystery.',
        999000, N'Bethesda Game Studios', N'Bethesda Softworks', '2023-09-05',
        'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1716740/header.jpg',
        '[]', 0, 4.5, 0, 1, GETUTCDATE(),
        N'Windows 10 64-bit', N'Intel Core i5-8400 or AMD Ryzen 5 2600', N'16 GB RAM', N'NVIDIA GeForce GTX 1070 Ti or AMD Radeon RX 5700', N'125 GB', '') ,

    -- FINAL FANTASY VII REMAKE INTERGRADE (AppID: 1462040)
    (81,
        N'FINAL FANTASY VII REMAKE INTERGRADE',
        N'Cloud Strife joins the resistance group Avalanche to fight the megacorporation Shinra. This reimagining of the beloved classic features thrilling real-time combat and stunning visuals.',
        990000, N'Square Enix', N'Square Enix', '2022-06-17',
        'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1462040/header.jpg',
        '[]', 0, 4.5, 0, 1, GETUTCDATE(),
        N'Windows 10 64-bit', N'Intel Core i5-3330 or AMD FX-8350', N'8 GB RAM', N'NVIDIA GeForce GTX 1080 or AMD Radeon RX 5700', N'100 GB', '') ,

    -- Ghost of Tsushima DIRECTOR'S CUT (AppID: 2215430)
    (82,
        N'Ghost of Tsushima DIRECTOR''S CUT',
        N'In the year 1274, the Mongol empire invades Tsushima Island. Fight through the open world of feudal Japan as the last remaining samurai, Jin Sakai, in this stunning action-adventure epic.',
        999000, N'Sucker Punch Productions', N'PlayStation Publishing LLC', '2024-05-16',
        'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2215430/header.jpg',
        '[]', 0, 4.5, 0, 1, GETUTCDATE(),
        N'Windows 10 64-bit', N'Intel Core i5-8600 or AMD Ryzen 5 3600', N'16 GB RAM', N'NVIDIA GeForce GTX 1060 or AMD Radeon RX 580', N'75 GB', '') ,

    -- SILENT HILL 2 (AppID: 2124490)
    (83,
        N'SILENT HILL 2',
        N'A remake of the classic survival horror game. James Sunderland receives a letter from his deceased wife leading him to Silent Hill. Confront twisted creatures and uncover dark secrets in this psychological horror masterpiece.',
        1199000, N'Bloober Team SA', N'KONAMI', '2024-10-07',
        'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2124490/header.jpg',
        '[]', 0, 4.5, 0, 1, GETUTCDATE(),
        N'Windows 10 64-bit', N'Intel Core i5-8400 or AMD Ryzen 5 2600', N'16 GB RAM', N'NVIDIA GeForce GTX 1070 Ti or AMD Radeon RX 5700', N'50 GB', '') ;

    SET IDENTITY_INSERT Games OFF;
GO

-- ============================================================================
-- 15. EXTRA GAME GENRES (for games 69-83)
-- ============================================================================
SET IDENTITY_INSERT GameGenres ON;
    INSERT INTO GameGenres (Id, GameId, GenreId) VALUES
    (236, 69, 1),
    (237, 69, 9),
    (238, 69, 29),
    (239, 69, 30),
    (240, 70, 1),
    (241, 70, 6),
    (242, 70, 30),
    (243, 71, 2),
    (244, 71, 5),
    (245, 71, 7),
    (246, 71, 35),
    (247, 72, 1),
    (248, 72, 7),
    (249, 72, 29),
    (250, 72, 33),
    (251, 73, 5),
    (252, 73, 7),
    (253, 73, 9),
    (254, 73, 12),
    (255, 74, 4),
    (256, 74, 12),
    (257, 74, 14),
    (258, 74, 31),
    (259, 75, 1),
    (260, 75, 15),
    (261, 75, 31),
    (262, 76, 2),
    (263, 76, 7),
    (264, 76, 18),
    (265, 76, 35),
    (266, 77, 1),
    (267, 77, 2),
    (268, 77, 5),
    (269, 77, 25),
    (270, 78, 1),
    (271, 78, 2),
    (272, 78, 7),
    (273, 78, 12),
    (274, 79, 1),
    (275, 79, 7),
    (276, 79, 10),
    (277, 79, 35),
    (278, 80, 1),
    (279, 80, 2),
    (280, 80, 12),
    (281, 80, 30),
    (282, 81, 1),
    (283, 81, 2),
    (284, 81, 7),
    (285, 81, 35),
    (286, 82, 1),
    (287, 82, 7),
    (288, 82, 12),
    (289, 82, 13),
    (290, 83, 1),
    (291, 83, 7),
    (292, 83, 10),
    (293, 83, 30);
    SET IDENTITY_INSERT GameGenres OFF;
GO

-- ============================================================================
-- 16. EXTRA GAME KEYS (2 keys per game, for games 69-83)
-- ============================================================================
SET IDENTITY_INSERT GameKeys ON;
    INSERT INTO GameKeys (Id, GameId, KeyCode, IsUsed, CreatedAt) VALUES
    (132, 69, N'PRTL-A1B2C-3D4E5-F6G7H8-I9J0K1', 0, GETUTCDATE()),
    (133, 69, N'PRTL-K2L3M-4N5P6-Q7R8S9-T0U1V2', 0, GETUTCDATE()),
    (134, 70, N'DOOM-A1B2C-3D4E5-F6G7H8-I9J0K1', 0, GETUTCDATE()),
    (135, 70, N'DOOM-K2L3M-4N5P6-Q7R8S9-T0U1V2', 0, GETUTCDATE()),
    (136, 71, N'DSCE-A1B2C-3D4E5-F6G7H8-I9J0K1', 0, GETUTCDATE()),
    (137, 71, N'DSCE-K2L3M-4N5P6-Q7R8S9-T0U1V2', 0, GETUTCDATE()),
    (138, 72, N'IT2-A1B2C-3D4E5-F6G7H8-I9J0K1', 0, GETUTCDATE()),
    (139, 72, N'IT2-K2L3M-4N5P6-Q7R8S9-T0U1V2', 0, GETUTCDATE()),
    (140, 73, N'OWLD-A1B2C-3D4E5-F6G7H8-I9J0K1', 0, GETUTCDATE()),
    (141, 73, N'OWLD-K2L3M-4N5P6-Q7R8S9-T0U1V2', 0, GETUTCDATE()),
    (142, 74, N'FH5-A1B2C-3D4E5-F6G7H8-I9J0K1', 0, GETUTCDATE()),
    (143, 74, N'FH5-K2L3M-4N5P6-Q7R8S9-T0U1V2', 0, GETUTCDATE()),
    (144, 75, N'SF6-A1B2C-3D4E5-F6G7H8-I9J0K1', 0, GETUTCDATE()),
    (145, 75, N'SF6-K2L3M-4N5P6-Q7R8S9-T0U1V2', 0, GETUTCDATE()),
    (146, 76, N'P5R-A1B2C-3D4E5-F6G7H8-I9J0K1', 0, GETUTCDATE()),
    (147, 76, N'P5R-K2L3M-4N5P6-Q7R8S9-T0U1V2', 0, GETUTCDATE()),
    (148, 77, N'HAD2-A1B2C-3D4E5-F6G7H8-I9J0K1', 0, GETUTCDATE()),
    (149, 77, N'HAD2-K2L3M-4N5P6-Q7R8S9-T0U1V2', 0, GETUTCDATE()),
    (150, 78, N'KCD2-A1B2C-3D4E5-F6G7H8-I9J0K1', 0, GETUTCDATE()),
    (151, 78, N'KCD2-K2L3M-4N5P6-Q7R8S9-T0U1V2', 0, GETUTCDATE()),
    (152, 79, N'PLAG-A1B2C-3D4E5-F6G7H8-I9J0K1', 0, GETUTCDATE()),
    (153, 79, N'PLAG-K2L3M-4N5P6-Q7R8S9-T0U1V2', 0, GETUTCDATE()),
    (154, 80, N'STRF-A1B2C-3D4E5-F6G7H8-I9J0K1', 0, GETUTCDATE()),
    (155, 80, N'STRF-K2L3M-4N5P6-Q7R8S9-T0U1V2', 0, GETUTCDATE()),
    (156, 81, N'FF7R-A1B2C-3D4E5-F6G7H8-I9J0K1', 0, GETUTCDATE()),
    (157, 81, N'FF7R-K2L3M-4N5P6-Q7R8S9-T0U1V2', 0, GETUTCDATE()),
    (158, 82, N'GOST-A1B2C-3D4E5-F6G7H8-I9J0K1', 0, GETUTCDATE()),
    (159, 82, N'GOST-K2L3M-4N5P6-Q7R8S9-T0U1V2', 0, GETUTCDATE()),
    (160, 83, N'SH2-A1B2C-3D4E5-F6G7H8-I9J0K1', 0, GETUTCDATE()),
    (161, 83, N'SH2-K2L3M-4N5P6-Q7R8S9-T0U1V2', 0, GETUTCDATE());
    SET IDENTITY_INSERT GameKeys OFF;
GO

-- ============================================================================
-- 17. DISCOUNT PRICES FOR EXTRA GAMES
-- ============================================================================
    UPDATE Games SET DiscountPrice = 99000 WHERE Id = 69;   -- Portal 2
    UPDATE Games SET DiscountPrice = 279900 WHERE Id = 70;   -- DOOM
    UPDATE Games SET DiscountPrice = 349900 WHERE Id = 71;   -- Disco Elysium - The Final Cut
    UPDATE Games SET DiscountPrice = 499000 WHERE Id = 72;   -- It Takes Two
    UPDATE Games SET DiscountPrice = 199000 WHERE Id = 73;   -- Outer Wilds
    UPDATE Games SET DiscountPrice = 699000 WHERE Id = 74;   -- Forza Horizon 5
    UPDATE Games SET DiscountPrice = 599000 WHERE Id = 75;   -- Street Fighter 6
    UPDATE Games SET DiscountPrice = 699000 WHERE Id = 76;   -- Persona 5 Royal
    UPDATE Games SET DiscountPrice = 249000 WHERE Id = 77;   -- Hades II
    UPDATE Games SET DiscountPrice = 799000 WHERE Id = 78;   -- Kingdom Come: Deliverance II
    UPDATE Games SET DiscountPrice = 499000 WHERE Id = 79;   -- A Plague Tale: Requiem
    UPDATE Games SET DiscountPrice = 799000 WHERE Id = 80;   -- Starfield
    UPDATE Games SET DiscountPrice = 699000 WHERE Id = 81;   -- FINAL FANTASY VII REMAKE INTERGRADE
    UPDATE Games SET DiscountPrice = 699000 WHERE Id = 82;   -- Ghost of Tsushima DIRECTOR'S CUT
    UPDATE Games SET DiscountPrice = 899000 WHERE Id = 83;   -- SILENT HILL 2
GO

-- ============================================================================
-- 18. SCREENSHOTS URLs FOR EXTRA GAMES
-- ============================================================================
    -- Portal 2
    UPDATE Games SET Screenshots = '["https://cdn.cloudflare.steamstatic.com/steam/apps/620/ss_1.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/620/ss_2.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/620/ss_3.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/620/ss_4.jpg"]'
    WHERE Id = 69;
    -- DOOM
    UPDATE Games SET Screenshots = '["https://cdn.cloudflare.steamstatic.com/steam/apps/379720/ss_1.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/379720/ss_2.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/379720/ss_3.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/379720/ss_4.jpg"]'
    WHERE Id = 70;
    -- Disco Elysium - The Final Cut
    UPDATE Games SET Screenshots = '["https://cdn.cloudflare.steamstatic.com/steam/apps/632470/ss_1.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/632470/ss_2.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/632470/ss_3.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/632470/ss_4.jpg"]'
    WHERE Id = 71;
    -- It Takes Two
    UPDATE Games SET Screenshots = '["https://cdn.cloudflare.steamstatic.com/steam/apps/1426210/ss_1.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/1426210/ss_2.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/1426210/ss_3.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/1426210/ss_4.jpg"]'
    WHERE Id = 72;
    -- Outer Wilds
    UPDATE Games SET Screenshots = '["https://cdn.cloudflare.steamstatic.com/steam/apps/753640/ss_1.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/753640/ss_2.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/753640/ss_3.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/753640/ss_4.jpg"]'
    WHERE Id = 73;
    -- Forza Horizon 5
    UPDATE Games SET Screenshots = '["https://cdn.cloudflare.steamstatic.com/steam/apps/1551360/ss_1.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/1551360/ss_2.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/1551360/ss_3.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/1551360/ss_4.jpg"]'
    WHERE Id = 74;
    -- Street Fighter 6
    UPDATE Games SET Screenshots = '["https://cdn.cloudflare.steamstatic.com/steam/apps/1364780/ss_1.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/1364780/ss_2.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/1364780/ss_3.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/1364780/ss_4.jpg"]'
    WHERE Id = 75;
    -- Persona 5 Royal
    UPDATE Games SET Screenshots = '["https://cdn.cloudflare.steamstatic.com/steam/apps/1687950/ss_1.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/1687950/ss_2.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/1687950/ss_3.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/1687950/ss_4.jpg"]'
    WHERE Id = 76;
    -- Hades II
    UPDATE Games SET Screenshots = '["https://cdn.cloudflare.steamstatic.com/steam/apps/1145350/ss_1.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/1145350/ss_2.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/1145350/ss_3.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/1145350/ss_4.jpg"]'
    WHERE Id = 77;
    -- Kingdom Come: Deliverance II
    UPDATE Games SET Screenshots = '["https://cdn.cloudflare.steamstatic.com/steam/apps/1771300/ss_1.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/1771300/ss_2.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/1771300/ss_3.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/1771300/ss_4.jpg"]'
    WHERE Id = 78;
    -- A Plague Tale: Requiem
    UPDATE Games SET Screenshots = '["https://cdn.cloudflare.steamstatic.com/steam/apps/1182900/ss_1.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/1182900/ss_2.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/1182900/ss_3.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/1182900/ss_4.jpg"]'
    WHERE Id = 79;
    -- Starfield
    UPDATE Games SET Screenshots = '["https://cdn.cloudflare.steamstatic.com/steam/apps/1716740/ss_1.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/1716740/ss_2.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/1716740/ss_3.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/1716740/ss_4.jpg"]'
    WHERE Id = 80;
    -- FINAL FANTASY VII REMAKE INTERGRADE
    UPDATE Games SET Screenshots = '["https://cdn.cloudflare.steamstatic.com/steam/apps/1462040/ss_1.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/1462040/ss_2.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/1462040/ss_3.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/1462040/ss_4.jpg"]'
    WHERE Id = 81;
    -- Ghost of Tsushima DIRECTOR'S CUT
    UPDATE Games SET Screenshots = '["https://cdn.cloudflare.steamstatic.com/steam/apps/2215430/ss_1.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/2215430/ss_2.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/2215430/ss_3.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/2215430/ss_4.jpg"]'
    WHERE Id = 82;
    -- SILENT HILL 2
    UPDATE Games SET Screenshots = '["https://cdn.cloudflare.steamstatic.com/steam/apps/2124490/ss_1.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/2124490/ss_2.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/2124490/ss_3.jpg","https://cdn.cloudflare.steamstatic.com/steam/apps/2124490/ss_4.jpg"]'
    WHERE Id = 83;
GO

-- ============================================================================
-- 19. REVIEWS FOR EXTRA GAMES (15 reviews, 1 per game for games 69-83)
-- ============================================================================
IF NOT EXISTS (SELECT 1 FROM Reviews WHERE Id = 31)
BEGIN
    SET IDENTITY_INSERT Reviews ON;
    INSERT INTO Reviews (Id, UserId, GameId, Rating, Content, IsRecommended, HelpfulCount, CreatedAt, UpdatedAt)
    VALUES
    (31, 1, 69, 5, N'Portal 2 is one of the best puzzle games ever made. The co-op mode is brilliant and the writing is hilarious. Valve at their finest!', 1, 15, DATEADD(DAY, -10, GETUTCDATE()), DATEADD(DAY, -10, GETUTCDATE())),
    -- Portal 2
    (32, 3, 70, 5, N'DOOM is pure unadulterated action. No cover shooting no regenerating health - just you and demons. The soundtrack is incredible!', 1, 17, DATEADD(DAY, -13, GETUTCDATE()), DATEADD(DAY, -13, GETUTCDATE())),
    -- DOOM
    (33, 5, 71, 5, N'Disco Elysium is a masterpiece of storytelling. The writing is phenomenal the world is rich and every choice matters deeply.', 1, 19, DATEADD(DAY, -16, GETUTCDATE()), DATEADD(DAY, -16, GETUTCDATE())),
    -- Disco Elysium - The Final Cut
    (34, 2, 72, 5, N'It Takes Two is a co-op masterpiece. Every level introduces new mechanics and the story is genuinely touching. Play with a friend!', 1, 21, DATEADD(DAY, -19, GETUTCDATE()), DATEADD(DAY, -19, GETUTCDATE())),
    -- It Takes Two
    (35, 4, 73, 5, N'Outer Wilds is a once-in-a-lifetime experience. Best to go in knowing nothing - just explore and discover. An absolute gem.', 1, 23, DATEADD(DAY, -22, GETUTCDATE()), DATEADD(DAY, -22, GETUTCDATE())),
    -- Outer Wilds
    (36, 1, 74, 4, N'Forza Horizon 5 is the ultimate open-world racing game. Mexico is gorgeous the car list is massive and the driving feels perfect.', 1, 25, DATEADD(DAY, -25, GETUTCDATE()), DATEADD(DAY, -25, GETUTCDATE())),
    -- Forza Horizon 5
    (37, 3, 75, 5, N'Street Fighter 6 is the best fighting game package ever made. Three modes excellent netcode and deep combat system.', 1, 27, DATEADD(DAY, -28, GETUTCDATE()), DATEADD(DAY, -28, GETUTCDATE())),
    -- Street Fighter 6
    (38, 5, 76, 5, N'Persona 5 Royal is a 100+ hour JRPG masterpiece. Stylish deep and emotionally gripping. Every aspect is polished to perfection.', 1, 29, DATEADD(DAY, -31, GETUTCDATE()), DATEADD(DAY, -31, GETUTCDATE())),
    -- Persona 5 Royal
    (39, 2, 77, 4, N'Hades II builds on the original in every way. More depth more variety and that addictive loop is back better than ever.', 1, 31, DATEADD(DAY, -34, GETUTCDATE()), DATEADD(DAY, -34, GETUTCDATE())),
    -- Hades II
    (40, 4, 78, 5, N'Kingdom Come Deliverance II is an incredible medieval RPG. The world feels alive the story is engaging and the combat is rewarding.', 1, 33, DATEADD(DAY, -37, GETUTCDATE()), DATEADD(DAY, -37, GETUTCDATE())),
    -- Kingdom Come: Deliverance II
    (41, 1, 79, 4, N'A Plague Tale Requiem is a beautiful and heartbreaking journey. Stunning visuals and a story that stays with you long after credits roll.', 1, 35, DATEADD(DAY, -40, GETUTCDATE()), DATEADD(DAY, -40, GETUTCDATE())),
    -- A Plague Tale: Requiem
    (42, 3, 80, 4, N'Starfield is an ambitious space RPG with hundreds of hours of content. Ship building is fantastic and exploration is rewarding.', 1, 37, DATEADD(DAY, -43, GETUTCDATE()), DATEADD(DAY, -43, GETUTCDATE())),
    -- Starfield
    (43, 5, 81, 5, N'FFVII Remake is a stunning reimagining of a classic. The combat system is perfect the characters are beautifully realized and the music is incredible.', 1, 39, DATEADD(DAY, -46, GETUTCDATE()), DATEADD(DAY, -46, GETUTCDATE())),
    -- FINAL FANTASY VII REMAKE INTERGRADE
    (44, 2, 82, 5, N'Ghost of Tsushima is a visual masterpiece set in feudal Japan. Satisfying combat beautiful world and a compelling story.', 1, 41, DATEADD(DAY, -49, GETUTCDATE()), DATEADD(DAY, -49, GETUTCDATE())),
    -- Ghost of Tsushima DIRECTOR'S CUT
    (45, 4, 83, 5, N'Silent Hill 2 is a masterful remake that honors the original while modernizing everything. The atmosphere is suffocating and terrifying.', 1, 43, DATEADD(DAY, -52, GETUTCDATE()), DATEADD(DAY, -52, GETUTCDATE()));
    -- SILENT HILL 2
    SET IDENTITY_INSERT Reviews OFF;
END
GO