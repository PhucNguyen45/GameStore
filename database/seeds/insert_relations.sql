-- ============================================================================
-- Direct INSERT for Orders, Libraries, Wishlists, Payments, Notifications
-- Bỏ qua IF NOT EXISTS vì các bảng đã bị DELETE ở seed chính
-- ============================================================================

-- ============================================================================
-- 1. WISHLISTS (24 items)
-- ============================================================================
SET IDENTITY_INSERT Wishlists ON;
INSERT INTO Wishlists (Id, UserId, GameId, AddedAt) VALUES
(1, 1, 29, DATEADD(DAY, -45, GETUTCDATE())),
(2, 1, 5, DATEADD(DAY, -30, GETUTCDATE())),
(3, 1, 27, DATEADD(DAY, -20, GETUTCDATE())),
(4, 2, 26, DATEADD(DAY, -60, GETUTCDATE())),
(5, 2, 61, DATEADD(DAY, -15, GETUTCDATE())),
(6, 2, 56, DATEADD(DAY, -10, GETUTCDATE())),
(7, 2, 6, DATEADD(DAY, -5, GETUTCDATE())),
(8, 2, 64, DATEADD(DAY, -3, GETUTCDATE())),
(9, 3, 55, DATEADD(DAY, -50, GETUTCDATE())),
(10, 3, 12, DATEADD(DAY, -25, GETUTCDATE())),
(11, 3, 28, DATEADD(DAY, -12, GETUTCDATE())),
(12, 3, 27, DATEADD(DAY, -8, GETUTCDATE())),
(13, 4, 23, DATEADD(DAY, -90, GETUTCDATE())),
(14, 4, 57, DATEADD(DAY, -40, GETUTCDATE())),
(15, 4, 11, DATEADD(DAY, -20, GETUTCDATE())),
(16, 4, 28, DATEADD(DAY, -7, GETUTCDATE())),
(17, 4, 56, DATEADD(DAY, -4, GETUTCDATE())),
(18, 4, 49, DATEADD(DAY, -2, GETUTCDATE())),
(19, 5, 5, DATEADD(DAY, -35, GETUTCDATE())),
(20, 5, 60, DATEADD(DAY, -14, GETUTCDATE())),
(21, 5, 64, DATEADD(DAY, -6, GETUTCDATE())),
(22, 5, 7, DATEADD(DAY, -4, GETUTCDATE())),
(23, 5, 19, DATEADD(DAY, -2, GETUTCDATE())),
(24, 5, 30, DATEADD(DAY, -1, GETUTCDATE()));
SET IDENTITY_INSERT Wishlists OFF;
GO

-- ============================================================================
-- 2. ORDERS (18 orders)
-- ============================================================================
SET IDENTITY_INSERT Orders ON;
INSERT INTO Orders (Id, UserId, OrderDate, TotalAmount, Status, PaymentMethod) VALUES
(1, 1, DATEADD(DAY, -120, GETUTCDATE()), 1199800, 'Completed', 'Wallet'),
(2, 2, DATEADD(DAY, -90, GETUTCDATE()), 1698800, 'Completed', 'VnPay'),
(3, 2, DATEADD(DAY, -60, GETUTCDATE()), 742000, 'Completed', 'Momo'),
(4, 3, DATEADD(DAY, -45, GETUTCDATE()), 1249750, 'Completed', 'Wallet'),
(5, 3, DATEADD(DAY, -30, GETUTCDATE()), 478500, 'Completed', 'VnPay'),
(6, 4, DATEADD(DAY, -25, GETUTCDATE()), 799900, 'Completed', 'Momo'),
(7, 4, DATEADD(DAY, -20, GETUTCDATE()), 1299600, 'Completed', 'Wallet'),
(8, 4, DATEADD(DAY, -15, GETUTCDATE()), 1749000, 'Completed', 'VnPay'),
(9, 5, DATEADD(DAY, -14, GETUTCDATE()), 524000, 'Completed', 'Momo'),
(10, 5, DATEADD(DAY, -10, GETUTCDATE()), 959700, 'Completed', 'Wallet'),
(11, 1, DATEADD(DAY, -8, GETUTCDATE()), 239800, 'Cancelled', 'VnPay'),
(12, 2, DATEADD(DAY, -7, GETUTCDATE()), 399900, 'Completed', 'Wallet'),
(13, 3, DATEADD(DAY, -6, GETUTCDATE()), 648000, 'Completed', 'Momo'),
(14, 4, DATEADD(DAY, -5, GETUTCDATE()), 499900, 'Cancelled', 'Wallet'),
(15, 5, DATEADD(DAY, -4, GETUTCDATE()), 1199900, 'Completed', 'VnPay'),
(16, 1, DATEADD(DAY, -3, GETUTCDATE()), 349500, 'Completed', 'Momo'),
(17, 1, DATEADD(DAY, -2, GETUTCDATE()), 599900, 'Pending', 'Wallet'),
(18, 3, DATEADD(DAY, -1, GETUTCDATE()), 1499900, 'Pending', 'VnPay');
SET IDENTITY_INSERT Orders OFF;
GO

