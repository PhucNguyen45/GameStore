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
        optionsBuilder.UseSqlServer("Server=127.0.0.1,1434;Database=GameStoreDB;User Id=sa;Password=Hoangphuc@040505;Encrypt=True;TrustServerCertificate=True;MultipleActiveResultSets=True;");

        return new GameStoreDbContext(optionsBuilder.Options);
    }
}
