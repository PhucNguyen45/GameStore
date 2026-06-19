--- README.md (原始)
<!-- README.md -->
# README.md

# 🎮 GameStore - Fullstack Game Distribution Platform

> A full-stack game store inspired by **Epic Games** and **Steam**, built with **.NET 10** + **React 19** + **SQL Server**.

![.NET](https://img.shields.io/badge/.NET-10.0-512BD4?logo=dotnet)
![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)
![SQL Server](https://img.shields.io/badge/SQL_Server-2022-CC2927?logo=microsoftsqlserver)
![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite)
![Zustand](https://img.shields.io/badge/Zustand-5.0-000?logo=zustand)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 📖 TABLE OF CONTENTS

- [About The Project](#-about-the-project)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Features](#-features)
- [Screenshots](#-screenshots)
- [Scripts](#-scripts)
- [Default Accounts](#-default-accounts)
- [Environment Variables](#-environment-variables)
- [Troubleshooting](#-troubleshooting)
- [Future Enhancements](#-future-enhancements)
- [Contributing](#-contributing)
- [Author](#-author)
- [License](#-license)

---

## 🎯 ABOUT THE PROJECT

GameStore is a **full-stack web application** simulating a digital game distribution platform. Users can browse, search, filter, purchase games, and manage their library. Admins have a full dashboard to manage games, users, and orders.

### Why this project?

This was built as a **university course project** to demonstrate:

- Full-stack development with .NET + React
- Repository Pattern + Service Layer architecture
- JWT Authentication & Role-based Authorization
- Entity Framework Core with SQL Server
- State management with Zustand
- Responsive UI design
- Microservices with API Gateway (Ocelot)

---

## 🛠️ TECH STACK

### Backend

| Technology                                                     | Version | Purpose           |
| -------------------------------------------------------------- | ------- | ----------------- |
| [.NET](https://dotnet.microsoft.com/)                          | 10.0    | Web API Framework |
| [Entity Framework Core](https://learn.microsoft.com/en-us/ef/) | 10.0    | ORM               |
| [SQL Server](https://www.microsoft.com/sql-server)             | 2022    | Database          |
| [JWT](https://jwt.io/)                                         | -       | Authentication    |
| [Ocelot](https://github.com/ThreeMammals/Ocelot)               | 23.x    | API Gateway       |
| [Swagger](https://swagger.io/)                                 | -       | API Documentation |

### Frontend

| Technology                                      | Version | Purpose          |
| ----------------------------------------------- | ------- | ---------------- |
| [React](https://react.dev/)                     | 19.2    | UI Library       |
| [Vite](https://vitejs.dev/)                     | 8.0     | Build Tool       |
| [React Router](https://reactrouter.com/)        | 7.14    | Routing          |
| [Zustand](https://zustand-demo.pmnd.rs/)        | 5.0     | State Management |
| [Axios](https://axios-http.com/)                | 1.15    | HTTP Client      |
| [Lucide React](https://lucide.dev/)             | 1.11    | Icons            |
| [React Hot Toast](https://react-hot-toast.com/) | 2.6     | Notifications    |

### Design

- **Inspiration**: Epic Games Store
- **Theme**: Dark (#121212) + Blue accent (#0078f2)
- **Font**: Inter (Google Fonts)
- **Styling**: CSS Variables + Inline Styles

---

## 📂 PROJECT STRUCTURE

```
GameStore/
│
├── 📦 GameStore.DTOs/                     # Data Transfer Objects
│   ├── User/
│   │   ├── Auth/LoginRequest.cs, RegisterRequest.cs, ForgotPasswordRequest.cs, ResetPasswordRequest.cs
│   │   ├── Games/GameCreateDto.cs, GameUpdateDto.cs
│   │   ├── Reviews/ReviewDto.cs, CreateReviewDto.cs
│   │   ├── Orders/CreateOrderDto.cs, OrderHistoryDto.cs, UpdateStatusDto.cs
│   │   ├── Wishlist/WishlistItemDto.cs
│   │   ├── Notifications/NotificationDto.cs
│   │   ├── Genres/GenreDto.cs
│   │   └── Users/TopUpRequest.cs, UpdateUserRequest.cs
│   ├── Admin/AdminGameCreateDto.cs, AdminGameUpdateDto.cs, AdminUserUpdateDto.cs,
│   │       AdminUpdateStatusDto.cs, GameKeyDto.cs, CategoryDto.cs, RoleDto.cs, RefundDto.cs
│   └── Common/PaginationHelper.cs, PagedResponse.cs
│
├── 🧩 GameStore.Entities/                # Entity Classes
│   ├── Audit/IAuditable.cs
│   ├── Auth/Role.cs, AccessToken.cs, PasswordResetToken.cs
│   ├── Games/Game.cs, Genre.cs, GameGenre.cs, GameKey.cs
│   ├── Store/Order.cs, OrderDetail.cs, Payment.cs, Library.cs, Wishlist.cs,
│   │       Review.cs, GameKey.cs, Notification.cs, RolePermission.cs
│   ├── Users/User.cs, UserRole.cs
│   └── Settings/Setting.cs
│
├── 🔧 GameStore.Common/                  # Shared Utilities
│   ├── Entity.cs                          # Base entity class
│   └── Auth/TokenHelper.cs                # JWT + Password hashing
│
├── 🗄️ GameStore.Repository/              # Data Access Layer
│   ├── EFCore/
│   │   ├── IRepository.cs / Repository.cs (generic)
│   │   ├── IGameRepository.cs / GameRepository.cs
│   │   ├── IUserRepository.cs / UserRepository.cs
│   │   ├── IOrderRepository.cs / OrderRepository.cs
│   │   ├── IGenreRepository.cs / GenreRepository.cs
│   │   └── GameQueryExtensions.cs
│   ├── GameStoreDbContext.cs              # EF Core DbContext
│   ├── GameStoreDbContextFactory.cs       # Design-time factory
│   └── Migrations/                        # 3 EF Core migrations
│
├── ⚙️ GameStore.Services/                # Business Logic Layer
│   ├── Authen/IUserService.cs / UserService.cs
│   ├── User/
│   │   ├── IGameService.cs / GameService.cs
│   │   ├── IGenreService.cs / GenreService.cs
│   │   ├── IOrderService.cs / OrderService.cs
│   │   ├── IWishlistService.cs / WishlistService.cs
│   │   ├── IReviewService.cs / ReviewService.cs
│   │   ├── ILibraryService.cs / LibraryService.cs
│   │   └── INotificationService.cs / NotificationService.cs
│   └── Admin/IAdminService.cs / AdminService.cs
│
├── 🔐 GameStore.AuthService/             # Authentication API (Port 5002)
│   ├── Controllers/
│   │   ├── Auth/AuthController.cs
│   │   └── User/UserController.cs
│   ├── Program.cs
│   └── appsettings.json
│
├── 📡 GameStore.APIService/              # Business API (Port 5001)
│   ├── Controllers/
│   │   ├── User/
│   │   │   ├── GamesController.cs
│   │   │   ├── GenresController.cs
│   │   │   ├── OrdersController.cs
│   │   │   ├── LibraryController.cs
│   │   │   ├── WishlistController.cs
│   │   │   ├── ReviewsController.cs
│   │   │   └── NotificationsController.cs
│   │   └── Admin/AdminController.cs
│   ├── Program.cs
│   └── appsettings.json
│
├── 🌐 GameStore.ApiGateway/              # API Gateway (Port 5000)
│   ├── ocelot.json                        # Route configuration
│   ├── Program.cs
│   └── appsettings.json
│
├── 🎨 GameStore.WebClient/               # React Frontend (Port 3000)
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/     Navbar.jsx, Footer.jsx, MainLayout.jsx
│   │   │   ├── games/      GameCard.jsx, GameCardSkeleton.jsx,
│   │   │   │               GameDetailSkeleton.jsx, GameNotFound.jsx,
│   │   │   │               GameKeysSection.jsx, OverviewSection.jsx,
│   │   │   │               RequirementsSection.jsx, ReviewSection.jsx,
│   │   │   │               TrailerPlayer.jsx
│   │   │   ├── store/      HeroBanner.jsx
│   │   │   ├── wallet/     WalletModal.jsx
│   │   │   ├── admin/      AdminSidebar.jsx, DashboardTab.jsx, GamesTab.jsx,
│   │   │   │               GameFormModal.jsx, CategoriesTab.jsx, UsersTab.jsx,
│   │   │   │               UserFormModal.jsx, DeleteUserModal.jsx,
│   │   │   │               OrdersTab.jsx, RevenueTab.jsx, GameKeysTab.jsx,
│   │   │   │               StaffRolesTab.jsx, SortableHeader.jsx,
│   │   │   │               DeleteConfirmModal.jsx, adminStyles.js
│   │   │   └── common/     PageSkeleton.jsx, LanguageSwitcher.jsx,
│   │   │                   ErrorBoundary.jsx, Pagination.jsx
│   │   ├── pages/
│   │   │   ├── StorePage.jsx, GameDetailPage.jsx, CartPage.jsx,
│   │   │   ├── LoginPage.jsx, RegisterPage.jsx, ForgotPasswordPage.jsx,
│   │   │   ├── ResetPasswordPage.jsx, ProfilePage.jsx, PaymentPage.jsx,
│   │   │   ├── LibraryPage.jsx, WishlistPage.jsx, PurchaseHistoryPage.jsx,
│   │   │   ├── InvoicePage.jsx, AdminPage.jsx
│   │   ├── hooks/          useResponsive.js
│   │   ├── contexts/       AuthContext.jsx
│   │   ├── stores/         cartStore.js (Zustand)
│   │   ├── services/       api.js (Axios)
│   │   ├── i18n/           i18n.js + locales/en.json, vi.json
│   │   ├── utils/          format.js
│   │   ├── styles/         global.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vite.config.js
│   └── package.json
│
├── 📜 run-all.sh     # Start all services
├── 🛑 kill-all.sh     # Stop all services
├── 🧪 dump-project.sh # Dump project into single file
├── 📋 GameStore.slnx  # Solution file
└── 📖 README.md       # This file
```

---

## 🗄️ DATABASE SCHEMA

Users ──┬── UserRoles ── Roles
├── Orders ── OrderDetails ── Games
├── Library ──────────────── Games
├── Wishlist ─────────────── Games
├── Reviews ──────────────── Games
└── AccessTokens

Games ──┬── GameGenres ── Genres
├── GameKeys
├── OrderDetails
├── Library
├── Wishlist
└── Reviews

---

## 🚀 GETTING STARTED

### Prerequisites

| Software   | Version | Download                                                                  |
| ---------- | ------- | ------------------------------------------------------------------------- |
| .NET SDK   | 10.0+   | [dotnet.microsoft.com](https://dotnet.microsoft.com/download/dotnet/10.0) |
| Node.js    | 20+     | [nodejs.org](https://nodejs.org/)                                         |
| SQL Server | 2022    | [microsoft.com/sql-server](https://www.microsoft.com/sql-server)          |
| SSMS       | 20+     | [docs.microsoft.com/ssms](https://docs.microsoft.com/en-us/sql/ssms)      |

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/yourusername/GameStore.git
cd GameStore
```

**2. Configure Database Connection**

Edit both `GameStore.AuthService/appsettings.json` and `GameStore.APIService/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=127.0.0.1,1434;Database=GameStoreDB_Full;User Id=sa;Password=YOUR_PASSWORD;Encrypt=True;TrustServerCertificate=True;MultipleActiveResultSets=True;"
  },
  "Jwt": {
    "SecretKey": "GameStoreSecretKeyForAuthenticationShouldBeLongEnough123456!@#$%^",
    "ExpireMinutes": 480,
    "Issuer": "AuthService",
    "Audience": "APIService"
  },
  "Cors": {
    "WithOrigin": "http://localhost:3000"
  }
}
```

> - Change `YOUR_PASSWORD` to your actual SQL Server password
> - Both services **MUST** use the same `Database=GameStoreDB_Full`
> - If running on **Docker Desktop / WSL**, use `Server=127.0.0.1,1434`
> - If running **SQL Server natively on Windows**, use `Server=localhost,1433`
> - The `GameStoreDbContextFactory.cs` uses a separate connection string for CLI tools — adjust it if needed for migrations

**3. Run Database Migration**

```bash
# Install EF Core tools (if not already installed)
dotnet tool install --global dotnet-ef

# Apply existing migrations to create/update database tables
dotnet ef database update --project GameStore.Repository --startup-project GameStore.AuthService
```

After running, you should see the migrations being applied:

- `20260510132755_InitialUnified` — Creates all tables: Users, Roles, UserRoles, Games, Genres, GameGenres, Orders, OrderDetails, Library, Wishlist, Reviews, GameKeys, AccessTokens, Settings
- `20260604155259_AddPaginationSeedData` — Seeds pagination test data
- `20260604170351_ConvertPricesToBigint` — Converts price columns to bigint

> 💡 If you need to create a **new migration** after changing entity models:
>
> ```bash
> dotnet ef migrations add YourMigrationName --project GameStore.Repository --startup-project GameStore.AuthService
> ```

+++ README.md (修改后)

<!-- README.md -->

# README.md

# 🎮 GameStore - Fullstack Game Distribution Platform

> A full-stack game store inspired by **Epic Games** and **Steam**, built with **.NET 10** + **React 19** + **SQL Server**.

![.NET](https://img.shields.io/badge/.NET-10.0-512BD4?logo=dotnet)
![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)
![SQL Server](https://img.shields.io/badge/SQL_Server-2022-CC2927?logo=microsoftsqlserver)
![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite)
![Zustand](https://img.shields.io/badge/Zustand-5.0-000?logo=zustand)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 📖 TABLE OF CONTENTS

- [About The Project](#-about-the-project)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Features](#-features)
- [Screenshots](#-screenshots)
- [Scripts](#-scripts)
- [Default Accounts](#-default-accounts)
- [Environment Variables](#-environment-variables)
- [Troubleshooting](#-troubleshooting)
- [Future Enhancements](#-future-enhancements)
- [Contributing](#-contributing)
- [Author](#-author)
- [License](#-license)

---

## 🎯 ABOUT THE PROJECT

GameStore is a **full-stack web application** simulating a digital game distribution platform. Users can browse, search, filter, purchase games, and manage their library. Admins have a full dashboard to manage games, users, and orders.

### Why this project?

This was built as a **university course project** to demonstrate:

- Full-stack development with .NET + React
- Repository Pattern + Service Layer architecture
- JWT Authentication & Role-based Authorization
- Entity Framework Core with SQL Server
- State management with Zustand
- Responsive UI design
- Microservices with API Gateway (Ocelot)

### Latest Update (Commit 5663a88 - June 18, 2026)

**Feature: Gift Purchase System**

- Users can now purchase games as gifts for others by providing recipient email
- Purchase limit: Maximum 5 copies of the same game per user
- Gift orders show special badge in invoice with recipient information
- Recipients receive in-app notifications when they receive a gift
- Keys are assigned to order details, library entries created for recipients (if they have accounts)

> ⚠️ **Known Issue**: Currently, gift keys are linked to `OrderDetail` but not directly to the recipient user. This means:
>
> - The purchaser can see the key in their invoice
> - The recipient cannot see the key in their own invoice/library view
> - **Planned Fix**: Add `RecipientUserId` field to `GameKey` entity to properly associate keys with gift recipients

---

## 🛠️ TECH STACK

### Backend

| Technology                                                     | Version | Purpose           |
| -------------------------------------------------------------- | ------- | ----------------- |
| [.NET](https://dotnet.microsoft.com/)                          | 10.0    | Web API Framework |
| [Entity Framework Core](https://learn.microsoft.com/en-us/ef/) | 10.0    | ORM               |
| [SQL Server](https://www.microsoft.com/sql-server)             | 2022    | Database          |
| [JWT](https://jwt.io/)                                         | -       | Authentication    |
| [Ocelot](https://github.com/ThreeMammals/Ocelot)               | 23.x    | API Gateway       |
| [Swagger](https://swagger.io/)                                 | -       | API Documentation |

### Frontend

| Technology                                      | Version | Purpose          |
| ----------------------------------------------- | ------- | ---------------- |
| [React](https://react.dev/)                     | 19.2    | UI Library       |
| [Vite](https://vitejs.dev/)                     | 8.0     | Build Tool       |
| [React Router](https://reactrouter.com/)        | 7.14    | Routing          |
| [Zustand](https://zustand-demo.pmnd.rs/)        | 5.0     | State Management |
| [Axios](https://axios-http.com/)                | 1.15    | HTTP Client      |
| [Lucide React](https://lucide.dev/)             | 1.11    | Icons            |
| [React Hot Toast](https://react-hot-toast.com/) | 2.6     | Notifications    |

### Design

- **Inspiration**: Epic Games Store
- **Theme**: Dark (#121212) + Blue accent (#0078f2)
- **Font**: Inter (Google Fonts)
- **Styling**: CSS Variables + Inline Styles

---

## 📂 PROJECT STRUCTURE

```
GameStore/
│
├── 📦 GameStore.DTOs/                     # Data Transfer Objects
│   ├── User/
│   │   ├── Auth/LoginRequest.cs, RegisterRequest.cs, ForgotPasswordRequest.cs, ResetPasswordRequest.cs
│   │   ├── Games/GameCreateDto.cs, GameUpdateDto.cs
│   │   ├── Reviews/ReviewDto.cs, CreateReviewDto.cs
│   │   ├── Orders/CreateOrderDto.cs, OrderHistoryDto.cs, UpdateStatusDto.cs
│   │   ├── Wishlist/WishlistItemDto.cs
│   │   ├── Notifications/NotificationDto.cs
│   │   ├── Genres/GenreDto.cs
│   │   └── Users/TopUpRequest.cs, UpdateUserRequest.cs
│   ├── Admin/AdminGameCreateDto.cs, AdminGameUpdateDto.cs, AdminUserUpdateDto.cs,
│   │       AdminUpdateStatusDto.cs, GameKeyDto.cs, CategoryDto.cs, RoleDto.cs, RefundDto.cs
│   └── Common/PaginationHelper.cs, PagedResponse.cs
│
├── 🧩 GameStore.Entities/                # Entity Classes
│   ├── Audit/IAuditable.cs
│   ├── Auth/Role.cs, AccessToken.cs, PasswordResetToken.cs
│   ├── Games/Game.cs, Genre.cs, GameGenre.cs, GameKey.cs
│   ├── Store/Order.cs, OrderDetail.cs, Payment.cs, Library.cs, Wishlist.cs,
│   │       Review.cs, GameKey.cs, Notification.cs, RolePermission.cs, WalletTransaction.cs
│   ├── Users/User.cs, UserRole.cs
│   └── Settings/Setting.cs
│
├── 🔧 GameStore.Common/                  # Shared Utilities
│   ├── EntityBase.cs                      # Base entity class
│   └── Auth/TokenHelper.cs                # JWT + Password hashing
│
├── 🗄️ GameStore.Repository/              # Data Access Layer
│   ├── Interfaces/
│   │   ├── IRepository.cs, IGameRepository.cs, IUserRepository.cs,
│   │   │   IOrderRepository.cs, IGenreRepository.cs
│   │   └── Implementations/Repository.cs, GameRepository.cs, UserRepository.cs,
│   │       OrderRepository.cs, GenreRepository.cs, GameQueryExtensions.cs
│   ├── GameStoreDbContext.cs              # EF Core DbContext
│   ├── GameStoreDbContextFactory.cs       # Design-time factory
│   └── Migrations/                        # 9 EF Core migrations
│
├── ⚙️ GameStore.Services/                # Business Logic Layer
│   ├── Interfaces/
│   │   ├── Authen/IUserService.cs
│   │   ├── Users/IGameService.cs, IGenreService.cs, IOrderService.cs,
│   │   │   IWishlistService.cs, IReviewService.cs, ILibraryService.cs,
│   │   │   INotificationService.cs, IWalletTransactionService.cs
│   │   └── Admin/IAdminService.cs
│   └── Implementations/
│       ├── Authen/UserService.cs
│       ├── Users/GameService.cs, GenreService.cs, OrderService.cs,
│       │   WishlistService.cs, ReviewService.cs, LibraryService.cs,
│       │   NotificationService.cs, WalletTransactionService.cs
│       └── Admin/AdminService.cs
│
├── 🔐 GameStore.AuthService/             # Authentication API (Port 5002)
│   ├── Controllers/
│   │   ├── Auth/AuthController.cs         # Login, Register, Forgot/Reset Password
│   │   └── User/UserController.cs         # Get Profile, Update Profile, Top-up Wallet
│   ├── Program.cs
│   └── appsettings.json
│
├── 📡 GameStore.APIService/              # Business API (Port 5001)
│   ├── Controllers/
│   │   ├── User/
│   │   │   ├── GamesController.cs         # Browse, Search, Filter Games
│   │   │   ├── GenresController.cs        # Get All Genres
│   │   │   ├── OrdersController.cs        # Create Order, Get History, Get Invoice
│   │   │   ├── LibraryController.cs       # Get User Library
│   │   │   ├── WishlistController.cs      # Add/Remove from Wishlist
│   │   │   ├── ReviewsController.cs       # Create/Get Reviews
│   │   │   └── NotificationsController.cs # Get/Mark Notifications
│   │   └── Admin/AdminController.cs       # Dashboard, CRUD Operations, Reports
│   ├── Program.cs
│   └── appsettings.json
│
├── 🌐 GameStore.ApiGateway/              # API Gateway (Port 5000)
│   ├── ocelot.json                        # Route configuration (Auth + API routes)
│   ├── Program.cs
│   └── appsettings.json
│
├── 🎨 GameStore.WebClient/               # React Frontend (Port 3000)
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/     Navbar.jsx, Footer.jsx, MainLayout.jsx
│   │   │   ├── games/      GameCard.jsx, GameCardSkeleton.jsx,
│   │   │   │               GameDetailSkeleton.jsx, GameNotFound.jsx,
│   │   │   │               GameKeysSection.jsx, OverviewSection.jsx,
│   │   │   │               RequirementsSection.jsx, ReviewSection.jsx,
│   │   │   │               TrailerPlayer.jsx
│   │   │   ├── store/      HeroBanner.jsx
│   │   │   ├── wallet/     WalletModal.jsx
│   │   │   ├── admin/      AdminSidebar.jsx, DashboardTab.jsx, GamesTab.jsx,
│   │   │   │               GameFormModal.jsx, CategoriesTab.jsx, UsersTab.jsx,
│   │   │   │               UserFormModal.jsx, DeleteUserModal.jsx,
│   │   │   │               OrdersTab.jsx, RevenueTab.jsx, GameKeysTab.jsx,
│   │   │   │               StaffRolesTab.jsx, SortableHeader.jsx,
│   │   │   │               DeleteConfirmModal.jsx, adminStyles.js
│   │   │   └── common/     PageSkeleton.jsx, BackButton.jsx, LanguageSwitcher.jsx,
│   │   │                   ErrorBoundary.jsx, Pagination.jsx
│   │   ├── pages/
│   │   │   ├── StorePage.jsx              # Browse games with filters
│   │   │   ├── GameDetailPage.jsx         # Game details, add to cart/wishlist
│   │   │   ├── CartPage.jsx               # Shopping cart with quantity limits
│   │   │   ├── LoginPage.jsx              # User login
│   │   │   ├── RegisterPage.jsx           # User registration
│   │   │   ├── ForgotPasswordPage.jsx     # Request password reset
│   │   │   ├── ResetPasswordPage.jsx      # Reset password with token
│   │   │   ├── ProfilePage.jsx            # View/edit profile, change password, top-up
│   │   │   ├── PaymentPage.jsx            # Checkout with gift option
│   │   │   ├── LibraryPage.jsx            # User's game library with keys
│   │   │   ├── WishlistPage.jsx           # User's wishlist
│   │   │   ├── PurchaseHistoryPage.jsx    # Order history
│   │   │   ├── InvoicePage.jsx            # Order invoice with game keys
│   │   │   └── AdminPage.jsx              # Admin dashboard with all management tabs
│   │   ├── hooks/          useResponsive.js
│   │   ├── contexts/       AuthContext.jsx
│   │   ├── stores/         cartStore.js (Zustand)
│   │   ├── services/       api.js (Axios interceptors)
│   │   ├── i18n/           i18n.js + locales/en.json, vi.json
│   │   ├── utils/          format.js
│   │   ├── styles/         global.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vite.config.js
│   └── package.json
│
├── 📜 run-all.sh     # Start all services (Gateway, Auth, API, Web)
├── 🛑 kill-all.sh     # Stop all running services
├── 📋 GameStore.slnx  # Solution file
├── 📖 README.md       # This file
└── 🗄️ database/
    └── gamestorefulldb.sql  # Full database backup with seed data
```

---

## 🗄️ DATABASE SCHEMA

### Entity Relationships

```
Users ──┬── UserRoles ── Roles
        ├── Orders ── OrderDetails ── Games
        │              └── GameKeys
        ├── Library ──────────────── Games
        ├── Wishlist ─────────────── Games
        ├── Reviews ──────────────── Games
        ├── WalletTransactions
        └── AccessTokens

Games ──┬── GameGenres ── Genres
        ├── GameKeys
        ├── OrderDetails
        ├── Library
        ├── Wishlist
        └── Reviews

Orders ──┬── User (Buyer)
         ├── OrderDetails
         └── RecipientEmail (for gifts)

GameKeys ──┬── Game
           ├── OrderDetail
           └── [TODO: RecipientUserId for gift tracking]
```

### Key Tables

| Table                | Description                                                           |
| -------------------- | --------------------------------------------------------------------- |
| `Users`              | User accounts with wallet balance, email, phone                       |
| `Roles`              | User roles (User, Admin)                                              |
| `UserRoles`          | Many-to-many mapping between Users and Roles                          |
| `Games`              | Game catalog with price, discount, cover image, trailer               |
| `Genres`             | Game categories                                                       |
| `GameGenres`         | Many-to-many mapping between Games and Genres                         |
| `Orders`             | Order headers with status, total, buyer info, recipient email (gifts) |
| `OrderDetails`       | Order line items with quantity, unit price                            |
| `GameKeys`           | Digital license keys with expiration, usage status                    |
| `Library`            | User's owned games with play time tracking                            |
| `Wishlist`           | User's saved games for later purchase                                 |
| `Reviews`            | User reviews with ratings and recommendations                         |
| `WalletTransactions` | Transaction log for wallet operations                                 |
| `Notifications`      | In-app notifications for users                                        |
| `AccessTokens`       | JWT token blacklist/whitelist                                         |
| `Settings`           | Application configuration                                             |
| `RolePermissions`    | Role-based access control (planned)                                   |

---

## 🚀 GETTING STARTED

### Prerequisites

| Software   | Version | Download                                                                  |
| ---------- | ------- | ------------------------------------------------------------------------- |
| .NET SDK   | 10.0+   | [dotnet.microsoft.com](https://dotnet.microsoft.com/download/dotnet/10.0) |
| Node.js    | 20+     | [nodejs.org](https://nodejs.org/)                                         |
| SQL Server | 2022    | [microsoft.com/sql-server](https://www.microsoft.com/sql-server)          |
| SSMS       | 20+     | [docs.microsoft.com/ssms](https://docs.microsoft.com/en-us/sql/ssms)      |

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/yourusername/GameStore.git
cd GameStore
```

**2. Configure Database Connection**

Edit both `GameStore.AuthService/appsettings.json` and `GameStore.APIService/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=127.0.0.1,1434;Database=GameStoreDB_Full;User Id=sa;Password=YOUR_PASSWORD;Encrypt=True;TrustServerCertificate=True;MultipleActiveResultSets=True;"
  },
  "Jwt": {
    "SecretKey": "GameStoreSecretKeyForAuthenticationShouldBeLongEnough123456!@#$%^",
    "ExpireMinutes": 480,
    "Issuer": "AuthService",
    "Audience": "APIService"
  },
  "Cors": {
    "WithOrigin": "http://localhost:3000"
  }
}
```

> ⚠️ **Important**:
>
> - Change `YOUR_PASSWORD` to your actual SQL Server password
> - Both services **MUST** use the same `Database=GameStoreDB_Full`
> - If running on **Docker Desktop / WSL**, use `Server=127.0.0.1,1434`
> - If running **SQL Server natively on Windows**, use `Server=localhost,1433`
> - The `GameStoreDbContextFactory.cs` uses a separate connection string for CLI tools — adjust it if needed for migrations

**3. Run Database Migration**

```bash
# Install EF Core tools (if not already installed)
dotnet tool install --global dotnet-ef

# Apply existing migrations to create/update database tables
dotnet ef database update --project GameStore.Repository --startup-project GameStore.AuthService
```

After running, you should see the migrations being applied:

- `20260510132755_InitialUnified` — Creates all tables: Users, Roles, UserRoles, Games, Genres, GameGenres, Orders, OrderDetails, Library, Wishlist, Reviews, GameKeys, AccessTokens, Settings
- `20260604155259_AddPaginationSeedData` — Seeds pagination test data
- `20260604170351_ConvertPricesToBigint` — Converts price columns to bigint
- `20260618134511_AddWalletTransaction` — Adds WalletTransaction table
- `20260618140024_AddGameKeyGameIdCheckConstraint` — Adds constraint for GameKey.GameId
- `20260618141349_RemoveLibraryGameKeyId` — Removes GameKeyId from Library
- `20260618141905_LimitSpecsToNvarchar255` — Limits specification fields length
- `20260618184126_AddRecipientEmailToOrder` — Adds RecipientEmail for gift orders

> 💡 If you need to create a **new migration** after changing entity models:
>
> ```bash
> dotnet ef migrations add YourMigrationName --project GameStore.Repository --startup-project GameStore.AuthService
> ```

**4. Seed Initial Data (Optional)**

Restore the full database backup:

```bash
# Using SQL Server Management Studio or Azure Data Studio
# Restore database/gamestorefulldb.sql
```

Or let the application seed default admin account on first run.

**5. Run the Application**

Option A: Use shell scripts (Linux/Mac/WSL)

```bash
# Start all services
./run-all.sh

# Stop all services
./kill-all.sh
```

Option B: Run each service manually

```bash
# Terminal 1: API Gateway
cd GameStore.ApiGateway && dotnet run

# Terminal 2: Auth Service
cd GameStore.AuthService && dotnet run

# Terminal 3: API Service
cd GameStore.APIService && dotnet run

# Terminal 4: Web Client
cd GameStore.WebClient && npm install && npm run dev
```

**6. Access the Application**

- **Frontend**: http://localhost:3000
- **API Gateway**: http://localhost:5000
- **Auth Service Swagger**: http://localhost:5002/swagger
- **API Service Swagger**: http://localhost:5001/swagger

---

## 🔐 DEFAULT ACCOUNTS

| Username | Password | Email               | Role  | Wallet (VND) |
| -------- | -------- | ------------------- | ----- | ------------ |
| admin    | admin123 | admin@gamestore.com | Admin | 9,999,000    |
| user1    | user123  | user1@gamestore.com | User  | 1,000,000    |

> 💡 Change these passwords immediately in production!

---

## ✨ FEATURES

### For Customers

#### 🛒 Shopping Experience

- **Browse Games**: View all games with cover images, prices, discounts
- **Search & Filter**: By keyword, genre, price range, sorting options
- **Game Details**: Full information including description, requirements, trailers, reviews
- **Shopping Cart**: Add/remove games, adjust quantities (max 5 per game)
- **Wishlist**: Save games for later, move to cart when ready

#### 💳 Purchase & Payment

- **Wallet System**: Top-up wallet, view transaction history
- **Checkout**: Multiple payment methods (currently Wallet only)
- **Gift Purchases**: Buy games for friends/family by providing recipient email
- **Purchase Limits**: Maximum 5 copies of the same game per user
- **Order Tracking**: Real-time status updates (Pending → Completed)

#### 📚 Library Management

- **Game Library**: View all purchased games with acquisition dates
- **License Keys**: View game keys for activation
- **Play Time Tracking**: Track last played and total play time (planned)
- **Reviews**: Rate and review purchased games

#### 👤 Account Management

- **Profile**: Update personal information, avatar
- **Security**: Change password, password reset via email
- **Order History**: View all past orders with invoices
- **Notifications**: In-app notifications for order updates, gifts received

### For Administrators

#### 📊 Dashboard

- **Overview Statistics**: Total users, games, orders, revenue
- **Revenue Charts**: Daily/weekly/monthly revenue trends
- **Top Selling Games**: Best performers by quantity and revenue
- **Recent Orders**: Latest orders with quick actions

#### 🎮 Game Management

- **CRUD Operations**: Create, read, update, delete games
- **Bulk Actions**: Import/export games (planned)
- **Image Upload**: Cover images and screenshots
- **Pricing**: Set regular price and discount prices
- **System Requirements**: Minimum and recommended specs
- **Genre Assignment**: Assign multiple genres per game

#### 📁 Category Management

- **Genre CRUD**: Create, edit, delete game genres
- **Game Count**: View number of games per genre

#### 👥 User Management

- **User List**: View all users with filtering and search
- **Profile Editing**: Update user information, wallet balance
- **Account Status**: Activate/deactivate user accounts
- **Role Assignment**: Assign/remove roles (User, Admin)

#### 📦 Order Management

- **Order List**: View all orders with filtering by status
- **Status Updates**: Approve, cancel, refund orders
- **Order Details**: View complete order information
- **Gift Orders**: Special handling for gift purchases

#### 🔑 Game Key Management

- **Key List**: View all keys by game, status (used/unused)
- **Bulk Generation**: Generate multiple keys at once
- **Key Expiration**: Set expiration dates for promotional keys
- **Manual Operations**: Create single keys, mark as used/unused

#### 💰 Financial Management

- **Revenue Reports**: Filter by date range, export data
- **Payment Tracking**: View all payment transactions
- **Refund Processing**: Handle refund requests

#### 🔐 Role & Permission Management

- **Role CRUD**: Create, edit, delete custom roles
- **Permission Assignment**: Grant/revoke specific permissions
- **User Role Assignment**: Assign multiple roles per user

---

## 🌐 API ENDPOINTS

### Authentication Service (Port 5002)

| Method | Endpoint                    | Description               | Auth Required |
| ------ | --------------------------- | ------------------------- | ------------- |
| POST   | `/api/auth/login`           | User login                | No            |
| POST   | `/api/auth/register`        | User registration         | No            |
| POST   | `/api/auth/forgot-password` | Request password reset    | No            |
| POST   | `/api/auth/reset-password`  | Reset password with token | No            |
| GET    | `/api/user/profile`         | Get current user profile  | Yes           |
| PUT    | `/api/user/profile`         | Update user profile       | Yes           |
| POST   | `/api/user/topup`           | Top-up wallet             | Yes           |

### API Service (Port 5001)

#### Public Endpoints

| Method | Endpoint                     | Description               | Auth Required |
| ------ | ---------------------------- | ------------------------- | ------------- |
| GET    | `/api/games`                 | Get all games (paginated) | No            |
| GET    | `/api/games/{id}`            | Get game by ID            | No            |
| GET    | `/api/genres`                | Get all genres            | No            |
| GET    | `/api/reviews/game/{gameId}` | Get reviews for a game    | No            |

#### User Endpoints

| Method | Endpoint                            | Description               | Auth Required        |
| ------ | ----------------------------------- | ------------------------- | -------------------- |
| GET    | `/api/orders`                       | Get user's orders         | Yes (User)           |
| GET    | `/api/orders/history`               | Get order history         | Yes (User)           |
| GET    | `/api/orders/{id}`                  | Get order/invoice by ID   | Yes (User/Recipient) |
| POST   | `/api/orders`                       | Create new order          | Yes (User)           |
| PUT    | `/api/orders/{id}/cancel`           | Cancel pending order      | Yes (User)           |
| GET    | `/api/library`                      | Get user's library        | Yes (User)           |
| GET    | `/api/wishlist`                     | Get user's wishlist       | Yes (User)           |
| POST   | `/api/wishlist/{gameId}`            | Add to wishlist           | Yes (User)           |
| DELETE | `/api/wishlist/{gameId}`            | Remove from wishlist      | Yes (User)           |
| POST   | `/api/reviews`                      | Create game review        | Yes (User)           |
| GET    | `/api/notifications`                | Get user notifications    | Yes (User)           |
| PUT    | `/api/notifications/{id}/mark-read` | Mark notification as read | Yes (User)           |

#### Admin Endpoints

| Method | Endpoint                                   | Description                | Auth Required |
| ------ | ------------------------------------------ | -------------------------- | ------------- |
| GET    | `/api/admin/dashboard`                     | Get dashboard statistics   | Yes (Admin)   |
| GET    | `/api/admin/games`                         | Get all games (admin view) | Yes (Admin)   |
| POST   | `/api/admin/games`                         | Create new game            | Yes (Admin)   |
| PUT    | `/api/admin/games/{id}`                    | Update game                | Yes (Admin)   |
| DELETE | `/api/admin/games/{id}`                    | Delete game                | Yes (Admin)   |
| GET    | `/api/admin/categories`                    | Get all categories         | Yes (Admin)   |
| POST   | `/api/admin/categories`                    | Create category            | Yes (Admin)   |
| PUT    | `/api/admin/categories/{id}`               | Update category            | Yes (Admin)   |
| DELETE | `/api/admin/categories/{id}`               | Delete category            | Yes (Admin)   |
| GET    | `/api/admin/users`                         | Get all users              | Yes (Admin)   |
| PUT    | `/api/admin/users/{id}`                    | Update user                | Yes (Admin)   |
| DELETE | `/api/admin/users/{id}`                    | Delete user                | Yes (Admin)   |
| GET    | `/api/admin/orders`                        | Get all orders             | Yes (Admin)   |
| PUT    | `/api/admin/orders/{id}/status`            | Update order status        | Yes (Admin)   |
| GET    | `/api/admin/revenue`                       | Get revenue report         | Yes (Admin)   |
| GET    | `/api/admin/keys`                          | Get game keys              | Yes (Admin)   |
| POST   | `/api/admin/keys`                          | Generate game keys         | Yes (Admin)   |
| DELETE | `/api/admin/keys/{id}`                     | Delete game key            | Yes (Admin)   |
| PUT    | `/api/admin/keys/{id}`                     | Update game key            | Yes (Admin)   |
| GET    | `/api/admin/roles`                         | Get all roles              | Yes (Admin)   |
| POST   | `/api/admin/roles`                         | Create role                | Yes (Admin)   |
| PUT    | `/api/admin/roles/{id}`                    | Update role                | Yes (Admin)   |
| DELETE | `/api/admin/roles/{id}`                    | Delete role                | Yes (Admin)   |
| POST   | `/api/admin/roles/{roleId}/users/{userId}` | Assign role to user        | Yes (Admin)   |
| DELETE | `/api/admin/roles/{roleId}/users/{userId}` | Remove role from user      | Yes (Admin)   |

---

## 🎨 SCREENSHOTS

### Store Front

- Homepage with featured games and hero banner
- Game listing with filters and pagination
- Game detail page with trailer, requirements, reviews

### User Features

- Shopping cart with quantity controls
- Checkout page with gift option
- Personal library with game keys
- Order invoice with status stepper

### Admin Dashboard

- Overview with charts and statistics
- Game management with form modal
- User management with role assignment
- Order management with status updates
- Revenue reports with date filtering
- Game key management with bulk operations

---

## 🔧 SCRIPTS

### run-all.sh

Starts all four services in background:

1. GameStore.ApiGateway (Port 5000)
2. GameStore.AuthService (Port 5002)
3. GameStore.APIService (Port 5001)
4. GameStore.WebClient (Port 3000)

Logs are written to:

- `logs/gateway.log`
- `logs/auth.log`
- `logs/api.log`
- `logs/web.log`

### kill-all.sh

Stops all running services by killing processes on ports 3000, 5000, 5001, 5002.

---

## 🌍 ENVIRONMENT VARIABLES

### Backend (appsettings.json)

| Variable                              | Description                  | Default               |
| ------------------------------------- | ---------------------------- | --------------------- |
| `ConnectionStrings:DefaultConnection` | SQL Server connection string | -                     |
| `Jwt:SecretKey`                       | JWT signing secret           | -                     |
| `Jwt:ExpireMinutes`                   | JWT token expiration         | 480                   |
| `Jwt:Issuer`                          | JWT issuer claim             | AuthService           |
| `Jwt:Audience`                        | JWT audience claim           | APIService            |
| `Cors:WithOrigin`                     | Allowed CORS origin          | http://localhost:3000 |

### Frontend (.env or vite.config.js)

| Variable            | Description          | Default               |
| ------------------- | -------------------- | --------------------- |
| `VITE_API_BASE_URL` | Backend API base URL | http://localhost:5000 |

---

## ⚠️ TROUBLESHOOTING

### Database Connection Issues

- Verify SQL Server is running
- Check connection string in both appsettings.json files
- Ensure port 1434 (Docker) or 1433 (native) is accessible
- Test connection using SSMS or Azure Data Studio

### Migration Errors

```bash
# Remove last migration (if not applied)
dotnet ef migrations remove --project GameStore.Repository --startup-project GameStore.AuthService

# Re-add migration
dotnet ef migrations add FixedMigration --project GameStore.Repository --startup-project GameStore.AuthService
```

### Port Already in Use

```bash
# Kill process on specific port (Linux/Mac)
lsof -ti:5000 | xargs kill -9

# Or use the provided script
./kill-all.sh
```

### Frontend Build Issues

```bash
# Clear node_modules and reinstall
cd GameStore.WebClient
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### JWT Authentication Issues

- Ensure both services use the same `SecretKey`
- Check token expiration (480 minutes = 8 hours)
- Verify `Issuer` and `Audience` match in both services

---

## 🚧 FUTURE ENHANCEMENTS

### Planned Features

- [ ] **Gift Key Ownership**: Add `RecipientUserId` to `GameKey` entity for proper gift tracking
- [ ] **Email Notifications**: Send real emails for order confirmations, password resets
- [ ] **Multiple Payment Methods**: Integrate VNPay, PayPal, Stripe
- [ ] **Shopping Cart Persistence**: Store cart in database instead of localStorage
- [ ] **Play Time Tracking**: Implement actual game launch and time tracking
- [ ] **Achievements System**: User achievements and badges
- [ ] **Social Features**: Friends list, activity feed, game sharing
- [ ] **Refund System**: Automated refund requests and processing
- [ ] **Multi-language Support**: Expand i18n to more languages
- [ ] **Mobile Responsive**: Improve mobile UX
- [ ] **SEO Optimization**: Meta tags, Open Graph, structured data
- [ ] **Performance**: Caching, CDN for images, lazy loading

### Technical Improvements

- [ ] **Unit Tests**: xUnit tests for services and controllers
- [ ] **Integration Tests**: API endpoint testing
- [ ] **E2E Tests**: Playwright/Cypress for frontend
- [ ] **CI/CD Pipeline**: GitHub Actions for automated builds
- [ ] **Docker Support**: Containerize all services
- [ ] **Logging**: Serilog with file and database sinks
- [ ] **Monitoring**: Application Insights or Prometheus
- [ ] **API Versioning**: Support multiple API versions
- [ ] **Rate Limiting**: Prevent API abuse
- [ ] **Input Validation**: FluentValidation for DTOs

---

## 🤝 CONTRIBUTING

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Backend: Follow C# naming conventions, use async/await pattern
- Frontend: Use functional components with hooks, ESLint rules
- Commits: Use conventional commits (`feat:`, `fix:`, `docs:`, etc.)

---

## 📄 LICENSE

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 AUTHOR

**PhucNguyen45**

- GitHub: [@PhucNguyen45](https://github.com/PhucNguyen45)
- Email: [Contact via GitHub](https://github.com/PhucNguyen45)

---

## 🙏 ACKNOWLEDGMENTS

- Inspired by Epic Games Store and Steam
- Built with .NET 10 and React 19
- University course project

---

_Last Updated: June 18, 2026 (Commit 5663a88)_

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Backend: Follow C# naming conventions, use async/await pattern
- Frontend: Use functional components with hooks, ESLint rules
- Commits: Use conventional commits (`feat:`, `fix:`, `docs:`, etc.)

---

## 📄 LICENSE

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 AUTHOR

**PhucNguyen45**

- GitHub: [@PhucNguyen45](https://github.com/PhucNguyen45)
- Email: [Contact via GitHub](https://github.com/PhucNguyen45)

---

## 🙏 ACKNOWLEDGMENTS

- Inspired by Epic Games Store and Steam
- Built with .NET 10 and React 19
- University course project

---

_Last Updated: June 18, 2026 (Commit 5663a88)_