-- ============================================================================
-- 3. ORDER DETAILS (35 items)
-- ============================================================================
SET IDENTITY_INSERT OrderDetails ON;
INSERT INTO OrderDetails (Id, OrderId, GameId, Quantity, UnitPrice) VALUES
-- Order 1 (User 1): GTA V + Valheim
(1, 1, 5, 1, 799900),
(2, 1, 18, 1, 399900),
-- Order 2 (User 2): ETS2 + Hogwarts Legacy + GTA V
(3, 2, 23, 1, 199900),
(4, 2, 21, 1, 1199000),
(5, 2, 5, 1, 299900),
-- Order 3 (User 2): Stardew + Terraria + L4D2
(6, 3, 12, 1, 199000),
(7, 3, 13, 1, 199000),
(8, 3, 14, 1, 149000),
(9, 3, 16, 1, 195000),
-- Order 4 (User 3): Elden Ring + Sekiro
(10, 4, 6, 1, 499900),
(11, 4, 29, 1, 499900),
(12, 4, 55, 1, 249950),
-- Order 5 (User 3): Stardew + GMod
(13, 5, 12, 1, 199000),
(14, 5, 15, 1, 99500),
(15, 5, 13, 1, 180000),
-- Order 6 (User 4): Cyberpunk 2077
(16, 6, 7, 1, 799900),
-- Order 7 (User 4): Valheim + RDR2 + Among Us
(17, 7, 18, 1, 399900),
(18, 7, 9, 1, 899900),
(19, 7, 16, 1, 195000),
-- Order 8 (User 4): BG3 + Civ VI
(20, 8, 8, 1, 1499900),
(21, 8, 22, 1, 249900),
-- Order 9 (User 5): Terraria + L4D2
(22, 9, 13, 1, 199000),
(23, 9, 14, 1, 149000),
(24, 9, 15, 1, 99500),
(25, 9, 16, 1, 76500),
-- Order 10 (User 5): ER + Stardew
(26, 10, 6, 1, 499900),
(27, 10, 12, 1, 199000),
(28, 10, 14, 1, 149000),
(29, 10, 16, 1, 111800),
-- Order 11 (Cancelled, User 1): Phasmophobia
(30, 11, 17, 1, 239800),
-- Order 12 (User 2): MHW
(31, 12, 11, 1, 399900),
-- Order 13 (User 3): Rust + Phasmophobia
(32, 13, 19, 1, 399900),
(33, 13, 17, 1, 239900),
(34, 13, 16, 1, 8200);
SET IDENTITY_INSERT OrderDetails OFF;
GO

