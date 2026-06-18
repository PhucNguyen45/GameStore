-- ============================================================================
-- GameStore — Demo Orders Seed (Revenue Report Demo Data)
-- !! PHẢI chạy seed_data.sql TRƯỚC file này !!
-- Bổ sung: 5 users mới, 200+ game keys, 90 orders rải đều 12 tháng 2025 + thêm 2026
-- ============================================================================

-- Kiểm tra prerequisite
IF NOT EXISTS (SELECT 1 FROM Games WHERE Id = 5)
    PRINT N'⚠️  CẢNH BÁO: Games ID 5-68 chưa tồn tại. Chạy seed_data.sql trước, sau đó chạy lại file này.';
GO

PRINT N'=== [1/6] Thêm users 6-10... ===';
IF NOT EXISTS (SELECT 1 FROM Users WHERE Id = 6)
BEGIN
    SET IDENTITY_INSERT Users ON;
    INSERT INTO Users (Id, Username, Password, Salt, DisplayName, Email, Phone, AvatarUrl, Wallet, IsActive, CreatedAt) VALUES
    (6,  N'hoangvanphuc', N'HdU1kNsl8MIkPs61DHI2mzLngf1jW7lE42s/5SUNnAE=', 0xC8EC17B860A6813152BDA71030386669,
         N'Hoàng Văn Phúc',  N'hoangvanphuc@gamestore.com',  N'0956789012', '', 1000000, 1, DATEADD(DAY,-365,GETUTCDATE())),
    (7,  N'ngothihuong',   N'HdU1kNsl8MIkPs61DHI2mzLngf1jW7lE42s/5SUNnAE=', 0xC8EC17B860A6813152BDA71030386669,
         N'Ngô Thị Hương',   N'ngothihuong@gamestore.com',   N'0967890123', '', 800000,  1, DATEADD(DAY,-300,GETUTCDATE())),
    (8,  N'buivanduc',     N'HdU1kNsl8MIkPs61DHI2mzLngf1jW7lE42s/5SUNnAE=', 0xC8EC17B860A6813152BDA71030386669,
         N'Bùi Văn Đức',     N'buivanduc@gamestore.com',     N'0978901234', '', 600000,  1, DATEADD(DAY,-250,GETUTCDATE())),
    (9,  N'doanminhthu',   N'HdU1kNsl8MIkPs61DHI2mzLngf1jW7lE42s/5SUNnAE=', 0xC8EC17B860A6813152BDA71030386669,
         N'Đoàn Minh Thu',   N'doanminhthu@gamestore.com',   N'0989012345', '', 400000,  1, DATEADD(DAY,-200,GETUTCDATE())),
    (10, N'vothiquyen',    N'HdU1kNsl8MIkPs61DHI2mzLngf1jW7lE42s/5SUNnAE=', 0xC8EC17B860A6813152BDA71030386669,
         N'Võ Thị Quyên',    N'vothiquyen@gamestore.com',    N'0990123456', '', 200000,  1, DATEADD(DAY,-150,GETUTCDATE()));
    SET IDENTITY_INSERT Users OFF;
END
GO

-- Gán role "User" (RoleId=2) cho users 2-10 nếu chưa có
INSERT INTO UserRoles (UserId, RoleId, Guid, CreatedBy, Created, ModifiedBy, Modified, IsDeleted, CreatedUser, CreatedDateTime)
SELECT u.Id, 2, NEWID(), N'seed', GETUTCDATE(), N'seed', GETUTCDATE(), 0, N'seed', GETUTCDATE()
FROM (VALUES (2),(3),(4),(5),(6),(7),(8),(9),(10)) AS u(Id)
INNER JOIN Users usr ON usr.Id = u.Id
WHERE NOT EXISTS (SELECT 1 FROM UserRoles ur WHERE ur.UserId = u.Id AND ur.RoleId = 2);
GO

