USE [master]
GO
  /****** Object:  Database [GameStoreDB]    Script Date: 06-May-26 6:44:45 PM ******/
  CREATE DATABASE [GameStoreDB] CONTAINMENT = NONE ON PRIMARY (
    NAME = N'GameStoreDB',
    FILENAME = N'/var/opt/mssql/data/GameStoreDB.mdf',
    SIZE = 8192KB,
    MAXSIZE = UNLIMITED,
    FILEGROWTH = 65536KB
  ) LOG ON (
    NAME = N'GameStoreDB_log',
    FILENAME = N'/var/opt/mssql/data/GameStoreDB_log.ldf',
    SIZE = 8192KB,
    MAXSIZE = 2048GB,
    FILEGROWTH = 65536KB
  ) WITH CATALOG_COLLATION = DATABASE_DEFAULT,
  LEDGER = OFF
GO
  ALTER DATABASE [GameStoreDB]
SET
  COMPATIBILITY_LEVEL = 160
GO
  IF (
    1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled')
  ) begin EXEC [GameStoreDB].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
  ALTER DATABASE [GameStoreDB]
SET
  ANSI_NULL_DEFAULT OFF
GO
  ALTER DATABASE [GameStoreDB]
SET
  ANSI_NULLS OFF
GO
  ALTER DATABASE [GameStoreDB]
SET
  ANSI_PADDING OFF
GO
  ALTER DATABASE [GameStoreDB]
SET
  ANSI_WARNINGS OFF
GO
  ALTER DATABASE [GameStoreDB]
SET
  ARITHABORT OFF
GO
  ALTER DATABASE [GameStoreDB]
SET
  AUTO_CLOSE OFF
GO
  ALTER DATABASE [GameStoreDB]
SET
  AUTO_SHRINK OFF
GO
  ALTER DATABASE [GameStoreDB]
SET
  AUTO_UPDATE_STATISTICS ON
GO
  ALTER DATABASE [GameStoreDB]
SET
  CURSOR_CLOSE_ON_COMMIT OFF
GO
  ALTER DATABASE [GameStoreDB]
SET
  CURSOR_DEFAULT GLOBAL
GO
  ALTER DATABASE [GameStoreDB]
SET
  CONCAT_NULL_YIELDS_NULL OFF
GO
  ALTER DATABASE [GameStoreDB]
SET
  NUMERIC_ROUNDABORT OFF
GO
  ALTER DATABASE [GameStoreDB]
SET
  QUOTED_IDENTIFIER OFF
GO
  ALTER DATABASE [GameStoreDB]
SET
  RECURSIVE_TRIGGERS OFF
GO
  ALTER DATABASE [GameStoreDB]
SET
  ENABLE_BROKER
GO
  ALTER DATABASE [GameStoreDB]
SET
  AUTO_UPDATE_STATISTICS_ASYNC OFF
GO
  ALTER DATABASE [GameStoreDB]
SET
  DATE_CORRELATION_OPTIMIZATION OFF
GO
  ALTER DATABASE [GameStoreDB]
SET
  TRUSTWORTHY OFF
GO
  ALTER DATABASE [GameStoreDB]
SET
  ALLOW_SNAPSHOT_ISOLATION OFF
GO
  ALTER DATABASE [GameStoreDB]
SET
  PARAMETERIZATION SIMPLE
GO
  ALTER DATABASE [GameStoreDB]
SET
  READ_COMMITTED_SNAPSHOT ON
GO
  ALTER DATABASE [GameStoreDB]
SET
  HONOR_BROKER_PRIORITY OFF
GO
  ALTER DATABASE [GameStoreDB]
SET
  RECOVERY FULL
GO
  ALTER DATABASE [GameStoreDB]
SET
  MULTI_USER
GO
  ALTER DATABASE [GameStoreDB]
SET
  PAGE_VERIFY CHECKSUM
GO
  ALTER DATABASE [GameStoreDB]
SET
  DB_CHAINING OFF
GO
  ALTER DATABASE [GameStoreDB]
SET
  FILESTREAM(NON_TRANSACTED_ACCESS = OFF)
GO
  ALTER DATABASE [GameStoreDB]
SET
  TARGET_RECOVERY_TIME = 60 SECONDS
GO
  ALTER DATABASE [GameStoreDB]
SET
  DELAYED_DURABILITY = DISABLED
GO
  ALTER DATABASE [GameStoreDB]
SET
  ACCELERATED_DATABASE_RECOVERY = OFF
GO
  EXEC sys.sp_db_vardecimal_storage_format N'GameStoreDB',
  N 'ON'
GO
  ALTER DATABASE [GameStoreDB]
SET
  QUERY_STORE = ON
GO
  ALTER DATABASE [GameStoreDB]
SET
  QUERY_STORE (
    OPERATION_MODE = READ_WRITE,
    CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30),
    DATA_FLUSH_INTERVAL_SECONDS = 900,
    INTERVAL_LENGTH_MINUTES = 60,
    MAX_STORAGE_SIZE_MB = 1000,
    QUERY_CAPTURE_MODE = AUTO,
    SIZE_BASED_CLEANUP_MODE = AUTO,
    MAX_PLANS_PER_QUERY = 200,
    WAIT_STATS_CAPTURE_MODE = ON
  )
GO
  USE [GameStoreDB]
GO
  /****** Object:  Table [dbo].[__EFMigrationsHistory]    Script Date: 06-May-26 6:44:45 PM ******/
SET
  ANSI_NULLS ON
GO
SET
  QUOTED_IDENTIFIER ON
GO
  CREATE TABLE [dbo].[__EFMigrationsHistory](
    [MigrationId] [nvarchar](150) NOT NULL,
    [ProductVersion] [nvarchar](32) NOT NULL,
    CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY CLUSTERED ([MigrationId] ASC) WITH (
      PAD_INDEX = OFF,
      STATISTICS_NORECOMPUTE = OFF,
      IGNORE_DUP_KEY = OFF,
      ALLOW_ROW_LOCKS = ON,
      ALLOW_PAGE_LOCKS = ON,
      OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF
    ) ON [PRIMARY]
  ) ON [PRIMARY]
GO
  /****** Object:  Table [dbo].[AccessTokens]    Script Date: 06-May-26 6:44:46 PM ******/
SET
  ANSI_NULLS ON
GO
SET
  QUOTED_IDENTIFIER ON
