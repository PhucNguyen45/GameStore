-- =====================================================
-- GameStore Database Update Script
-- Add: Payments, RolePermissions, GameKeys (enable), ExpiresAt for GameKeys
-- =====================================================

USE [GameStoreDB]
GO

-- ===== 1. PAYMENTS TABLE =====
-- Tracks payment transactions associated with orders
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Payments')
BEGIN
    CREATE TABLE [dbo].[Payments](
        [Id] [int] IDENTITY(1,1) NOT NULL,
        [OrderId] [int] NOT NULL,
        [Amount] [decimal](18, 2) NOT NULL,
        [PaymentMethod] [nvarchar](50) NOT NULL DEFAULT 'Wallet',
        [Status] [nvarchar](50) NOT NULL DEFAULT 'Completed',
        [TransactionId] [nvarchar](255) NULL,
        [Note] [nvarchar](max) NULL,
        [PaidAt] [datetime2](7) NOT NULL DEFAULT GETDATE(),
        [CreatedAt] [datetime2](7) NOT NULL DEFAULT GETDATE(),
     CONSTRAINT [PK_Payments] PRIMARY KEY CLUSTERED ([Id] ASC)
    ) ON [PRIMARY]

    ALTER TABLE [dbo].[Payments] WITH CHECK ADD CONSTRAINT [FK_Payments_Orders_OrderId]
        FOREIGN KEY([OrderId]) REFERENCES [dbo].[Orders] ([Id]) ON DELETE CASCADE
    
    CREATE NONCLUSTERED INDEX [IX_Payments_OrderId] ON [dbo].[Payments]([OrderId] ASC)
    CREATE NONCLUSTERED INDEX [IX_Payments_Status] ON [dbo].[Payments]([Status] ASC)
END
GO

-- ===== 2. Add ExpiresAt column to GameKeys =====
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('dbo.GameKeys') AND name = 'ExpiresAt')
BEGIN
    ALTER TABLE [dbo].[GameKeys] ADD [ExpiresAt] [datetime2](7) NULL
END
GO

-- ===== 3. ROLE PERMISSIONS TABLE =====
-- Defines granular permissions for each role
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'RolePermissions')
BEGIN
    CREATE TABLE [dbo].[RolePermissions](
        [Id] [int] IDENTITY(1,1) NOT NULL,
        [RoleId] [int] NOT NULL,
        [Permission] [nvarchar](100) NOT NULL,
        [CreatedAt] [datetime2](7) NOT NULL DEFAULT GETDATE(),
     CONSTRAINT [PK_RolePermissions] PRIMARY KEY CLUSTERED ([Id] ASC)
    ) ON [PRIMARY]

    ALTER TABLE [dbo].[RolePermissions] WITH CHECK ADD CONSTRAINT [FK_RolePermissions_Roles_RoleId]
        FOREIGN KEY([RoleId]) REFERENCES [dbo].[Roles] ([Id]) ON DELETE CASCADE

    CREATE UNIQUE NONCLUSTERED INDEX [IX_RolePermissions_RoleId_Permission]
        ON [dbo].[RolePermissions]([RoleId] ASC, [Permission] ASC)

    -- Seed default permissions for Admin role
    INSERT INTO [dbo].[RolePermissions] ([RoleId], [Permission]) VALUES
        (1, 'games.view'), (1, 'games.create'), (1, 'games.edit'), (1, 'games.delete'),
        (1, 'users.view'), (1, 'users.edit'), (1, 'users.ban'),
        (1, 'orders.view'), (1, 'orders.edit'),
        (1, 'categories.view'), (1, 'categories.create'), (1, 'categories.edit'), (1, 'categories.delete'),
        (1, 'gamekeys.view'), (1, 'gamekeys.create'), (1, 'gamekeys.delete'),
        (1, 'payments.view'), (1, 'payments.refund'),
        (1, 'roles.view'), (1, 'roles.create'), (1, 'roles.edit'), (1, 'roles.delete'),
        (1, 'staff.view'), (1, 'staff.assign')

    -- Seed default permissions for Staff role (new)
    IF NOT EXISTS (SELECT * FROM [dbo].[Roles] WHERE [Name] = 'Staff')
    BEGIN
        INSERT INTO [dbo].[Roles] ([Guid], [Name], [Description], [CreatedBy], [Created], [ModifiedBy], [Modified], [IsDeleted], [IsActive], [CreatedDateTime], [CreatedUser])
        VALUES (NEWID(), 'Staff', 'Store Staff - Limited access', 'system', GETDATE(), 'system', GETDATE(), 0, 1, GETDATE(), 'system')
        
        DECLARE @StaffRoleId INT = SCOPE_IDENTITY()
        INSERT INTO [dbo].[RolePermissions] ([RoleId], [Permission]) VALUES
            (@StaffRoleId, 'games.view'),
            (@StaffRoleId, 'orders.view'),
            (@StaffRoleId, 'categories.view'),
            (@StaffRoleId, 'gamekeys.view'),
            (@StaffRoleId, 'payments.view')
    END
END
GO

PRINT 'Database update completed successfully!'
GO