-- ============================================================================
PRINT N'=== [2/6] Thêm game keys bổ sung (IDs 200-338)... ===';
SET IDENTITY_INSERT GameKeys ON;
INSERT INTO GameKeys (Id, GameId, KeyCode, IsUsed, CreatedAt)
SELECT v.Id, v.GameId, v.KeyCode, 0, GETUTCDATE()
FROM (VALUES
-- Elden Ring (6) — 12 keys
(200,6,N'ELDEN-DEMO-200-X1A2B3'),(201,6,N'ELDEN-DEMO-201-Y4C5D6'),
(202,6,N'ELDEN-DEMO-202-Z7E8F9'),(203,6,N'ELDEN-DEMO-203-W2G3H4'),
(204,6,N'ELDEN-DEMO-204-V5I6J7'),(205,6,N'ELDEN-DEMO-205-U8K9L1'),
(206,6,N'ELDEN-DEMO-206-T2M3N4'),(207,6,N'ELDEN-DEMO-207-S5P6Q7'),
(208,6,N'ELDEN-DEMO-208-R8A9B1'),(209,6,N'ELDEN-DEMO-209-Q2C3D4'),
(210,6,N'ELDEN-DEMO-210-P5E6F7'),(211,6,N'ELDEN-DEMO-211-O8G9H1'),
-- Cyberpunk 2077 (7) — 12 keys
(212,7,N'CP77-DEMO-212-N2I3J4'),(213,7,N'CP77-DEMO-213-M5K6L7'),
(214,7,N'CP77-DEMO-214-L8M9N1'),(215,7,N'CP77-DEMO-215-K2O3P4'),
(216,7,N'CP77-DEMO-216-J5Q6R7'),(217,7,N'CP77-DEMO-217-I8S9T1'),
(218,7,N'CP77-DEMO-218-H2U3V4'),(219,7,N'CP77-DEMO-219-G5W6X7'),
(220,7,N'CP77-DEMO-220-F8Y9Z1'),(221,7,N'CP77-DEMO-221-E2A3B4'),
(222,7,N'CP77-DEMO-222-D5C6D7'),(223,7,N'CP77-DEMO-223-C8E9F1'),
-- Baldur's Gate 3 (8) — 10 keys
(224,8,N'BG3-DEMO-224-B2G3H4'),(225,8,N'BG3-DEMO-225-A5I6J7'),
(226,8,N'BG3-DEMO-226-Z8K9L1'),(227,8,N'BG3-DEMO-227-Y2M3N4'),
(228,8,N'BG3-DEMO-228-X5O6P7'),(229,8,N'BG3-DEMO-229-W8Q9R1'),
(230,8,N'BG3-DEMO-230-V2S3T4'),(231,8,N'BG3-DEMO-231-U5U6V7'),
(232,8,N'BG3-DEMO-232-T8W9X1'),(233,8,N'BG3-DEMO-233-S2Y3Z4'),
-- Red Dead Redemption 2 (9) — 8 keys
(234,9,N'RDR2-DEMO-234-R5A6B7'),(235,9,N'RDR2-DEMO-235-Q8C9D1'),
(236,9,N'RDR2-DEMO-236-P2E3F4'),(237,9,N'RDR2-DEMO-237-O5G6H7'),
(238,9,N'RDR2-DEMO-238-N8I9J1'),(239,9,N'RDR2-DEMO-239-M2K3L4'),
(240,9,N'RDR2-DEMO-240-L5M6N7'),(241,9,N'RDR2-DEMO-241-K8O9P1'),
-- The Witcher 3 (10) — 5 keys
(242,10,N'W3-DEMO-242-J2Q3R4'),(243,10,N'W3-DEMO-243-I5S6T7'),
(244,10,N'W3-DEMO-244-H8U9V1'),(245,10,N'W3-DEMO-245-G2W3X4'),
(246,10,N'W3-DEMO-246-F5Y6Z7'),
-- Stardew Valley (12) — 6 keys
(247,12,N'STAR-DEMO-247-E8A9B1'),(248,12,N'STAR-DEMO-248-D2C3D4'),
(249,12,N'STAR-DEMO-249-C5E6F7'),(250,12,N'STAR-DEMO-250-B8G9H1'),
(251,12,N'STAR-DEMO-251-A2I3J4'),(252,12,N'STAR-DEMO-252-Z5K6L7'),
-- Terraria (13) — 4 keys
(253,13,N'TERR-DEMO-253-Y8M9N1'),(254,13,N'TERR-DEMO-254-X2O3P4'),
(255,13,N'TERR-DEMO-255-W5Q6R7'),(256,13,N'TERR-DEMO-256-V8S9T1'),
-- L4D2 (14) — 2 keys
(257,14,N'L4D2-DEMO-257-U2U3V4'),(258,14,N'L4D2-DEMO-258-T5W6X7'),
-- Valheim (18) — 6 keys
(259,18,N'VALH-DEMO-259-S8Y9Z1'),(260,18,N'VALH-DEMO-260-R2A3B4'),
(261,18,N'VALH-DEMO-261-Q5C6D7'),(262,18,N'VALH-DEMO-262-P8E9F1'),
(263,18,N'VALH-DEMO-263-O2G3H4'),(264,18,N'VALH-DEMO-264-N5I6J7'),
-- Hogwarts Legacy (21) — 7 keys
(265,21,N'HOGW-DEMO-265-M8K9L1'),(266,21,N'HOGW-DEMO-266-L2M3N4'),
(267,21,N'HOGW-DEMO-267-K5O6P7'),(268,21,N'HOGW-DEMO-268-J8Q9R1'),
(269,21,N'HOGW-DEMO-269-I2S3T4'),(270,21,N'HOGW-DEMO-270-H5U6V7'),
(271,21,N'HOGW-DEMO-271-G8W9X1'),
-- Dark Souls III (28) — 6 keys
(272,28,N'DS3-DEMO-272-F2Y3Z4'),(273,28,N'DS3-DEMO-273-E5A6B7'),
(274,28,N'DS3-DEMO-274-D8C9D1'),(275,28,N'DS3-DEMO-275-C2E3F4'),
(276,28,N'DS3-DEMO-276-B5G6H7'),(277,28,N'DS3-DEMO-277-A8I9J1'),
-- Sekiro (29) — 7 keys
(278,29,N'SEKI-DEMO-278-Z2K3L4'),(279,29,N'SEKI-DEMO-279-Y5M6N7'),
(280,29,N'SEKI-DEMO-280-X8O9P1'),(281,29,N'SEKI-DEMO-281-W2Q3R4'),
(282,29,N'SEKI-DEMO-282-V5S6T7'),(283,29,N'SEKI-DEMO-283-U8U9V1'),
(284,29,N'SEKI-DEMO-284-T2W3X4'),
-- God of War (30) — 10 keys
(285,30,N'GOW-DEMO-285-S5Y6Z7'),(286,30,N'GOW-DEMO-286-R8A9B1'),
(287,30,N'GOW-DEMO-287-Q2C3D4'),(288,30,N'GOW-DEMO-288-P5E6F7'),
(289,30,N'GOW-DEMO-289-O8G9H1'),(290,30,N'GOW-DEMO-290-N2I3J4'),
(291,30,N'GOW-DEMO-291-M5K6L7'),(292,30,N'GOW-DEMO-292-L8M9N1'),
(293,30,N'GOW-DEMO-293-K2O3P4'),(294,30,N'GOW-DEMO-294-J5Q6R7'),
-- Spider-Man (31) — 8 keys
(295,31,N'SPDR-DEMO-295-I8S9T1'),(296,31,N'SPDR-DEMO-296-H2U3V4'),
(297,31,N'SPDR-DEMO-297-G5W6X7'),(298,31,N'SPDR-DEMO-298-F8Y9Z1'),
(299,31,N'SPDR-DEMO-299-E2A3B4'),(300,31,N'SPDR-DEMO-300-D5C6D7'),
(301,31,N'SPDR-DEMO-301-C8E9F1'),(302,31,N'SPDR-DEMO-302-B2G3H4'),
-- RimWorld (49) — 5 keys
(303,49,N'RIMW-DEMO-303-A5I6J7'),(304,49,N'RIMW-DEMO-304-Z8K9L1'),
(305,49,N'RIMW-DEMO-305-Y2M3N4'),(306,49,N'RIMW-DEMO-306-X5O6P7'),
(307,49,N'RIMW-DEMO-307-W8Q9R1'),
-- Factorio (50) — 7 keys
(308,50,N'FACT-DEMO-308-V2S3T4'),(309,50,N'FACT-DEMO-309-U5U6V7'),
(310,50,N'FACT-DEMO-310-T8W9X1'),(311,50,N'FACT-DEMO-311-S2Y3Z4'),
(312,50,N'FACT-DEMO-312-R5A6B7'),(313,50,N'FACT-DEMO-313-Q8C9D1'),
(314,50,N'FACT-DEMO-314-P2E3F4'),
-- Hades (51) — 5 keys
(315,51,N'HADE-DEMO-315-O5G6H7'),(316,51,N'HADE-DEMO-316-N8I9J1'),
(317,51,N'HADE-DEMO-317-M2K3L4'),(318,51,N'HADE-DEMO-318-L5M6N7'),
(319,51,N'HADE-DEMO-319-K8O9P1'),
-- Hollow Knight (52) — 5 keys
(320,52,N'HLKN-DEMO-320-J2Q3R4'),(321,52,N'HLKN-DEMO-321-I5S6T7'),
(322,52,N'HLKN-DEMO-322-H8U9V1'),(323,52,N'HLKN-DEMO-323-G2W3X4'),
(324,52,N'HLKN-DEMO-324-F5Y6Z7'),
-- Deep Rock Galactic (55) — 4 keys
(325,55,N'DRG-DEMO-325-E8A9B1'),(326,55,N'DRG-DEMO-326-D2C3D4'),
(327,55,N'DRG-DEMO-327-C5E6F7'),(328,55,N'DRG-DEMO-328-B8G9H1'),
-- Vampire Survivors (58) — 7 keys
(329,58,N'VAMP-DEMO-329-A2I3J4'),(330,58,N'VAMP-DEMO-330-Z5K6L7'),
(331,58,N'VAMP-DEMO-331-Y8M9N1'),(332,58,N'VAMP-DEMO-332-X2O3P4'),
(333,58,N'VAMP-DEMO-333-W5Q6R7'),(334,58,N'VAMP-DEMO-334-V8S9T1'),
(335,58,N'VAMP-DEMO-335-U2U3V4'),
-- GTA V (5) — 3 keys
(336,5,N'GTA5-DEMO-336-T5W6X7'),(337,5,N'GTA5-DEMO-337-S8Y9Z1'),
(338,5,N'GTA5-DEMO-338-R2A3B4')
) AS v(Id, GameId, KeyCode)
WHERE NOT EXISTS (SELECT 1 FROM GameKeys WHERE Id = v.Id)
  AND EXISTS (SELECT 1 FROM Games WHERE Id = v.GameId);