GO
  CREATE TABLE [dbo].[AccessTokens](
    [Id] [int] IDENTITY(1, 1) NOT NULL,
    [Guid] [uniqueidentifier] NOT NULL,
    [UserId] [int] NOT NULL,
    [Token] [nvarchar](max) NOT NULL,
    [Expirated] [datetime2](7) NOT NULL,
    [CreatedBy] [nvarchar](max) NOT NULL,
    [Created] [datetime2](7) NOT NULL,
    [CreatedDateTime] [datetime2](7) NOT NULL,
    [CreatedUser] [nvarchar](max) NOT NULL,
    CONSTRAINT [PK_AccessTokens] PRIMARY KEY CLUSTERED ([Id] ASC) WITH (
      PAD_INDEX = OFF,
      STATISTICS_NORECOMPUTE = OFF,
      IGNORE_DUP_KEY = OFF,
      ALLOW_ROW_LOCKS = ON,
      ALLOW_PAGE_LOCKS = ON,
      OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF
    ) ON [PRIMARY]
  ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
  /****** Object:  Table [dbo].[GameGenres]    Script Date: 06-May-26 6:44:46 PM ******/
SET
  ANSI_NULLS ON
GO
SET
  QUOTED_IDENTIFIER ON
GO
  CREATE TABLE [dbo].[GameGenres](
    [Id] [int] IDENTITY(1, 1) NOT NULL,
    [GameId] [int] NOT NULL,
    [GenreId] [int] NOT NULL,
    CONSTRAINT [PK_GameGenres] PRIMARY KEY CLUSTERED ([Id] ASC) WITH (
      PAD_INDEX = OFF,
      STATISTICS_NORECOMPUTE = OFF,
      IGNORE_DUP_KEY = OFF,
      ALLOW_ROW_LOCKS = ON,
      ALLOW_PAGE_LOCKS = ON,
      OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF
    ) ON [PRIMARY]
  ) ON [PRIMARY]
GO
  /****** Object:  Table [dbo].[GameKeys]    Script Date: 06-May-26 6:44:46 PM ******/
SET
  ANSI_NULLS ON
GO
SET
  QUOTED_IDENTIFIER ON
GO
  CREATE TABLE [dbo].[GameKeys](
    [Id] [int] IDENTITY(1, 1) NOT NULL,
    [GameId] [int] NOT NULL,
    [KeyCode] [nvarchar](450) NOT NULL,
    [IsUsed] [bit] NOT NULL,
    [OrderDetailId] [int] NULL,
    [UsedAt] [datetime2](7) NULL,
    [CreatedAt] [datetime2](7) NOT NULL,
    [ExpiresAt] [datetime2](7) NULL,
    CONSTRAINT [PK_GameKeys] PRIMARY KEY CLUSTERED ([Id] ASC) WITH (
      PAD_INDEX = OFF,
      STATISTICS_NORECOMPUTE = OFF,
      IGNORE_DUP_KEY = OFF,
      ALLOW_ROW_LOCKS = ON,
      ALLOW_PAGE_LOCKS = ON,
      OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF
    ) ON [PRIMARY]
  ) ON [PRIMARY]
GO
  /****** Object:  Table [dbo].[Games]    Script Date: 06-May-26 6:44:46 PM ******/
SET
  ANSI_NULLS ON
GO
SET
  QUOTED_IDENTIFIER ON
GO
  CREATE TABLE [dbo].[Games](
    [Id] [int] IDENTITY(1, 1) NOT NULL,
    [Title] [nvarchar](max) NOT NULL,
    [Description] [nvarchar](max) NOT NULL,
    [Price] [decimal](18, 2) NOT NULL,
    [DiscountPrice] [decimal](18, 2) NULL,
    [Developer] [nvarchar](max) NOT NULL,
    [Publisher] [nvarchar](max) NOT NULL,
    [ReleaseDate] [datetime2](7) NOT NULL,
    [TrailerUrl] [nvarchar](max) NOT NULL,
    [CoverImageUrl] [nvarchar](max) NOT NULL,
    [Screenshots] [nvarchar](max) NOT NULL,
    [TotalSales] [int] NOT NULL,
    [Rating] [float] NOT NULL,
    [RatingCount] [int] NOT NULL,
    [IsActive] [bit] NOT NULL,
    [CreatedAt] [datetime2](7) NOT NULL,
    [MinimumOS] [nvarchar](max) NOT NULL,
    [MinimumProcessor] [nvarchar](max) NOT NULL,
    [MinimumMemory] [nvarchar](max) NOT NULL,
    [MinimumGraphics] [nvarchar](max) NOT NULL,
    [MinimumStorage] [nvarchar](max) NOT NULL,
    CONSTRAINT [PK_Games] PRIMARY KEY CLUSTERED ([Id] ASC) WITH (
      PAD_INDEX = OFF,
      STATISTICS_NORECOMPUTE = OFF,
      IGNORE_DUP_KEY = OFF,
      ALLOW_ROW_LOCKS = ON,
      ALLOW_PAGE_LOCKS = ON,
      OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF
    ) ON [PRIMARY]
  ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
  /****** Object:  Table [dbo].[Genres]    Script Date: 06-May-26 6:44:46 PM ******/
SET
  ANSI_NULLS ON
GO
SET
  QUOTED_IDENTIFIER ON
GO
  CREATE TABLE [dbo].[Genres](
    [Id] [int] IDENTITY(1, 1) NOT NULL,
    [Name] [nvarchar](450) NOT NULL,
    [Description] [nvarchar](max) NOT NULL,
    [IconUrl] [nvarchar](max) NOT NULL,
    [IsActive] [bit] NOT NULL,
    CONSTRAINT [PK_Genres] PRIMARY KEY CLUSTERED ([Id] ASC) WITH (
      PAD_INDEX = OFF,
      STATISTICS_NORECOMPUTE = OFF,
      IGNORE_DUP_KEY = OFF,
      ALLOW_ROW_LOCKS = ON,
      ALLOW_PAGE_LOCKS = ON,
      OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF
    ) ON [PRIMARY]
  ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
  /****** Object:  Table [dbo].[Libraries]    Script Date: 06-May-26 6:44:46 PM ******/
SET
  ANSI_NULLS ON
GO
SET
  QUOTED_IDENTIFIER ON
GO
  CREATE TABLE [dbo].[Libraries](
    [Id] [int] IDENTITY(1, 1) NOT NULL,
    [UserId] [int] NOT NULL,
    [GameId] [int] NOT NULL,
    [GameKeyId] [int] NULL,
    [AcquiredAt] [datetime2](7) NOT NULL,
    [LastPlayedAt] [datetime2](7) NULL,
    [TotalPlayTime] [int] NOT NULL,
    CONSTRAINT [PK_Libraries] PRIMARY KEY CLUSTERED ([Id] ASC) WITH (
      PAD_INDEX = OFF,
      STATISTICS_NORECOMPUTE = OFF,
      IGNORE_DUP_KEY = OFF,
      ALLOW_ROW_LOCKS = ON,
      ALLOW_PAGE_LOCKS = ON,
      OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF
    ) ON [PRIMARY]
  ) ON [PRIMARY]
GO
  /****** Object:  Table [dbo].[OrderDetails]    Script Date: 06-May-26 6:44:46 PM ******/
SET
  ANSI_NULLS ON
GO
SET
  QUOTED_IDENTIFIER ON
GO
  CREATE TABLE [dbo].[OrderDetails](
    [Id] [int] IDENTITY(1, 1) NOT NULL,
    [OrderId] [int] NOT NULL,
    [GameId] [int] NOT NULL,
    [Quantity] [int] NOT NULL,
    [UnitPrice] [decimal](18, 2) NOT NULL,
    CONSTRAINT [PK_OrderDetails] PRIMARY KEY CLUSTERED ([Id] ASC) WITH (
      PAD_INDEX = OFF,
      STATISTICS_NORECOMPUTE = OFF,
      IGNORE_DUP_KEY = OFF,
      ALLOW_ROW_LOCKS = ON,
      ALLOW_PAGE_LOCKS = ON,
      OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF
    ) ON [PRIMARY]
  ) ON [PRIMARY]
GO
  /****** Object:  Table [dbo].[Orders]    Script Date: 06-May-26 6:44:46 PM ******/
SET
  ANSI_NULLS ON
GO
SET
  QUOTED_IDENTIFIER ON
GO
  CREATE TABLE [dbo].[Orders](
    [Id] [int] IDENTITY(1, 1) NOT NULL,
    [UserId] [int] NOT NULL,
    [OrderDate] [datetime2](7) NOT NULL,
    [TotalAmount] [decimal](18, 2) NOT NULL,
    [Status] [nvarchar](max) NOT NULL,
    [PaymentMethod] [nvarchar](max) NOT NULL,
    CONSTRAINT [PK_Orders] PRIMARY KEY CLUSTERED ([Id] ASC) WITH (
      PAD_INDEX = OFF,
      STATISTICS_NORECOMPUTE = OFF,
      IGNORE_DUP_KEY = OFF,
      ALLOW_ROW_LOCKS = ON,
      ALLOW_PAGE_LOCKS = ON,
      OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF
    ) ON [PRIMARY]
  ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
  /****** Object:  Table [dbo].[Payments]    Script Date: 06-May-26 6:44:46 PM ******/
SET
  ANSI_NULLS ON
GO
SET
  QUOTED_IDENTIFIER ON
GO
  CREATE TABLE [dbo].[Payments](
    [Id] [int] IDENTITY(1, 1) NOT NULL,
    [OrderId] [int] NOT NULL,
    [Amount] [decimal](18, 2) NOT NULL,
    [PaymentMethod] [nvarchar](50) NOT NULL,
    [Status] [nvarchar](50) NOT NULL,
    [TransactionId] [nvarchar](255) NULL,
    [Note] [nvarchar](max) NULL,
    [PaidAt] [datetime2](7) NOT NULL,
    [CreatedAt] [datetime2](7) NOT NULL,
    CONSTRAINT [PK_Payments] PRIMARY KEY CLUSTERED ([Id] ASC) WITH (
      PAD_INDEX = OFF,
      STATISTICS_NORECOMPUTE = OFF,
      IGNORE_DUP_KEY = OFF,
      ALLOW_ROW_LOCKS = ON,
      ALLOW_PAGE_LOCKS = ON,
      OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF
    ) ON [PRIMARY]
  ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
  /****** Object:  Table [dbo].[Reviews]    Script Date: 06-May-26 6:44:46 PM ******/
SET
  ANSI_NULLS ON
GO
SET
  QUOTED_IDENTIFIER ON
GO
  CREATE TABLE [dbo].[Reviews](
    [Id] [int] IDENTITY(1, 1) NOT NULL,
    [UserId] [int] NOT NULL,
    [GameId] [int] NOT NULL,
    [Rating] [int] NOT NULL,
    [Content] [nvarchar](max) NOT NULL,
    [IsRecommended] [bit] NOT NULL,
    [HelpfulCount] [int] NOT NULL,
    [CreatedAt] [datetime2](7) NOT NULL,
    [UpdatedAt] [datetime2](7) NOT NULL,
    CONSTRAINT [PK_Reviews] PRIMARY KEY CLUSTERED ([Id] ASC) WITH (
      PAD_INDEX = OFF,
      STATISTICS_NORECOMPUTE = OFF,
      IGNORE_DUP_KEY = OFF,
      ALLOW_ROW_LOCKS = ON,
      ALLOW_PAGE_LOCKS = ON,
      OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF
    ) ON [PRIMARY]
  ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
  /****** Object:  Table [dbo].[RolePermissions]    Script Date: 06-May-26 6:44:46 PM ******/
SET
  ANSI_NULLS ON
GO
SET
  QUOTED_IDENTIFIER ON
GO
  CREATE TABLE [dbo].[RolePermissions](
    [Id] [int] IDENTITY(1, 1) NOT NULL,
    [RoleId] [int] NOT NULL,
    [Permission] [nvarchar](100) NOT NULL,
    [CreatedAt] [datetime2](7) NOT NULL,
    CONSTRAINT [PK_RolePermissions] PRIMARY KEY CLUSTERED ([Id] ASC) WITH (
      PAD_INDEX = OFF,
      STATISTICS_NORECOMPUTE = OFF,
      IGNORE_DUP_KEY = OFF,
      ALLOW_ROW_LOCKS = ON,
      ALLOW_PAGE_LOCKS = ON,
      OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF
    ) ON [PRIMARY]
  ) ON [PRIMARY]
GO
  /****** Object:  Table [dbo].[Roles]    Script Date: 06-May-26 6:44:46 PM ******/
SET
  ANSI_NULLS ON
GO
SET
  QUOTED_IDENTIFIER ON
GO
  CREATE TABLE [dbo].[Roles](
    [Id] [int] IDENTITY(1, 1) NOT NULL,
    [Guid] [uniqueidentifier] NOT NULL,
    [Name] [nvarchar](max) NOT NULL,
    [Description] [nvarchar](max) NOT NULL,
    [CreatedBy] [nvarchar](max) NOT NULL,
    [Created] [datetime2](7) NOT NULL,
    [ModifiedBy] [nvarchar](max) NOT NULL,
    [Modified] [datetime2](7) NOT NULL,
    [IsDeleted] [bit] NOT NULL,
    [IsActive] [bit] NOT NULL,
    [CreatedDateTime] [datetime2](7) NOT NULL,
    [CreatedUser] [nvarchar](max) NOT NULL,
    CONSTRAINT [PK_Roles] PRIMARY KEY CLUSTERED ([Id] ASC) WITH (
      PAD_INDEX = OFF,
      STATISTICS_NORECOMPUTE = OFF,
      IGNORE_DUP_KEY = OFF,
      ALLOW_ROW_LOCKS = ON,
      ALLOW_PAGE_LOCKS = ON,
      OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF
    ) ON [PRIMARY]
  ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
  /****** Object:  Table [dbo].[Settings]    Script Date: 06-May-26 6:44:46 PM ******/
SET
  ANSI_NULLS ON
GO
SET
  QUOTED_IDENTIFIER ON
GO
  CREATE TABLE [dbo].[Settings](
    [Id] [int] IDENTITY(1, 1) NOT NULL,
    [Name] [nvarchar](450) NOT NULL,
    [Value] [nvarchar](max) NOT NULL,
    [Description] [nvarchar](max) NOT NULL,
    [CreatedBy] [nvarchar](max) NOT NULL,
    [Created] [datetime2](7) NOT NULL,
    [ModifiedBy] [nvarchar](max) NOT NULL,
    [Modified] [datetime2](7) NOT NULL,
    [IsDeleted] [bit] NOT NULL,
    [IsActive] [bit] NOT NULL,
    [CreatedDateTime] [datetime2](7) NOT NULL,
    [CreatedUser] [nvarchar](max) NOT NULL,
    CONSTRAINT [PK_Settings] PRIMARY KEY CLUSTERED ([Id] ASC) WITH (
      PAD_INDEX = OFF,
      STATISTICS_NORECOMPUTE = OFF,
      IGNORE_DUP_KEY = OFF,
      ALLOW_ROW_LOCKS = ON,
      ALLOW_PAGE_LOCKS = ON,
      OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF
    ) ON [PRIMARY]
  ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
  /****** Object:  Table [dbo].[UserRoles]    Script Date: 06-May-26 6:44:46 PM ******/
SET
  ANSI_NULLS ON
GO
SET
  QUOTED_IDENTIFIER ON
GO
  CREATE TABLE [dbo].[UserRoles](
    [Id] [int] IDENTITY(1, 1) NOT NULL,
    [Guid] [uniqueidentifier] NOT NULL,
    [UserId] [int] NOT NULL,
    [RoleId] [int] NOT NULL,
    [CreatedBy] [nvarchar](max) NOT NULL,
    [Created] [datetime2](7) NOT NULL,
    [ModifiedBy] [nvarchar](max) NOT NULL,
    [Modified] [datetime2](7) NOT NULL,
    [IsDeleted] [bit] NOT NULL,
    [CreatedDateTime] [datetime2](7) NOT NULL,
    [CreatedUser] [nvarchar](max) NOT NULL,
    CONSTRAINT [PK_UserRoles] PRIMARY KEY CLUSTERED ([Id] ASC) WITH (
      PAD_INDEX = OFF,
      STATISTICS_NORECOMPUTE = OFF,
      IGNORE_DUP_KEY = OFF,
      ALLOW_ROW_LOCKS = ON,
      ALLOW_PAGE_LOCKS = ON,
      OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF
    ) ON [PRIMARY]
  ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
  /****** Object:  Table [dbo].[Users]    Script Date: 06-May-26 6:44:46 PM ******/
SET
  ANSI_NULLS ON
GO
SET
  QUOTED_IDENTIFIER ON
GO
  CREATE TABLE [dbo].[Users](
    [Id] [int] IDENTITY(1, 1) NOT NULL,
    [Username] [nvarchar](450) NOT NULL,
    [Password] [nvarchar](max) NOT NULL,
    [Salt] [varbinary](max) NOT NULL,
    [DisplayName] [nvarchar](max) NOT NULL,
    [Email] [nvarchar](max) NOT NULL,
    [Phone] [nvarchar](max) NOT NULL,
    [AvatarUrl] [nvarchar](max) NOT NULL,
    [Wallet] [decimal](18, 2) NOT NULL,
    [IsActive] [bit] NOT NULL,
    [CreatedAt] [datetime2](7) NOT NULL,
    CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED ([Id] ASC) WITH (
      PAD_INDEX = OFF,
      STATISTICS_NORECOMPUTE = OFF,
      IGNORE_DUP_KEY = OFF,
      ALLOW_ROW_LOCKS = ON,
      ALLOW_PAGE_LOCKS = ON,
      OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF
    ) ON [PRIMARY]
  ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
  /****** Object:  Table [dbo].[Wishlists]    Script Date: 06-May-26 6:44:46 PM ******/
SET
  ANSI_NULLS ON
GO
SET
  QUOTED_IDENTIFIER ON
GO
  CREATE TABLE [dbo].[Wishlists](
    [Id] [int] IDENTITY(1, 1) NOT NULL,
    [UserId] [int] NOT NULL,
    [GameId] [int] NOT NULL,
    [AddedAt] [datetime2](7) NOT NULL,
    CONSTRAINT [PK_Wishlists] PRIMARY KEY CLUSTERED ([Id] ASC) WITH (
      PAD_INDEX = OFF,
      STATISTICS_NORECOMPUTE = OFF,
      IGNORE_DUP_KEY = OFF,
      ALLOW_ROW_LOCKS = ON,
      ALLOW_PAGE_LOCKS = ON,
      OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF
    ) ON [PRIMARY]
  ) ON [PRIMARY]
GO
  /****** Object:  Index [IX_AccessTokens_UserId]    Script Date: 06-May-26 6:44:46 PM ******/
  CREATE NONCLUSTERED INDEX [IX_AccessTokens_UserId] ON [dbo].[AccessTokens] ([UserId] ASC) WITH (
    PAD_INDEX = OFF,
    STATISTICS_NORECOMPUTE = OFF,
    SORT_IN_TEMPDB = OFF,
    DROP_EXISTING = OFF,
    ONLINE = OFF,
    ALLOW_ROW_LOCKS = ON,
    ALLOW_PAGE_LOCKS = ON,
    OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF
  ) ON [PRIMARY]
GO
  /****** Object:  Index [IX_GameGenres_GameId_GenreId]    Script Date: 06-May-26 6:44:46 PM ******/
  CREATE UNIQUE NONCLUSTERED INDEX [IX_GameGenres_GameId_GenreId] ON [dbo].[GameGenres] ([GameId] ASC, [GenreId] ASC) WITH (
    PAD_INDEX = OFF,
    STATISTICS_NORECOMPUTE = OFF,
    SORT_IN_TEMPDB = OFF,
    IGNORE_DUP_KEY = OFF,
    DROP_EXISTING = OFF,
    ONLINE = OFF,
    ALLOW_ROW_LOCKS = ON,
    ALLOW_PAGE_LOCKS = ON,
    OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF
  ) ON [PRIMARY]
GO
  /****** Object:  Index [IX_GameGenres_GenreId]    Script Date: 06-May-26 6:44:46 PM ******/
  CREATE NONCLUSTERED INDEX [IX_GameGenres_GenreId] ON [dbo].[GameGenres] ([GenreId] ASC) WITH (
    PAD_INDEX = OFF,
    STATISTICS_NORECOMPUTE = OFF,
    SORT_IN_TEMPDB = OFF,
    DROP_EXISTING = OFF,
    ONLINE = OFF,
    ALLOW_ROW_LOCKS = ON,
    ALLOW_PAGE_LOCKS = ON,
    OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF
  ) ON [PRIMARY]
GO
  /****** Object:  Index [IX_GameKeys_GameId]    Script Date: 06-May-26 6:44:46 PM ******/
  CREATE NONCLUSTERED INDEX [IX_GameKeys_GameId] ON [dbo].[GameKeys] ([GameId] ASC) WITH (
    PAD_INDEX = OFF,
    STATISTICS_NORECOMPUTE = OFF,
    SORT_IN_TEMPDB = OFF,
    DROP_EXISTING = OFF,
    ONLINE = OFF,
    ALLOW_ROW_LOCKS = ON,
    ALLOW_PAGE_LOCKS = ON,
    OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF
  ) ON [PRIMARY]
GO
SET
  ANSI_PADDING ON
GO
  /****** Object:  Index [IX_GameKeys_KeyCode]    Script Date: 06-May-26 6:44:46 PM ******/
  CREATE UNIQUE NONCLUSTERED INDEX [IX_GameKeys_KeyCode] ON [dbo].[GameKeys] ([KeyCode] ASC) WITH (
    PAD_INDEX = OFF,
    STATISTICS_NORECOMPUTE = OFF,
    SORT_IN_TEMPDB = OFF,
    IGNORE_DUP_KEY = OFF,
    DROP_EXISTING = OFF,
    ONLINE = OFF,
    ALLOW_ROW_LOCKS = ON,
    ALLOW_PAGE_LOCKS = ON,
    OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF
  ) ON [PRIMARY]
GO
  /****** Object:  Index [IX_GameKeys_OrderDetailId]    Script Date: 06-May-26 6:44:46 PM ******/
  CREATE NONCLUSTERED INDEX [IX_GameKeys_OrderDetailId] ON [dbo].[GameKeys] ([OrderDetailId] ASC) WITH (
    PAD_INDEX = OFF,
    STATISTICS_NORECOMPUTE = OFF,
    SORT_IN_TEMPDB = OFF,
    DROP_EXISTING = OFF,
    ONLINE = OFF,
    ALLOW_ROW_LOCKS = ON,
    ALLOW_PAGE_LOCKS = ON,
    OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF
  ) ON [PRIMARY]
GO
SET
  ANSI_PADDING ON
GO
  /****** Object:  Index [IX_Genres_Name]    Script Date: 06-May-26 6:44:46 PM ******/
  CREATE UNIQUE NONCLUSTERED INDEX [IX_Genres_Name] ON [dbo].[Genres] ([Name] ASC) WITH (
    PAD_INDEX = OFF,
    STATISTICS_NORECOMPUTE = OFF,
    SORT_IN_TEMPDB = OFF,
    IGNORE_DUP_KEY = OFF,
    DROP_EXISTING = OFF,
    ONLINE = OFF,
    ALLOW_ROW_LOCKS = ON,
    ALLOW_PAGE_LOCKS = ON,
    OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF
  ) ON [PRIMARY]
GO
  /****** Object:  Index [IX_Libraries_GameId]    Script Date: 06-May-26 6:44:46 PM ******/
  CREATE NONCLUSTERED INDEX [IX_Libraries_GameId] ON [dbo].[Libraries] ([GameId] ASC) WITH (
    PAD_INDEX = OFF,
    STATISTICS_NORECOMPUTE = OFF,
    SORT_IN_TEMPDB = OFF,
    DROP_EXISTING = OFF,
    ONLINE = OFF,
    ALLOW_ROW_LOCKS = ON,
    ALLOW_PAGE_LOCKS = ON,
    OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF
  ) ON [PRIMARY]
GO
  /****** Object:  Index [IX_Libraries_GameKeyId]    Script Date: 06-May-26 6:44:46 PM ******/
  CREATE NONCLUSTERED INDEX [IX_Libraries_GameKeyId] ON [dbo].[Libraries] ([GameKeyId] ASC) WITH (
    PAD_INDEX = OFF,
    STATISTICS_NORECOMPUTE = OFF,
    SORT_IN_TEMPDB = OFF,
    DROP_EXISTING = OFF,
    ONLINE = OFF,
    ALLOW_ROW_LOCKS = ON,
    ALLOW_PAGE_LOCKS = ON,
    OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF
  ) ON [PRIMARY]
GO
  /****** Object:  Index [IX_Libraries_UserId_GameId]    Script Date: 06-May-26 6:44:46 PM ******/
  CREATE UNIQUE NONCLUSTERED INDEX [IX_Libraries_UserId_GameId] ON [dbo].[Libraries] ([UserId] ASC, [GameId] ASC) WITH (
    PAD_INDEX = OFF,
    STATISTICS_NORECOMPUTE = OFF,
    SORT_IN_TEMPDB = OFF,
    IGNORE_DUP_KEY = OFF,
    DROP_EXISTING = OFF,
    ONLINE = OFF,
    ALLOW_ROW_LOCKS = ON,
    ALLOW_PAGE_LOCKS = ON,
    OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF
  ) ON [PRIMARY]
GO
  /****** Object:  Index [IX_OrderDetails_GameId]    Script Date: 06-May-26 6:44:46 PM ******/
  CREATE NONCLUSTERED INDEX [IX_OrderDetails_GameId] ON [dbo].[OrderDetails] ([GameId] ASC) WITH (
    PAD_INDEX = OFF,
    STATISTICS_NORECOMPUTE = OFF,
    SORT_IN_TEMPDB = OFF,
    DROP_EXISTING = OFF,
    ONLINE = OFF,
    ALLOW_ROW_LOCKS = ON,
    ALLOW_PAGE_LOCKS = ON,
    OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF
  ) ON [PRIMARY]
GO
  /****** Object:  Index [IX_OrderDetails_OrderId]    Script Date: 06-May-26 6:44:46 PM ******/
  CREATE NONCLUSTERED INDEX [IX_OrderDetails_OrderId] ON [dbo].[OrderDetails] ([OrderId] ASC) WITH (
    PAD_INDEX = OFF,
    STATISTICS_NORECOMPUTE = OFF,
    SORT_IN_TEMPDB = OFF,
    DROP_EXISTING = OFF,
    ONLINE = OFF,
    ALLOW_ROW_LOCKS = ON,
    ALLOW_PAGE_LOCKS = ON,
    OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF
  ) ON [PRIMARY]
GO
  /****** Object:  Index [IX_Orders_UserId]    Script Date: 06-May-26 6:44:46 PM ******/
  CREATE NONCLUSTERED INDEX [IX_Orders_UserId] ON [dbo].[Orders] ([UserId] ASC) WITH (
    PAD_INDEX = OFF,
    STATISTICS_NORECOMPUTE = OFF,
    SORT_IN_TEMPDB = OFF,
    DROP_EXISTING = OFF,
    ONLINE = OFF,
    ALLOW_ROW_LOCKS = ON,
    ALLOW_PAGE_LOCKS = ON,
    OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF
  ) ON [PRIMARY]
GO
  /****** Object:  Index [IX_Payments_OrderId]    Script Date: 06-May-26 6:44:46 PM ******/
  CREATE NONCLUSTERED INDEX [IX_Payments_OrderId] ON [dbo].[Payments] ([OrderId] ASC) WITH (
    PAD_INDEX = OFF,
    STATISTICS_NORECOMPUTE = OFF,
    SORT_IN_TEMPDB = OFF,
    DROP_EXISTING = OFF,
    ONLINE = OFF,
    ALLOW_ROW_LOCKS = ON,
    ALLOW_PAGE_LOCKS = ON,
    OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF
  ) ON [PRIMARY]
GO
SET
  ANSI_PADDING ON
GO
  /****** Object:  Index [IX_Payments_Status]    Script Date: 06-May-26 6:44:46 PM ******/
  CREATE NONCLUSTERED INDEX [IX_Payments_Status] ON [dbo].[Payments] ([Status] ASC) WITH (
    PAD_INDEX = OFF,
    STATISTICS_NORECOMPUTE = OFF,
    SORT_IN_TEMPDB = OFF,
    DROP_EXISTING = OFF,
    ONLINE = OFF,
    ALLOW_ROW_LOCKS = ON,
    ALLOW_PAGE_LOCKS = ON,
    OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF
  ) ON [PRIMARY]
GO
  /****** Object:  Index [IX_Reviews_GameId]    Script Date: 06-May-26 6:44:46 PM ******/
  CREATE NONCLUSTERED INDEX [IX_Reviews_GameId] ON [dbo].[Reviews] ([GameId] ASC) WITH (
    PAD_INDEX = OFF,
    STATISTICS_NORECOMPUTE = OFF,
    SORT_IN_TEMPDB = OFF,
    DROP_EXISTING = OFF,
    ONLINE = OFF,
    ALLOW_ROW_LOCKS = ON,
    ALLOW_PAGE_LOCKS = ON,
    OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF
  ) ON [PRIMARY]
GO
  /****** Object:  Index [IX_Reviews_UserId_GameId]    Script Date: 06-May-26 6:44:46 PM ******/
  CREATE UNIQUE NONCLUSTERED INDEX [IX_Reviews_UserId_GameId] ON [dbo].[Reviews] ([UserId] ASC, [GameId] ASC) WITH (
    PAD_INDEX = OFF,
    STATISTICS_NORECOMPUTE = OFF,
    SORT_IN_TEMPDB = OFF,
    IGNORE_DUP_KEY = OFF,
    DROP_EXISTING = OFF,
    ONLINE = OFF,
    ALLOW_ROW_LOCKS = ON,
    ALLOW_PAGE_LOCKS = ON,
    OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF
  ) ON [PRIMARY]
GO
SET
  ANSI_PADDING ON
GO
  /****** Object:  Index [IX_RolePermissions_RoleId_Permission]    Script Date: 06-May-26 6:44:46 PM ******/
  CREATE UNIQUE NONCLUSTERED INDEX [IX_RolePermissions_RoleId_Permission] ON [dbo].[RolePermissions] ([RoleId] ASC, [Permission] ASC) WITH (
    PAD_INDEX = OFF,
    STATISTICS_NORECOMPUTE = OFF,
    SORT_IN_TEMPDB = OFF,
    IGNORE_DUP_KEY = OFF,
    DROP_EXISTING = OFF,
    ONLINE = OFF,
    ALLOW_ROW_LOCKS = ON,
    ALLOW_PAGE_LOCKS = ON,
    OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF
  ) ON [PRIMARY]
GO
SET
  ANSI_PADDING ON
GO
  /****** Object:  Index [IX_Settings_Name]    Script Date: 06-May-26 6:44:46 PM ******/
  CREATE UNIQUE NONCLUSTERED INDEX [IX_Settings_Name] ON [dbo].[Settings] ([Name] ASC) WITH (
    PAD_INDEX = OFF,
    STATISTICS_NORECOMPUTE = OFF,
    SORT_IN_TEMPDB = OFF,
    IGNORE_DUP_KEY = OFF,
    DROP_EXISTING = OFF,
    ONLINE = OFF,
    ALLOW_ROW_LOCKS = ON,
    ALLOW_PAGE_LOCKS = ON,
    OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF
  ) ON [PRIMARY]
GO
  /****** Object:  Index [IX_UserRoles_RoleId]    Script Date: 06-May-26 6:44:46 PM ******/
  CREATE NONCLUSTERED INDEX [IX_UserRoles_RoleId] ON [dbo].[UserRoles] ([RoleId] ASC) WITH (
    PAD_INDEX = OFF,
    STATISTICS_NORECOMPUTE = OFF,
    SORT_IN_TEMPDB = OFF,
    DROP_EXISTING = OFF,
    ONLINE = OFF,
    ALLOW_ROW_LOCKS = ON,
    ALLOW_PAGE_LOCKS = ON,
    OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF
  ) ON [PRIMARY]
GO
  /****** Object:  Index [IX_UserRoles_UserId_RoleId]    Script Date: 06-May-26 6:44:46 PM ******/
  CREATE UNIQUE NONCLUSTERED INDEX [IX_UserRoles_UserId_RoleId] ON [dbo].[UserRoles] ([UserId] ASC, [RoleId] ASC) WITH (
    PAD_INDEX = OFF,
    STATISTICS_NORECOMPUTE = OFF,
    SORT_IN_TEMPDB = OFF,
    IGNORE_DUP_KEY = OFF,
    DROP_EXISTING = OFF,
    ONLINE = OFF,
    ALLOW_ROW_LOCKS = ON,
    ALLOW_PAGE_LOCKS = ON,
    OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF
  ) ON [PRIMARY]
GO
SET
  ANSI_PADDING ON
GO
  /****** Object:  Index [IX_Users_Username]    Script Date: 06-May-26 6:44:46 PM ******/
  CREATE UNIQUE NONCLUSTERED INDEX [IX_Users_Username] ON [dbo].[Users] ([Username] ASC) WITH (
    PAD_INDEX = OFF,
    STATISTICS_NORECOMPUTE = OFF,
    SORT_IN_TEMPDB = OFF,
    IGNORE_DUP_KEY = OFF,
    DROP_EXISTING = OFF,
    ONLINE = OFF,
    ALLOW_ROW_LOCKS = ON,
    ALLOW_PAGE_LOCKS = ON,
    OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF
  ) ON [PRIMARY]
GO
  /****** Object:  Index [IX_Wishlists_GameId]    Script Date: 06-May-26 6:44:46 PM ******/
  CREATE NONCLUSTERED INDEX [IX_Wishlists_GameId] ON [dbo].[Wishlists] ([GameId] ASC) WITH (
    PAD_INDEX = OFF,
    STATISTICS_NORECOMPUTE = OFF,
    SORT_IN_TEMPDB = OFF,
    DROP_EXISTING = OFF,
    ONLINE = OFF,
    ALLOW_ROW_LOCKS = ON,
    ALLOW_PAGE_LOCKS = ON,
    OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF
  ) ON [PRIMARY]
GO
  /****** Object:  Index [IX_Wishlists_UserId_GameId]    Script Date: 06-May-26 6:44:46 PM ******/
  CREATE UNIQUE NONCLUSTERED INDEX [IX_Wishlists_UserId_GameId] ON [dbo].[Wishlists] ([UserId] ASC, [GameId] ASC) WITH (
    PAD_INDEX = OFF,
    STATISTICS_NORECOMPUTE = OFF,
    SORT_IN_TEMPDB = OFF,
    IGNORE_DUP_KEY = OFF,
    DROP_EXISTING = OFF,
    ONLINE = OFF,
    ALLOW_ROW_LOCKS = ON,
    ALLOW_PAGE_LOCKS = ON,
    OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF
  ) ON [PRIMARY]
GO
ALTER TABLE
  [dbo].[Payments]
ADD
  DEFAULT ('Wallet') FOR [PaymentMethod]
GO
ALTER TABLE
  [dbo].[Payments]
ADD
  DEFAULT ('Completed') FOR [Status]
GO
ALTER TABLE
  [dbo].[Payments]
ADD
  DEFAULT (getdate()) FOR [PaidAt]
GO
ALTER TABLE
  [dbo].[Payments]
ADD
  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE
  [dbo].[RolePermissions]
ADD
  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE
  [dbo].[AccessTokens] WITH CHECK
ADD
  CONSTRAINT [FK_AccessTokens_Users_UserId] FOREIGN KEY([UserId]) REFERENCES [dbo].[Users] ([Id]) ON DELETE CASCADE
GO
ALTER TABLE
  [dbo].[AccessTokens] CHECK CONSTRAINT [FK_AccessTokens_Users_UserId]
GO
ALTER TABLE
  [dbo].[GameGenres] WITH CHECK
ADD
  CONSTRAINT [FK_GameGenres_Games_GameId] FOREIGN KEY([GameId]) REFERENCES [dbo].[Games] ([Id]) ON DELETE CASCADE
GO
ALTER TABLE
  [dbo].[GameGenres] CHECK CONSTRAINT [FK_GameGenres_Games_GameId]
GO
ALTER TABLE
  [dbo].[GameGenres] WITH CHECK
ADD
  CONSTRAINT [FK_GameGenres_Genres_GenreId] FOREIGN KEY([GenreId]) REFERENCES [dbo].[Genres] ([Id]) ON DELETE CASCADE
GO
ALTER TABLE
  [dbo].[GameGenres] CHECK CONSTRAINT [FK_GameGenres_Genres_GenreId]
GO
ALTER TABLE
  [dbo].[GameKeys] WITH CHECK
ADD
  CONSTRAINT [FK_GameKeys_Games_GameId] FOREIGN KEY([GameId]) REFERENCES [dbo].[Games] ([Id]) ON DELETE CASCADE
GO
ALTER TABLE
  [dbo].[GameKeys] CHECK CONSTRAINT [FK_GameKeys_Games_GameId]
GO
ALTER TABLE
  [dbo].[GameKeys] WITH CHECK
ADD
  CONSTRAINT [FK_GameKeys_OrderDetails_OrderDetailId] FOREIGN KEY([OrderDetailId]) REFERENCES [dbo].[OrderDetails] ([Id])
GO
ALTER TABLE
  [dbo].[GameKeys] CHECK CONSTRAINT [FK_GameKeys_OrderDetails_OrderDetailId]
GO
ALTER TABLE
  [dbo].[Libraries] WITH CHECK
ADD
  CONSTRAINT [FK_Libraries_GameKeys_GameKeyId] FOREIGN KEY([GameKeyId]) REFERENCES [dbo].[GameKeys] ([Id])
GO
ALTER TABLE
  [dbo].[Libraries] CHECK CONSTRAINT [FK_Libraries_GameKeys_GameKeyId]
GO
ALTER TABLE
  [dbo].[Libraries] WITH CHECK
ADD
  CONSTRAINT [FK_Libraries_Games_GameId] FOREIGN KEY([GameId]) REFERENCES [dbo].[Games] ([Id]) ON DELETE CASCADE
GO
ALTER TABLE
  [dbo].[Libraries] CHECK CONSTRAINT [FK_Libraries_Games_GameId]
GO
ALTER TABLE
  [dbo].[Libraries] WITH CHECK
ADD
  CONSTRAINT [FK_Libraries_Users_UserId] FOREIGN KEY([UserId]) REFERENCES [dbo].[Users] ([Id]) ON DELETE CASCADE
GO
ALTER TABLE
  [dbo].[Libraries] CHECK CONSTRAINT [FK_Libraries_Users_UserId]
GO
ALTER TABLE
  [dbo].[OrderDetails] WITH CHECK
ADD
  CONSTRAINT [FK_OrderDetails_Games_GameId] FOREIGN KEY([GameId]) REFERENCES [dbo].[Games] ([Id]) ON DELETE CASCADE
GO
ALTER TABLE
  [dbo].[OrderDetails] CHECK CONSTRAINT [FK_OrderDetails_Games_GameId]
GO
ALTER TABLE
  [dbo].[OrderDetails] WITH CHECK
ADD
  CONSTRAINT [FK_OrderDetails_Orders_OrderId] FOREIGN KEY([OrderId]) REFERENCES [dbo].[Orders] ([Id]) ON DELETE CASCADE
GO
ALTER TABLE
  [dbo].[OrderDetails] CHECK CONSTRAINT [FK_OrderDetails_Orders_OrderId]
GO
ALTER TABLE
  [dbo].[Orders] WITH CHECK
ADD
  CONSTRAINT [FK_Orders_Users_UserId] FOREIGN KEY([UserId]) REFERENCES [dbo].[Users] ([Id]) ON DELETE CASCADE
GO
ALTER TABLE
  [dbo].[Orders] CHECK CONSTRAINT [FK_Orders_Users_UserId]
GO
ALTER TABLE
  [dbo].[Payments] WITH CHECK
ADD
  CONSTRAINT [FK_Payments_Orders_OrderId] FOREIGN KEY([OrderId]) REFERENCES [dbo].[Orders] ([Id]) ON DELETE CASCADE
GO
ALTER TABLE
  [dbo].[Payments] CHECK CONSTRAINT [FK_Payments_Orders_OrderId]
GO
ALTER TABLE
  [dbo].[Reviews] WITH CHECK
ADD
  CONSTRAINT [FK_Reviews_Games_GameId] FOREIGN KEY([GameId]) REFERENCES [dbo].[Games] ([Id]) ON DELETE CASCADE
GO
ALTER TABLE
  [dbo].[Reviews] CHECK CONSTRAINT [FK_Reviews_Games_GameId]
GO
ALTER TABLE
  [dbo].[Reviews] WITH CHECK
ADD
  CONSTRAINT [FK_Reviews_Users_UserId] FOREIGN KEY([UserId]) REFERENCES [dbo].[Users] ([Id]) ON DELETE CASCADE
GO
ALTER TABLE
  [dbo].[Reviews] CHECK CONSTRAINT [FK_Reviews_Users_UserId]
GO
ALTER TABLE
  [dbo].[RolePermissions] WITH CHECK
ADD
  CONSTRAINT [FK_RolePermissions_Roles_RoleId] FOREIGN KEY([RoleId]) REFERENCES [dbo].[Roles] ([Id]) ON DELETE CASCADE
GO
ALTER TABLE
  [dbo].[RolePermissions] CHECK CONSTRAINT [FK_RolePermissions_Roles_RoleId]
GO
ALTER TABLE
  [dbo].[UserRoles] WITH CHECK
ADD
  CONSTRAINT [FK_UserRoles_Roles_RoleId] FOREIGN KEY([RoleId]) REFERENCES [dbo].[Roles] ([Id]) ON DELETE CASCADE
GO
ALTER TABLE
  [dbo].[UserRoles] CHECK CONSTRAINT [FK_UserRoles_Roles_RoleId]
GO
ALTER TABLE
  [dbo].[UserRoles] WITH CHECK
ADD
  CONSTRAINT [FK_UserRoles_Users_UserId] FOREIGN KEY([UserId]) REFERENCES [dbo].[Users] ([Id]) ON DELETE CASCADE
GO
ALTER TABLE
  [dbo].[UserRoles] CHECK CONSTRAINT [FK_UserRoles_Users_UserId]
GO
ALTER TABLE
  [dbo].[Wishlists] WITH CHECK
ADD
  CONSTRAINT [FK_Wishlists_Games_GameId] FOREIGN KEY([GameId]) REFERENCES [dbo].[Games] ([Id]) ON DELETE CASCADE
GO
ALTER TABLE
  [dbo].[Wishlists] CHECK CONSTRAINT [FK_Wishlists_Games_GameId]
GO
ALTER TABLE
  [dbo].[Wishlists] WITH CHECK
ADD
  CONSTRAINT [FK_Wishlists_Users_UserId] FOREIGN KEY([UserId]) REFERENCES [dbo].[Users] ([Id]) ON DELETE CASCADE
GO
ALTER TABLE
  [dbo].[Wishlists] CHECK CONSTRAINT [FK_Wishlists_Users_UserId]
GO
  USE [master]
GO
  ALTER DATABASE [GameStoreDB]
SET
  READ_WRITE
GO
