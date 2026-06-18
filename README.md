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

> ⚠️ **Important**: 
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
> ```bash
> dotnet ef migrations add YourMigrationName --project GameStore.Repository --startup-project GameStore.AuthService
> ```