SET IDENTITY_INSERT GameKeys OFF;
GO

-- ============================================================================
PRINT N'=== [3/6] Thêm 90 orders rải đều 2025-2026 (IDs 19-108)... ===';
IF NOT EXISTS (SELECT 1 FROM Orders WHERE Id = 19)
   AND EXISTS (SELECT 1 FROM Users WHERE Id = 2)
   AND EXISTS (SELECT 1 FROM Users WHERE Id = 10)
BEGIN
    SET IDENTITY_INSERT Orders ON;
    INSERT INTO Orders (Id, UserId, OrderDate, TotalAmount, Status, PaymentMethod) VALUES
    -- ===== THÁNG 1/2025 (~3.3M VND) =====
    (19,  2, N'2025-01-05 10:30:00', 299900,  N'Completed', N'Wallet'),   -- GTA V
    (20,  3, N'2025-01-10 14:20:00', 1199000, N'Completed', N'VnPay'),    -- Elden Ring
    (21,  4, N'2025-01-18 09:15:00', 799900,  N'Completed', N'Momo'),     -- Witcher 3
    (22,  5, N'2025-01-25 16:45:00', 999000,  N'Completed', N'Wallet'),   -- God of War
    -- ===== THÁNG 2/2025 (~5.4M VND) =====
    (23,  1, N'2025-02-03 11:00:00', 1199000, N'Completed', N'Wallet'),   -- Cyberpunk
    (24,  2, N'2025-02-10 13:30:00', 1199000, N'Completed', N'VnPay'),    -- RDR2
    (25,  3, N'2025-02-14 20:00:00', 699800,  N'Completed', N'Momo'),     -- Hades + Hollow Knight
    (26,  4, N'2025-02-22 08:45:00', 1199000, N'Completed', N'Wallet'),   -- BG3
    (27,  5, N'2025-02-28 17:15:00', 1099800, N'Completed', N'Momo'),     -- Valheim + Factorio
    -- ===== THÁNG 3/2025 (~5.5M VND) =====
    (28,  6, N'2025-03-05 10:00:00', 1199000, N'Completed', N'Wallet'),   -- Dark Souls III
    (29,  7, N'2025-03-08 12:30:00', 1199000, N'Completed', N'VnPay'),    -- Spider-Man
    (30,  1, N'2025-03-15 15:00:00', 1199000, N'Completed', N'Momo'),     -- Hogwarts
    (31,  2, N'2025-03-20 19:00:00', 1199000, N'Completed', N'Wallet'),   -- Sekiro
    (32,  3, N'2025-03-25 11:30:00', 699800,  N'Completed', N'Momo'),     -- Deep Rock + Vampire
    -- ===== THÁNG 4/2025 (~5.8M VND) =====
    (33,  4, N'2025-04-02 09:00:00', 999000,  N'Completed', N'Wallet'),   -- God of War
    (34,  5, N'2025-04-08 14:00:00', 699900,  N'Completed', N'VnPay'),    -- RimWorld
    (35,  6, N'2025-04-12 16:30:00', 1199000, N'Completed', N'Momo'),     -- Cyberpunk
    (36,  7, N'2025-04-20 10:45:00', 999800,  N'Completed', N'Wallet'),   -- Witcher 3 + Stardew
    (37,  8, N'2025-04-25 13:15:00', 699900,  N'Completed', N'Momo'),     -- Factorio
    (38,  1, N'2025-04-30 18:00:00', 1199000, N'Completed', N'VnPay'),    -- Elden Ring
    -- ===== THÁNG 5/2025 (~6.2M VND) =====
    (39,  2, N'2025-05-05 11:00:00', 1199000, N'Completed', N'Wallet'),   -- Hogwarts
    (40,  3, N'2025-05-10 09:30:00', 1199000, N'Completed', N'VnPay'),    -- RDR2
    (41,  4, N'2025-05-15 14:45:00', 1199000, N'Completed', N'Momo'),     -- BG3
    (42,  5, N'2025-05-20 16:00:00', 1199000, N'Completed', N'Wallet'),   -- Dark Souls III
    (43,  6, N'2025-05-25 20:30:00', 799700,  N'Completed', N'Momo'),     -- Hades + Hollow Knight + Vampire
    (44,  7, N'2025-05-30 08:00:00', 599800,  N'Completed', N'VnPay'),    -- Valheim + Stardew
    -- ===== THÁNG 6/2025 (~5.0M VND) =====
    (45,  8, N'2025-06-05 10:30:00', 999000,  N'Completed', N'Wallet'),   -- God of War
    (46,  9, N'2025-06-10 15:00:00', 1199000, N'Completed', N'Momo'),     -- Spider-Man
    (47, 10, N'2025-06-15 11:45:00', 1199000, N'Completed', N'VnPay'),    -- Sekiro
    (48,  1, N'2025-06-25 17:30:00', 899800,  N'Completed', N'Wallet'),   -- RimWorld + Stardew
    (49,  2, N'2025-06-28 09:00:00', 699900,  N'Completed', N'Momo'),     -- Factorio
    -- ===== THÁNG 7/2025 (~5.6M VND) =====
    (50,  3, N'2025-07-03 13:00:00', 1199000, N'Completed', N'Wallet'),   -- Elden Ring
    (51,  4, N'2025-07-10 10:30:00', 1199000, N'Completed', N'VnPay'),    -- Cyberpunk
    (52,  5, N'2025-07-18 16:00:00', 1199000, N'Completed', N'Momo'),     -- BG3
    (53,  6, N'2025-07-22 14:15:00', 699800,  N'Completed', N'Wallet'),   -- Deep Rock + Vampire
    (54,  7, N'2025-07-28 11:00:00', 799900,  N'Completed', N'Momo'),     -- Witcher 3
    (55,  8, N'2025-07-31 09:30:00', 499800,  N'Completed', N'VnPay'),    -- Valheim + Terraria
    -- ===== THÁNG 8/2025 (~8.1M VND) =====
    (56,  9, N'2025-08-05 12:00:00', 2198000, N'Completed', N'Wallet'),   -- God of War + Spider-Man
    (57, 10, N'2025-08-10 15:30:00', 1199000, N'Completed', N'Momo'),     -- RDR2
    (58,  1, N'2025-08-15 10:00:00', 1199000, N'Completed', N'VnPay'),    -- Sekiro
    (59,  2, N'2025-08-20 14:00:00', 1199000, N'Completed', N'Wallet'),   -- Hogwarts
    (60,  3, N'2025-08-25 16:30:00', 1099800, N'Completed', N'Momo'),     -- Hades + RimWorld
    (61,  4, N'2025-08-28 09:00:00', 1199000, N'Completed', N'VnPay'),    -- Dark Souls III
    -- ===== THÁNG 9/2025 (~5.4M VND) =====
    (62,  5, N'2025-09-03 11:30:00', 1498900, N'Completed', N'Wallet'),   -- GTA V + Elden Ring
    (63,  6, N'2025-09-10 13:00:00', 1199000, N'Completed', N'Momo'),     -- Cyberpunk
    (64,  7, N'2025-09-20 09:45:00', 999800,  N'Completed', N'VnPay'),    -- Factorio + Hollow Knight
    (65,  8, N'2025-09-28 15:00:00', 1199000, N'Completed', N'Wallet'),   -- BG3
    (66,  9, N'2025-09-30 17:30:00', 499800,  N'Completed', N'Momo'),     -- Valheim + Vampire
    -- ===== THÁNG 10/2025 (~7.3M VND) =====
    (67, 10, N'2025-10-05 10:00:00', 999000,  N'Completed', N'Wallet'),   -- God of War
    (68,  1, N'2025-10-08 12:30:00', 1199000, N'Completed', N'VnPay'),    -- Spider-Man
    (69,  2, N'2025-10-12 14:00:00', 1199000, N'Completed', N'Momo'),     -- RDR2
    (70,  3, N'2025-10-18 09:15:00', 1199000, N'Completed', N'Wallet'),   -- Elden Ring
    (71,  4, N'2025-10-22 16:45:00', 899700,  N'Completed', N'Momo'),     -- Deep Rock + Terraria + Stardew
    (72,  5, N'2025-10-28 11:00:00', 1199000, N'Completed', N'VnPay'),    -- Cyberpunk
    (73,  6, N'2025-10-30 20:00:00', 599700,  N'Completed', N'Wallet'),   -- Hades + L4D2 + Vampire
    -- ===== THÁNG 11/2025 (~10.8M VND) — SALE SEASON =====
    (74,  7, N'2025-11-01 10:00:00', 1199000, N'Completed', N'Wallet'),   -- Elden Ring
    (75,  8, N'2025-11-05 13:30:00', 2198000, N'Completed', N'Momo'),     -- God of War + Spider-Man
    (76,  9, N'2025-11-10 09:00:00', 1199000, N'Completed', N'VnPay'),    -- BG3
    (77, 10, N'2025-11-12 15:00:00', 1199000, N'Completed', N'Wallet'),   -- RDR2
    (78,  1, N'2025-11-15 11:30:00', 1199000, N'Completed', N'Momo'),     -- Cyberpunk
    (79,  2, N'2025-11-20 14:15:00', 1199000, N'Completed', N'VnPay'),    -- Hogwarts
    (80,  3, N'2025-11-25 16:00:00', 1199000, N'Completed', N'Wallet'),   -- Sekiro
    (81,  4, N'2025-11-28 10:45:00', 1399800, N'Completed', N'Momo'),     -- Factorio + RimWorld
    -- ===== THÁNG 12/2025 (~13.3M VND) — HOLIDAY PEAK =====
    (82,  5, N'2025-12-01 09:00:00', 1199000, N'Completed', N'Wallet'),   -- Elden Ring
    (83,  6, N'2025-12-05 12:00:00', 999000,  N'Completed', N'VnPay'),    -- God of War
    (84,  7, N'2025-12-08 15:30:00', 2398000, N'Completed', N'Momo'),     -- BG3 + Spider-Man
    (85,  8, N'2025-12-10 10:00:00', 1199000, N'Completed', N'Wallet'),   -- Cyberpunk
    (86,  9, N'2025-12-12 14:00:00', 1199000, N'Completed', N'Momo'),     -- RDR2
    (87, 10, N'2025-12-15 16:30:00', 1199000, N'Completed', N'VnPay'),    -- Hogwarts
    (88,  1, N'2025-12-18 09:30:00', 1199000, N'Completed', N'Wallet'),   -- Dark Souls III
    (89,  2, N'2025-12-20 13:00:00', 1199000, N'Completed', N'Momo'),     -- Sekiro
    (90,  3, N'2025-12-22 10:45:00', 1998900, N'Completed', N'VnPay'),    -- Elden Ring + Witcher 3
    (91,  4, N'2025-12-24 20:00:00', 699600,  N'Completed', N'Wallet'),   -- Stardew+Terraria+Vampire+Hollow Knight
    (92,  5, N'2025-12-26 11:00:00', 1398900, N'Completed', N'Momo'),     -- God of War + Valheim
    (93,  6, N'2025-12-28 14:30:00', 699900,  N'Completed', N'VnPay'),    -- Factorio
    -- ===== THÁNG 1/2026 (~5.8M VND) =====
    (94,  7, N'2026-01-05 10:00:00', 1199000, N'Completed', N'Wallet'),   -- Elden Ring
    (95,  8, N'2026-01-10 13:30:00', 1199000, N'Completed', N'Momo'),     -- Cyberpunk
    (96,  9, N'2026-01-15 15:00:00', 999000,  N'Completed', N'VnPay'),    -- God of War
    (97, 10, N'2026-01-20 09:15:00', 1199000, N'Completed', N'Wallet'),   -- BG3
    (98,  1, N'2026-01-25 16:00:00', 1199000, N'Completed', N'Momo'),     -- Spider-Man
    -- ===== THÁNG 2/2026 bổ sung (~3.6M VND) =====
    (99,  2, N'2026-02-05 10:30:00', 1199000, N'Completed', N'VnPay'),    -- Elden Ring
    (100, 3, N'2026-02-12 14:00:00', 1199000, N'Completed', N'Wallet'),   -- Hogwarts
    (101, 4, N'2026-02-25 11:00:00', 1199000, N'Completed', N'Momo'),     -- Sekiro
    -- ===== THÁNG 3/2026 bổ sung (~3.6M VND) =====
    (102, 5, N'2026-03-05 09:30:00', 1199000, N'Completed', N'Wallet'),   -- RDR2
    (103, 6, N'2026-03-12 13:00:00', 1199000, N'Completed', N'VnPay'),    -- Cyberpunk
    (104, 7, N'2026-03-22 15:30:00', 1199000, N'Completed', N'Momo'),     -- Dark Souls III
    -- ===== THÁNG 6/2026 bổ sung (~4.4M VND) =====
    (105, 8, N'2026-06-02 10:00:00', 1199000, N'Completed', N'Wallet'),   -- Elden Ring
    (106, 9, N'2026-06-08 14:30:00', 999000,  N'Completed', N'Momo'),     -- God of War
    (107,10, N'2026-06-12 11:00:00', 1199000, N'Completed', N'VnPay'),    -- Cyberpunk
    (108, 1, N'2026-06-16 09:30:00', 1199000, N'Completed', N'Wallet');   -- BG3
    SET IDENTITY_INSERT Orders OFF;
