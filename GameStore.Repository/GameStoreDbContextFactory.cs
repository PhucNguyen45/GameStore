using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace GameStore.Repository;

public class GameStoreDbContextFactory : IDesignTimeDbContextFactory<GameStoreDbContext>
{
    public GameStoreDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<GameStoreDbContext>();
        optionsBuilder.UseSqlServer("Server=localhost,1433;Database=GameStoreDB;User Id=sa;Password=Password123!;TrustServerCertificate=True;");

        return new GameStoreDbContext(optionsBuilder.Options);
    }
}
