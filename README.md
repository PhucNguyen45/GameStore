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