END
GO

-- ============================================================================
PRINT N'=== [4/6] Thêm order details (IDs 35-155)... ===';
IF NOT EXISTS (SELECT 1 FROM OrderDetails WHERE Id = 35) AND EXISTS (SELECT 1 FROM Orders WHERE Id = 19)
BEGIN
    SET IDENTITY_INSERT OrderDetails ON;
    INSERT INTO OrderDetails (Id, OrderId, GameId, Quantity, UnitPrice) VALUES
    -- Jan 2025
    (35, 19, 5,  1, 299900),   -- GTA V
    (36, 20, 6,  1, 1199000),  -- Elden Ring
    (37, 21, 10, 1, 799900),   -- Witcher 3
    (38, 22, 30, 1, 999000),   -- God of War
    -- Feb 2025
    (39, 23, 7,  1, 1199000),  -- Cyberpunk
    (40, 24, 9,  1, 1199000),  -- RDR2
    (41, 25, 51, 1, 399900),   -- Hades
    (42, 25, 52, 1, 299900),   -- Hollow Knight
    (43, 26, 8,  1, 1199000),  -- BG3
    (44, 27, 18, 1, 399900),   -- Valheim
    (45, 27, 50, 1, 699900),   -- Factorio
    -- Mar 2025
    (46, 28, 28, 1, 1199000),  -- Dark Souls III
    (47, 29, 31, 1, 1199000),  -- Spider-Man
    (48, 30, 21, 1, 1199000),  -- Hogwarts
    (49, 31, 29, 1, 1199000),  -- Sekiro
    (50, 32, 55, 1, 599900),   -- Deep Rock
    (51, 32, 58, 1, 99900),    -- Vampire Survivors
    -- Apr 2025
    (52, 33, 30, 1, 999000),   -- God of War
    (53, 34, 49, 1, 699900),   -- RimWorld
    (54, 35, 7,  1, 1199000),  -- Cyberpunk
    (55, 36, 10, 1, 799900),   -- Witcher 3
    (56, 36, 12, 1, 199900),   -- Stardew Valley
    (57, 37, 50, 1, 699900),   -- Factorio
    (58, 38, 6,  1, 1199000),  -- Elden Ring
    -- May 2025
    (59, 39, 21, 1, 1199000),  -- Hogwarts
    (60, 40, 9,  1, 1199000),  -- RDR2
    (61, 41, 8,  1, 1199000),  -- BG3
    (62, 42, 28, 1, 1199000),  -- Dark Souls III
    (63, 43, 51, 1, 399900),   -- Hades
    (64, 43, 52, 1, 299900),   -- Hollow Knight
    (65, 43, 58, 1, 99900),    -- Vampire Survivors
    (66, 44, 18, 1, 399900),   -- Valheim
    (67, 44, 12, 1, 199900),   -- Stardew Valley
    -- Jun 2025
    (68, 45, 30, 1, 999000),   -- God of War
    (69, 46, 31, 1, 1199000),  -- Spider-Man
    (70, 47, 29, 1, 1199000),  -- Sekiro
    (71, 48, 49, 1, 699900),   -- RimWorld
    (72, 48, 12, 1, 199900),   -- Stardew Valley
    (73, 49, 50, 1, 699900),   -- Factorio
    -- Jul 2025
    (74, 50, 6,  1, 1199000),  -- Elden Ring
    (75, 51, 7,  1, 1199000),  -- Cyberpunk
    (76, 52, 8,  1, 1199000),  -- BG3
    (77, 53, 55, 1, 599900),   -- Deep Rock
    (78, 53, 58, 1, 99900),    -- Vampire Survivors
    (79, 54, 10, 1, 799900),   -- Witcher 3
    (80, 55, 18, 1, 399900),   -- Valheim
    (81, 55, 13, 1, 99900),    -- Terraria
    -- Aug 2025
    (82, 56, 30, 1, 999000),   -- God of War
    (83, 56, 31, 1, 1199000),  -- Spider-Man
    (84, 57, 9,  1, 1199000),  -- RDR2
    (85, 58, 29, 1, 1199000),  -- Sekiro
    (86, 59, 21, 1, 1199000),  -- Hogwarts
    (87, 60, 51, 1, 399900),   -- Hades
    (88, 60, 49, 1, 699900),   -- RimWorld
    (89, 61, 28, 1, 1199000),  -- Dark Souls III
    -- Sep 2025
    (90, 62, 5,  1, 299900),   -- GTA V
    (91, 62, 6,  1, 1199000),  -- Elden Ring
    (92, 63, 7,  1, 1199000),  -- Cyberpunk
    (93, 64, 50, 1, 699900),   -- Factorio
    (94, 64, 52, 1, 299900),   -- Hollow Knight
    (95, 65, 8,  1, 1199000),  -- BG3
    (96, 66, 18, 1, 399900),   -- Valheim
    (97, 66, 58, 1, 99900),    -- Vampire Survivors
    -- Oct 2025
    (98,  67, 30, 1, 999000),  -- God of War
    (99,  68, 31, 1, 1199000), -- Spider-Man
    (100, 69, 9,  1, 1199000), -- RDR2
    (101, 70, 6,  1, 1199000), -- Elden Ring
    (102, 71, 55, 1, 599900),  -- Deep Rock
    (103, 71, 13, 1, 99900),   -- Terraria
    (104, 71, 12, 1, 199900),  -- Stardew Valley
    (105, 72, 7,  1, 1199000), -- Cyberpunk
    (106, 73, 51, 1, 399900),  -- Hades
    (107, 73, 14, 1, 99900),   -- L4D2
    (108, 73, 58, 1, 99900),   -- Vampire Survivors
    -- Nov 2025
    (109, 74, 6,  1, 1199000), -- Elden Ring
    (110, 75, 30, 1, 999000),  -- God of War
    (111, 75, 31, 1, 1199000), -- Spider-Man
    (112, 76, 8,  1, 1199000), -- BG3
    (113, 77, 9,  1, 1199000), -- RDR2
    (114, 78, 7,  1, 1199000), -- Cyberpunk
    (115, 79, 21, 1, 1199000), -- Hogwarts
    (116, 80, 29, 1, 1199000), -- Sekiro
    (117, 81, 50, 1, 699900),  -- Factorio
    (118, 81, 49, 1, 699900),  -- RimWorld
    -- Dec 2025
    (119, 82, 6,  1, 1199000), -- Elden Ring
    (120, 83, 30, 1, 999000),  -- God of War
    (121, 84, 8,  1, 1199000), -- BG3
    (122, 84, 31, 1, 1199000), -- Spider-Man
    (123, 85, 7,  1, 1199000), -- Cyberpunk
    (124, 86, 9,  1, 1199000), -- RDR2
    (125, 87, 21, 1, 1199000), -- Hogwarts
    (126, 88, 28, 1, 1199000), -- Dark Souls III
    (127, 89, 29, 1, 1199000), -- Sekiro
    (128, 90, 6,  1, 1199000), -- Elden Ring
    (129, 90, 10, 1, 799900),  -- Witcher 3
    (130, 91, 12, 1, 199900),  -- Stardew Valley
    (131, 91, 13, 1, 99900),   -- Terraria
    (132, 91, 58, 1, 99900),   -- Vampire Survivors
    (133, 91, 52, 1, 299900),  -- Hollow Knight
    (134, 92, 30, 1, 999000),  -- God of War
    (135, 92, 18, 1, 399900),  -- Valheim
    (136, 93, 50, 1, 699900),  -- Factorio
    -- Jan 2026
    (137, 94, 6,  1, 1199000), -- Elden Ring
    (138, 95, 7,  1, 1199000), -- Cyberpunk
    (139, 96, 30, 1, 999000),  -- God of War
    (140, 97, 8,  1, 1199000), -- BG3
    (141, 98, 31, 1, 1199000), -- Spider-Man
    -- Feb 2026
    (142, 99,  6,  1, 1199000), -- Elden Ring
    (143, 100, 21, 1, 1199000), -- Hogwarts
    (144, 101, 29, 1, 1199000), -- Sekiro
    -- Mar 2026
    (145, 102, 9,  1, 1199000), -- RDR2
    (146, 103, 7,  1, 1199000), -- Cyberpunk
    (147, 104, 28, 1, 1199000), -- Dark Souls III
    -- Jun 2026
    (148, 105, 6,  1, 1199000), -- Elden Ring
    (149, 106, 30, 1, 999000),  -- God of War
    (150, 107, 7,  1, 1199000), -- Cyberpunk
    (151, 108, 8,  1, 1199000); -- BG3
    SET IDENTITY_INSERT OrderDetails OFF;