-- ============================================================================
-- 4. PAYMENTS (14 payments)
-- ============================================================================
SET IDENTITY_INSERT Payments ON;
INSERT INTO Payments (Id, OrderId, Amount, PaymentMethod, Status, TransactionId, Note, PaidAt, CreatedAt) VALUES
(1, 1, 1199800, 'Wallet', 'Completed', 'WALLET-TXN-001', N'Thanh toán từ ví cho đơn hàng GTA V + Valheim', DATEADD(DAY, -120, GETUTCDATE()), DATEADD(DAY, -120, GETUTCDATE())),
(2, 2, 1698800, 'VnPay', 'Completed', 'VNBANK-20260201-001', N'Thanh toán VnPay cho đơn Hogwarts Legacy Combo', DATEADD(DAY, -90, GETUTCDATE()), DATEADD(DAY, -90, GETUTCDATE())),
(3, 3, 742000, 'Momo', 'Completed', 'MOMO-20260301-001', N'Thanh toán Momo Stardew + Terraria + L4D2', DATEADD(DAY, -60, GETUTCDATE()), DATEADD(DAY, -60, GETUTCDATE())),
(4, 4, 1249750, 'Wallet', 'Completed', 'WALLET-TXN-002', N'Thanh toán ví Elden Ring + Sekiro + DRG', DATEADD(DAY, -45, GETUTCDATE()), DATEADD(DAY, -45, GETUTCDATE())),
(5, 5, 478500, 'VnPay', 'Completed', 'VNBANK-20260315-001', N'Thanh toán VnPay Stardew + GMod + Terraria', DATEADD(DAY, -30, GETUTCDATE()), DATEADD(DAY, -30, GETUTCDATE())),
(6, 6, 799900, 'Momo', 'Completed', 'MOMO-20260320-001', N'Thanh toán Momo Cyberpunk 2077', DATEADD(DAY, -25, GETUTCDATE()), DATEADD(DAY, -25, GETUTCDATE())),
(7, 7, 1299600, 'Wallet', 'Completed', 'WALLET-TXN-003', N'Thanh toán ví Valheim + RDR2 combo', DATEADD(DAY, -20, GETUTCDATE()), DATEADD(DAY, -20, GETUTCDATE())),
(8, 8, 1749000, 'VnPay', 'Completed', 'VNBANK-20260401-001', N'Thanh toán VnPay BG3 + Civ VI', DATEADD(DAY, -15, GETUTCDATE()), DATEADD(DAY, -15, GETUTCDATE())),
(9, 9, 524000, 'Momo', 'Completed', 'MOMO-20260402-001', N'Thanh toán Momo Terraria + L4D2 + GMod', DATEADD(DAY, -14, GETUTCDATE()), DATEADD(DAY, -14, GETUTCDATE())),
(10, 10, 959700, 'Wallet', 'Completed', 'WALLET-TXN-004', N'Thanh toán ví ER + Stardew + L4D2', DATEADD(DAY, -10, GETUTCDATE()), DATEADD(DAY, -10, GETUTCDATE())),
(11, 12, 399900, 'Wallet', 'Completed', 'WALLET-TXN-005', N'Thanh toán ví Monster Hunter World', DATEADD(DAY, -7, GETUTCDATE()), DATEADD(DAY, -7, GETUTCDATE())),
(12, 13, 648000, 'Momo', 'Completed', 'MOMO-20260406-001', N'Thanh toán Momo Rust + Phasmophobia', DATEADD(DAY, -6, GETUTCDATE()), DATEADD(DAY, -6, GETUTCDATE())),
(13, 15, 1199900, 'VnPay', 'Completed', 'VNBANK-20260408-001', N'Thanh toán VnPay BG3', DATEADD(DAY, -4, GETUTCDATE()), DATEADD(DAY, -4, GETUTCDATE())),
(14, 16, 349500, 'Momo', 'Completed', 'MOMO-20260409-001', N'Thanh toán Momo Stardew + Among Us', DATEADD(DAY, -3, GETUTCDATE()), DATEADD(DAY, -3, GETUTCDATE()));
SET IDENTITY_INSERT Payments OFF;
GO

