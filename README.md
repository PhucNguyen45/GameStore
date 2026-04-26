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

GameStore/
│
├── GameStore.Entities/ # Entity Classes (14 files)
│ ├── Audit/IAuditable.cs
│ ├── Auth/AccessToken.cs, Role.cs
│ ├── Games/Game.cs, Genre.cs, GameGenre.cs
│ ├── Store/Order.cs, OrderDetail.cs, Library.cs, Wishlist.cs, Review.cs, GameKey.cs
│ ├── Users/User.cs, UserRole.cs
│ └── Settings/Setting.cs
│
├── GameStore.Common/ # Shared Utilities (3 files)
│ ├── Entity.cs # Base class
│ ├── Auth/TokenHelper.cs # JWT + Password Hash
│ └── GameStore.Common.csproj
│
├── GameStore.Repository/ # Data Access Layer (12 files)
│ ├── EFCore/
│ │ ├── IRepository.cs # Generic interface
│ │ ├── Repository.cs # Generic implementation
│ │ ├── IGameRepository.cs / GameRepository.cs
│ │ ├── IUserRepository.cs / UserRepository.cs
│ │ ├── IGenreRepository.cs / GenreRepository.cs
│ │ └── IOrderRepository.cs / OrderRepository.cs
│ ├── GameStoreDbContext.cs # EF Core DbContext
│ ├── GameStoreDbContextFactory.cs # Design-time factory
│ └── Migrations/ # EF Core Migrations
│
├── GameStore.Services/ # Business Logic (8 files)
│ ├── Authen/IUserService.cs / UserService.cs
│ ├── IGameService.cs / GameService.cs
│ ├── IGenreService.cs / GenreService.cs
│ ├── IOrderService.cs / OrderService.cs
│ └── GameStore.Services.csproj
│
├── GameStore.AuthService/ # Authentication API (Port 5002)
│ ├── Controllers/AuthController.cs, UserController.cs
│ ├── Program.cs
│ └── appsettings.json
│
├── GameStore.APIService/ # Business API (Port 5001)
│ ├── Controllers/
│ │ ├── GamesController.cs
│ │ ├── GenresController.cs
│ │ ├── OrdersController.cs
│ │ └── LibraryController.cs
│ ├── Program.cs
│ └── appsettings.json
│
├── GameStore.ApiGateway/ # API Gateway (Port 5000)
│ ├── ocelot.json
│ ├── Program.cs
│ └── appsettings.json
│
├── GameStore.WebClient/ # React Frontend (Port 3000)
│ ├── src/
│ │ ├── components/
│ │ │ ├── layout/Navbar.jsx, Footer.jsx, MainLayout.jsx
│ │ │ ├── games/GameCard.jsx
│ │ │ └── wallet/WalletModal.jsx
│ │ ├── pages/
│ │ │ ├── HomePage.jsx, StorePage.jsx
│ │ │ ├── LoginPage.jsx, RegisterPage.jsx
│ │ │ ├── GameDetailPage.jsx, CartPage.jsx
│ │ │ ├── LibraryPage.jsx, AdminPage.jsx
│ │ │ └── Store.jsx
│ │ ├── contexts/AuthContext.jsx
│ │ ├── stores/cartStore.js
│ │ ├── services/api.js
│ │ ├── styles/global.css
│ │ ├── App.jsx
│ │ └── main.jsx
│ ├── vite.config.js
│ └── package.json
│
├── run-all.sh # Start all services
├── kill-all.sh # Stop all services
├── GameStore.slnx # Solution file
└── README.md # This file

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
t
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

````bash
git clone https://github.com/yourusername/GameStore.git
cd GameStore

**2. Configure Database Connection**

Edit `GameStore.AuthService/appsettings.json`:
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "ConnectionStrings": {
    "DefaultConnection": "Server=127.0.0.1,1434;Database=GameStoreDB;User Id=sa;Password=Hoangphuc@040505;Encrypt=True;TrustServerCertificate=True;MultipleActiveResultSets=True;"
  },
  "Jwt": {
    "SecretKey": "GameStoreSecretKeyForAuthenticationShouldBeLongEnough123456!@#$%^",
    "ExpireMinutes": 480
  },
  "Cors": {
    "WithOrigin": "http://localhost:3000"
  }
}
Edit `GameStore.AuthService/appsettings.json`:
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "ConnectionStrings": {
    "ConnectedDb": "Data Source=127.0.0.1,1434;Database=GameStoreDB;User ID=sa;Password=Hoangphuc@040505;Encrypt=True;TrustServerCertificate=True;"
  },
  "Jwt": {
    "SecretKey": "GameStoreSecretKeyForAuthenticationShouldBeLongEnough123456!@#$%^"
  }
}
⚠️ Important: Change Hoangphuc@040505 to your actual SQL Server password. Both services MUST use the same Database=GameStoreDB.
````

**3. Run Database Migration**

# Install EF Core tools (if not already installed)

dotnet tool install --global dotnet-ef

# Create migration

dotnet ef migrations add InitialCreate --project GameStore.Repository --startup-project GameStore.AuthService

# Apply migration to create database tables

dotnet ef database update --project GameStore.Repository --startup-project GameStore.AuthService
e.AuthService

# Apply migration to create database tables

dotnet ef database update --project GameStore.Repository --startup-project GameStore.AuthService

After running, you should see:
Applying migration '20260425130856_InitialCreate'.
Done.
This creates all tables: Users, Roles, UserRoles, Games, Genres, GameGenres, Orders, OrderDetails, Library, Wishlist, Reviews, GameKeys, AccessTokens, Settings.