END
GO

-- ============================================================================
PRINT N'=== [5/6] Thêm payments (IDs 15-104)... ===';
IF NOT EXISTS (SELECT 1 FROM Payments WHERE Id = 15) AND EXISTS (SELECT 1 FROM Orders WHERE Id = 19)
BEGIN
    SET IDENTITY_INSERT Payments ON;
    INSERT INTO Payments (Id, OrderId, Amount, PaymentMethod, Status, TransactionId, Note, PaidAt, CreatedAt) VALUES
    (15,  19,  299900,  N'Wallet', N'Completed', N'TXN2025010501', NULL, N'2025-01-05 10:31:00', N'2025-01-05 10:31:00'),
    (16,  20,  1199000, N'VnPay',  N'Completed', N'TXN2025011001', NULL, N'2025-01-10 14:21:00', N'2025-01-10 14:21:00'),
    (17,  21,  799900,  N'Momo',   N'Completed', N'TXN2025011801', NULL, N'2025-01-18 09:16:00', N'2025-01-18 09:16:00'),
    (18,  22,  999000,  N'Wallet', N'Completed', N'TXN2025012501', NULL, N'2025-01-25 16:46:00', N'2025-01-25 16:46:00'),
    (19,  23,  1199000, N'Wallet', N'Completed', N'TXN2025020301', NULL, N'2025-02-03 11:01:00', N'2025-02-03 11:01:00'),
    (20,  24,  1199000, N'VnPay',  N'Completed', N'TXN2025021001', NULL, N'2025-02-10 13:31:00', N'2025-02-10 13:31:00'),
    (21,  25,  699800,  N'Momo',   N'Completed', N'TXN2025021401', NULL, N'2025-02-14 20:01:00', N'2025-02-14 20:01:00'),
    (22,  26,  1199000, N'Wallet', N'Completed', N'TXN2025022201', NULL, N'2025-02-22 08:46:00', N'2025-02-22 08:46:00'),
    (23,  27,  1099800, N'Momo',   N'Completed', N'TXN2025022801', NULL, N'2025-02-28 17:16:00', N'2025-02-28 17:16:00'),
    (24,  28,  1199000, N'Wallet', N'Completed', N'TXN2025030501', NULL, N'2025-03-05 10:01:00', N'2025-03-05 10:01:00'),
    (25,  29,  1199000, N'VnPay',  N'Completed', N'TXN2025030801', NULL, N'2025-03-08 12:31:00', N'2025-03-08 12:31:00'),
    (26,  30,  1199000, N'Momo',   N'Completed', N'TXN2025031501', NULL, N'2025-03-15 15:01:00', N'2025-03-15 15:01:00'),
    (27,  31,  1199000, N'Wallet', N'Completed', N'TXN2025032001', NULL, N'2025-03-20 19:01:00', N'2025-03-20 19:01:00'),
    (28,  32,  699800,  N'Momo',   N'Completed', N'TXN2025032501', NULL, N'2025-03-25 11:31:00', N'2025-03-25 11:31:00'),
    (29,  33,  999000,  N'Wallet', N'Completed', N'TXN2025040201', NULL, N'2025-04-02 09:01:00', N'2025-04-02 09:01:00'),
    (30,  34,  699900,  N'VnPay',  N'Completed', N'TXN2025040801', NULL, N'2025-04-08 14:01:00', N'2025-04-08 14:01:00'),
    (31,  35,  1199000, N'Momo',   N'Completed', N'TXN2025041201', NULL, N'2025-04-12 16:31:00', N'2025-04-12 16:31:00'),
    (32,  36,  999800,  N'Wallet', N'Completed', N'TXN2025042001', NULL, N'2025-04-20 10:46:00', N'2025-04-20 10:46:00'),
    (33,  37,  699900,  N'Momo',   N'Completed', N'TXN2025042501', NULL, N'2025-04-25 13:16:00', N'2025-04-25 13:16:00'),
    (34,  38,  1199000, N'VnPay',  N'Completed', N'TXN2025043001', NULL, N'2025-04-30 18:01:00', N'2025-04-30 18:01:00'),
    (35,  39,  1199000, N'Wallet', N'Completed', N'TXN2025050501', NULL, N'2025-05-05 11:01:00', N'2025-05-05 11:01:00'),
    (36,  40,  1199000, N'VnPay',  N'Completed', N'TXN2025051001', NULL, N'2025-05-10 09:31:00', N'2025-05-10 09:31:00'),
    (37,  41,  1199000, N'Momo',   N'Completed', N'TXN2025051501', NULL, N'2025-05-15 14:46:00', N'2025-05-15 14:46:00'),
    (38,  42,  1199000, N'Wallet', N'Completed', N'TXN2025052001', NULL, N'2025-05-20 16:01:00', N'2025-05-20 16:01:00'),
    (39,  43,  799700,  N'Momo',   N'Completed', N'TXN2025052501', NULL, N'2025-05-25 20:31:00', N'2025-05-25 20:31:00'),
    (40,  44,  599800,  N'VnPay',  N'Completed', N'TXN2025053001', NULL, N'2025-05-30 08:01:00', N'2025-05-30 08:01:00'),
    (41,  45,  999000,  N'Wallet', N'Completed', N'TXN2025060501', NULL, N'2025-06-05 10:31:00', N'2025-06-05 10:31:00'),
    (42,  46,  1199000, N'Momo',   N'Completed', N'TXN2025061001', NULL, N'2025-06-10 15:01:00', N'2025-06-10 15:01:00'),
    (43,  47,  1199000, N'VnPay',  N'Completed', N'TXN2025061501', NULL, N'2025-06-15 11:46:00', N'2025-06-15 11:46:00'),
    (44,  48,  899800,  N'Wallet', N'Completed', N'TXN2025062501', NULL, N'2025-06-25 17:31:00', N'2025-06-25 17:31:00'),
    (45,  49,  699900,  N'Momo',   N'Completed', N'TXN2025062801', NULL, N'2025-06-28 09:01:00', N'2025-06-28 09:01:00'),
    (46,  50,  1199000, N'Wallet', N'Completed', N'TXN2025070301', NULL, N'2025-07-03 13:01:00', N'2025-07-03 13:01:00'),
    (47,  51,  1199000, N'VnPay',  N'Completed', N'TXN2025071001', NULL, N'2025-07-10 10:31:00', N'2025-07-10 10:31:00'),
    (48,  52,  1199000, N'Momo',   N'Completed', N'TXN2025071801', NULL, N'2025-07-18 16:01:00', N'2025-07-18 16:01:00'),
    (49,  53,  699800,  N'Wallet', N'Completed', N'TXN2025072201', NULL, N'2025-07-22 14:16:00', N'2025-07-22 14:16:00'),
    (50,  54,  799900,  N'Momo',   N'Completed', N'TXN2025072801', NULL, N'2025-07-28 11:01:00', N'2025-07-28 11:01:00'),
    (51,  55,  499800,  N'VnPay',  N'Completed', N'TXN2025073101', NULL, N'2025-07-31 09:31:00', N'2025-07-31 09:31:00'),
    (52,  56,  2198000, N'Wallet', N'Completed', N'TXN2025080501', NULL, N'2025-08-05 12:01:00', N'2025-08-05 12:01:00'),
    (53,  57,  1199000, N'Momo',   N'Completed', N'TXN2025081001', NULL, N'2025-08-10 15:31:00', N'2025-08-10 15:31:00'),
    (54,  58,  1199000, N'VnPay',  N'Completed', N'TXN2025081501', NULL, N'2025-08-15 10:01:00', N'2025-08-15 10:01:00'),
    (55,  59,  1199000, N'Wallet', N'Completed', N'TXN2025082001', NULL, N'2025-08-20 14:01:00', N'2025-08-20 14:01:00'),
    (56,  60,  1099800, N'Momo',   N'Completed', N'TXN2025082501', NULL, N'2025-08-25 16:31:00', N'2025-08-25 16:31:00'),
    (57,  61,  1199000, N'VnPay',  N'Completed', N'TXN2025082801', NULL, N'2025-08-28 09:01:00', N'2025-08-28 09:01:00'),
    (58,  62,  1498900, N'Wallet', N'Completed', N'TXN2025090301', NULL, N'2025-09-03 11:31:00', N'2025-09-03 11:31:00'),
    (59,  63,  1199000, N'Momo',   N'Completed', N'TXN2025091001', NULL, N'2025-09-10 13:01:00', N'2025-09-10 13:01:00'),
    (60,  64,  999800,  N'VnPay',  N'Completed', N'TXN2025092001', NULL, N'2025-09-20 09:46:00', N'2025-09-20 09:46:00'),
    (61,  65,  1199000, N'Wallet', N'Completed', N'TXN2025092801', NULL, N'2025-09-28 15:01:00', N'2025-09-28 15:01:00'),
    (62,  66,  499800,  N'Momo',   N'Completed', N'TXN2025093001', NULL, N'2025-09-30 17:31:00', N'2025-09-30 17:31:00'),
    (63,  67,  999000,  N'Wallet', N'Completed', N'TXN2025100501', NULL, N'2025-10-05 10:01:00', N'2025-10-05 10:01:00'),
    (64,  68,  1199000, N'VnPay',  N'Completed', N'TXN2025100801', NULL, N'2025-10-08 12:31:00', N'2025-10-08 12:31:00'),
    (65,  69,  1199000, N'Momo',   N'Completed', N'TXN2025101201', NULL, N'2025-10-12 14:01:00', N'2025-10-12 14:01:00'),
    (66,  70,  1199000, N'Wallet', N'Completed', N'TXN2025101801', NULL, N'2025-10-18 09:16:00', N'2025-10-18 09:16:00'),
    (67,  71,  899700,  N'Momo',   N'Completed', N'TXN2025102201', NULL, N'2025-10-22 16:46:00', N'2025-10-22 16:46:00'),
    (68,  72,  1199000, N'VnPay',  N'Completed', N'TXN2025102801', NULL, N'2025-10-28 11:01:00', N'2025-10-28 11:01:00'),
    (69,  73,  599700,  N'Wallet', N'Completed', N'TXN2025103001', NULL, N'2025-10-30 20:01:00', N'2025-10-30 20:01:00'),
    (70,  74,  1199000, N'Wallet', N'Completed', N'TXN2025110101', NULL, N'2025-11-01 10:01:00', N'2025-11-01 10:01:00'),
    (71,  75,  2198000, N'Momo',   N'Completed', N'TXN2025110501', NULL, N'2025-11-05 13:31:00', N'2025-11-05 13:31:00'),
    (72,  76,  1199000, N'VnPay',  N'Completed', N'TXN2025111001', NULL, N'2025-11-10 09:01:00', N'2025-11-10 09:01:00'),
    (73,  77,  1199000, N'Wallet', N'Completed', N'TXN2025111201', NULL, N'2025-11-12 15:01:00', N'2025-11-12 15:01:00'),
    (74,  78,  1199000, N'Momo',   N'Completed', N'TXN2025111501', NULL, N'2025-11-15 11:31:00', N'2025-11-15 11:31:00'),
    (75,  79,  1199000, N'VnPay',  N'Completed', N'TXN2025112001', NULL, N'2025-11-20 14:16:00', N'2025-11-20 14:16:00'),
    (76,  80,  1199000, N'Wallet', N'Completed', N'TXN2025112501', NULL, N'2025-11-25 16:01:00', N'2025-11-25 16:01:00'),
    (77,  81,  1399800, N'Momo',   N'Completed', N'TXN2025112801', NULL, N'2025-11-28 10:46:00', N'2025-11-28 10:46:00'),
    (78,  82,  1199000, N'Wallet', N'Completed', N'TXN2025120101', NULL, N'2025-12-01 09:01:00', N'2025-12-01 09:01:00'),
    (79,  83,  999000,  N'VnPay',  N'Completed', N'TXN2025120501', NULL, N'2025-12-05 12:01:00', N'2025-12-05 12:01:00'),
    (80,  84,  2398000, N'Momo',   N'Completed', N'TXN2025120801', NULL, N'2025-12-08 15:31:00', N'2025-12-08 15:31:00'),
    (81,  85,  1199000, N'Wallet', N'Completed', N'TXN2025121001', NULL, N'2025-12-10 10:01:00', N'2025-12-10 10:01:00'),
    (82,  86,  1199000, N'Momo',   N'Completed', N'TXN2025121201', NULL, N'2025-12-12 14:01:00', N'2025-12-12 14:01:00'),
    (83,  87,  1199000, N'VnPay',  N'Completed', N'TXN2025121501', NULL, N'2025-12-15 16:31:00', N'2025-12-15 16:31:00'),
    (84,  88,  1199000, N'Wallet', N'Completed', N'TXN2025121801', NULL, N'2025-12-18 09:31:00', N'2025-12-18 09:31:00'),
    (85,  89,  1199000, N'Momo',   N'Completed', N'TXN2025122001', NULL, N'2025-12-20 13:01:00', N'2025-12-20 13:01:00'),
    (86,  90,  1998900, N'VnPay',  N'Completed', N'TXN2025122201', NULL, N'2025-12-22 10:46:00', N'2025-12-22 10:46:00'),
    (87,  91,  699600,  N'Wallet', N'Completed', N'TXN2025122401', NULL, N'2025-12-24 20:01:00', N'2025-12-24 20:01:00'),
    (88,  92,  1398900, N'Momo',   N'Completed', N'TXN2025122601', NULL, N'2025-12-26 11:01:00', N'2025-12-26 11:01:00'),
    (89,  93,  699900,  N'VnPay',  N'Completed', N'TXN2025122801', NULL, N'2025-12-28 14:31:00', N'2025-12-28 14:31:00'),
    (90,  94,  1199000, N'Wallet', N'Completed', N'TXN2026010501', NULL, N'2026-01-05 10:01:00', N'2026-01-05 10:01:00'),
    (91,  95,  1199000, N'Momo',   N'Completed', N'TXN2026011001', NULL, N'2026-01-10 13:31:00', N'2026-01-10 13:31:00'),
    (92,  96,  999000,  N'VnPay',  N'Completed', N'TXN2026011501', NULL, N'2026-01-15 15:01:00', N'2026-01-15 15:01:00'),
    (93,  97,  1199000, N'Wallet', N'Completed', N'TXN2026012001', NULL, N'2026-01-20 09:16:00', N'2026-01-20 09:16:00'),
    (94,  98,  1199000, N'Momo',   N'Completed', N'TXN2026012501', NULL, N'2026-01-25 16:01:00', N'2026-01-25 16:01:00'),
    (95,  99,  1199000, N'VnPay',  N'Completed', N'TXN2026020501', NULL, N'2026-02-05 10:31:00', N'2026-02-05 10:31:00'),
    (96,  100, 1199000, N'Wallet', N'Completed', N'TXN2026021201', NULL, N'2026-02-12 14:01:00', N'2026-02-12 14:01:00'),
    (97,  101, 1199000, N'Momo',   N'Completed', N'TXN2026022501', NULL, N'2026-02-25 11:01:00', N'2026-02-25 11:01:00'),
    (98,  102, 1199000, N'Wallet', N'Completed', N'TXN2026030501', NULL, N'2026-03-05 09:31:00', N'2026-03-05 09:31:00'),
    (99,  103, 1199000, N'VnPay',  N'Completed', N'TXN2026031201', NULL, N'2026-03-12 13:01:00', N'2026-03-12 13:01:00'),
    (100, 104, 1199000, N'Momo',   N'Completed', N'TXN2026032201', NULL, N'2026-03-22 15:31:00', N'2026-03-22 15:31:00'),
    (101, 105, 1199000, N'Wallet', N'Completed', N'TXN2026060201', NULL, N'2026-06-02 10:01:00', N'2026-06-02 10:01:00'),
    (102, 106, 999000,  N'Momo',   N'Completed', N'TXN2026060801', NULL, N'2026-06-08 14:31:00', N'2026-06-08 14:31:00'),
    (103, 107, 1199000, N'VnPay',  N'Completed', N'TXN2026061201', NULL, N'2026-06-12 11:01:00', N'2026-06-12 11:01:00'),
    (104, 108, 1199000, N'Wallet', N'Completed', N'TXN2026061601', NULL, N'2026-06-16 09:31:00', N'2026-06-16 09:31:00');
    SET IDENTITY_INSERT Payments OFF;