-- ============================================================================
-- 5. LIBRARIES (23 items)
-- Mỗi OrderDetail có GameId != thuộc Order hoàn thành sẽ được thêm vào Library
-- ============================================================================
SET IDENTITY_INSERT Libraries ON;
INSERT INTO Libraries (Id, UserId, GameId, GameKeyId, AcquiredAt, LastPlayedAt, TotalPlayTime) VALUES
-- User 1: GTA V, Valheim
(1, 1, 5, NULL, DATEADD(DAY, -120, GETUTCDATE()), DATEADD(DAY, -30, GETUTCDATE()), 14820),
(2, 1, 18, NULL, DATEADD(DAY, -120, GETUTCDATE()), DATEADD(DAY, -25, GETUTCDATE()), 716),
-- User 2: ETS2, Hogwarts, GTA V, Stardew, Terraria, L4D2, Among Us
(3, 2, 23, NULL, DATEADD(DAY, -90, GETUTCDATE()), DATEADD(DAY, -10, GETUTCDATE()), 4110),
(4, 2, 21, NULL, DATEADD(DAY, -90, GETUTCDATE()), DATEADD(DAY, -20, GETUTCDATE()), 14820),
(5, 2, 5, NULL, DATEADD(DAY, -90, GETUTCDATE()), DATEADD(DAY, -15, GETUTCDATE()), 300),
(6, 2, 12, NULL, DATEADD(DAY, -60, GETUTCDATE()), DATEADD(DAY, -5, GETUTCDATE()), 9000),
(7, 2, 13, NULL, DATEADD(DAY, -60, GETUTCDATE()), DATEADD(DAY, -40, GETUTCDATE()), 21600),
(8, 2, 14, NULL, DATEADD(DAY, -60, GETUTCDATE()), DATEADD(DAY, -50, GETUTCDATE()), 7200),
(9, 2, 16, NULL, DATEADD(DAY, -60, GETUTCDATE()), GETUTCDATE(), 1200),
(10, 2, 11, NULL, DATEADD(DAY, -7, GETUTCDATE()), DATEADD(DAY, -1, GETUTCDATE()), 1800),
-- User 3: Elden Ring, Sekiro, DRG, Stardew, GMod, Terraria, Rust, Phasmophobia
(11, 3, 6, NULL, DATEADD(DAY, -45, GETUTCDATE()), DATEADD(DAY, -10, GETUTCDATE()), 21600),
(12, 3, 29, NULL, DATEADD(DAY, -45, GETUTCDATE()), DATEADD(DAY, -20, GETUTCDATE()), 14400),
(13, 3, 55, NULL, DATEADD(DAY, -45, GETUTCDATE()), GETUTCDATE(), 6000),
(14, 3, 12, NULL, DATEADD(DAY, -30, GETUTCDATE()), DATEADD(DAY, -15, GETUTCDATE()), 3600),
(15, 3, 15, NULL, DATEADD(DAY, -30, GETUTCDATE()), DATEADD(DAY, -25, GETUTCDATE()), 7200),
(16, 3, 13, NULL, DATEADD(DAY, -30, GETUTCDATE()), DATEADD(DAY, -22, GETUTCDATE()), 5400),
(17, 3, 19, NULL, DATEADD(DAY, -6, GETUTCDATE()), GETUTCDATE(), 600),
(18, 3, 17, NULL, DATEADD(DAY, -6, GETUTCDATE()), DATEADD(DAY, -2, GETUTCDATE()), 240),
-- User 4: Cyberpunk, Valheim, RDR2, Among Us, BG3, Civ VI
(19, 4, 7, NULL, DATEADD(DAY, -25, GETUTCDATE()), GETUTCDATE(), 7200),
(20, 4, 9, NULL, DATEADD(DAY, -20, GETUTCDATE()), DATEADD(DAY, -5, GETUTCDATE()), 14400),
(21, 4, 8, NULL, DATEADD(DAY, -15, GETUTCDATE()), GETUTCDATE(), 36000),
(22, 4, 22, NULL, DATEADD(DAY, -15, GETUTCDATE()), DATEADD(DAY, -8, GETUTCDATE()), 5400),
-- User 5: Terraria, L4D2, GMod, Among Us, Elden Ring, Stardew
(23, 5, 13, NULL, DATEADD(DAY, -14, GETUTCDATE()), DATEADD(DAY, -3, GETUTCDATE()), 7200);
SET IDENTITY_INSERT Libraries OFF;
GO

-- ============================================================================
-- 6. NOTIFICATIONS (7 notifications)
-- ============================================================================
SET IDENTITY_INSERT Notifications ON;
INSERT INTO Notifications (Id, UserId, Title, Message, Link, IsRead, CreatedAt) VALUES
(1, 1, N'Đơn hàng hoàn tất', N'Đơn hàng #1 của bạn đã được xử lý thành công. Cảm ơn bạn đã mua sắm!', '/orders', 1, DATEADD(DAY, -120, GETUTCDATE())),
(2, 2, N'Đơn hàng hoàn tất', N'Đơn hàng #2 của bạn đã được xử lý thành công. Cảm ơn bạn đã mua sắm!', '/orders', 1, DATEADD(DAY, -90, GETUTCDATE())),
(3, 3, N'Game mới trong thư viện', N'ELDEN RING đã được thêm vào thư viện của bạn! Chúc bạn chơi game vui vẻ.', '/library', 1, DATEADD(DAY, -45, GETUTCDATE())),
(4, 4, N'Khuyến mãi hot!', N'Cyberpunk 2077 đang giảm giá 50% - chỉ còn 799.900₫!', '/store', 1, DATEADD(DAY, -30, GETUTCDATE())),
(5, 2, N'Đơn hàng hoàn tất', N'Đơn hàng #12 của bạn đã được xử lý thành công.', '/orders', 0, DATEADD(DAY, -7, GETUTCDATE())),
(6, 3, N'Đơn hàng hoàn tất', N'Đơn hàng #13 của bạn đã được xử lý thành công.', '/orders', 0, DATEADD(DAY, -6, GETUTCDATE())),
(7, 5, N'Đơn hàng hoàn tất', N'Đơn hàng #15 của bạn đã được xử lý thành công.', '/orders', 0, DATEADD(DAY, -4, GETUTCDATE()));
SET IDENTITY_INSERT Notifications OFF;
GO

PRINT N'✅ Inserted Orders, Libraries, Wishlists, Payments, Notifications successfully!';
