# 🎮 GameStore - Fullstack Game Distribution Platform

> A full-stack game store inspired by **Epic Games** and **Steam**, built with **.NET 10** + **React 19** + **SQL Server**.

![.NET](https://img.shields.io/badge/.NET-10.0-512BD4?logo=dotnet)
![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)
![SQL Server](https://img.shields.io/badge/SQL_Server-2022-CC2927?logo=microsoftsqlserver)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 🚀 QUICK START

```bash
# 1. Clone
git clone https://github.com/yourusername/GameStore.git
cd GameStore

# 2. Update connection strings in:
#    GameStore.AuthService/appsettings.json
#    GameStore.APIService/appsettings.json

# 3. Run migration
dotnet ef database update --project GameStore.Repository --startup-project GameStore.AuthService

# 4. Seed data (run in SSMS)
#    Open /docs/seed-games.sql and execute

# 5. Install frontend
cd GameStore.WebClient && npm install && cd ..

# 6. Run all
chmod +x run-all.sh kill-all.sh
./run-all.sh
```