END
GO

-- ============================================================================
PRINT N'=== [6/6] Đánh dấu game keys đã sử dụng cho orders mới... ===';
UPDATE gk
SET gk.IsUsed = 1,
    gk.OrderDetailId = od.Id,
    gk.UsedAt = o.OrderDate
FROM GameKeys gk
INNER JOIN OrderDetails od ON od.GameId = gk.GameId
INNER JOIN Orders o ON o.Id = od.OrderId
WHERE o.Status = N'Completed'
  AND gk.IsUsed = 0
  AND o.Id BETWEEN 19 AND 108
  AND gk.Id = (
      SELECT TOP 1 gk2.Id
      FROM GameKeys gk2
      WHERE gk2.GameId = gk.GameId AND gk2.IsUsed = 0
      ORDER BY gk2.Id
  );
GO

PRINT N'';
PRINT N'✅ Demo orders seed hoàn tất!';
PRINT N'📊 5 users mới (ID 6-10), 139 game keys mới, 90 orders rải đều:';
PRINT N'   • 2025: Jan(4) Feb(5) Mar(5) Apr(6) May(6) Jun(5) Jul(6) Aug(6) Sep(5) Oct(7) Nov(8) Dec(12)';
PRINT N'   • 2026: Jan(5) + thêm Feb(3) Mar(3) Jun(4)';
PRINT N'   • Doanh thu 2025: ~77M VND | 2026 mới: ~22M VND';
GO
