// GameStore.APIService/Program.cs
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using GameStore.Repository;
using GameStore.Repository.EFCore;
using GameStore.Services;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

builder.Services.AddOpenApi();

builder.Services.AddCors(options =>
    options.AddPolicy("AllowAll", policy => policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()));

builder.Services.AddDbContext<GameStoreDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IGameRepository, GameRepository>();
builder.Services.AddScoped<IGenreRepository, GenreRepository>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IGameService, GameService>();
builder.Services.AddScoped<IGenreService, GenreService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IAdminService, AdminService>();
builder.Services.AddScoped<ILibraryService, LibraryService>();
builder.Services.AddScoped<IWishlistService, WishlistService>();
builder.Services.AddScoped<IReviewService, ReviewService>();
builder.Services.AddScoped<INotificationService, NotificationService>();

var key = Encoding.ASCII.GetBytes(builder.Configuration["Jwt:SecretKey"]!);
builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(x =>
{
    x.RequireHttpsMetadata = false;
    x.SaveToken = true;
    x.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidateAudience = true,
        ValidAudience = builder.Configuration["Jwt:Audience"],
        ClockSkew = TimeSpan.Zero
    };
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<GameStoreDbContext>();

    // Sync migration history based on actual DB schema state.
    // Each migration is only marked as applied if its schema changes are already in place.
    var conn = db.Database.GetDbConnection();
    conn.Open();
    try
    {
        using var cmd = conn.CreateCommand();

        // Ensure __EFMigrationsHistory exists
        cmd.CommandText = @"
            IF NOT EXISTS (
                SELECT 1 FROM sys.tables
                WHERE name = '__EFMigrationsHistory' AND schema_id = SCHEMA_ID('dbo')
            )
            CREATE TABLE [dbo].[__EFMigrationsHistory] (
                [MigrationId]    nvarchar(150) NOT NULL,
                [ProductVersion] nvarchar(32)  NOT NULL,
                CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
            );";
        cmd.ExecuteNonQuery();

        bool TableExists(string name)
        {
            cmd.CommandText = $"SELECT COUNT(1) FROM sys.tables WHERE name = '{name}' AND schema_id = SCHEMA_ID('dbo')";
            return Convert.ToInt32(cmd.ExecuteScalar()) > 0;
        }

        void MarkApplied(string migrationId)
        {
            cmd.CommandText = $@"
                IF NOT EXISTS (SELECT 1 FROM [__EFMigrationsHistory] WHERE [MigrationId] = '{migrationId}')
                INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
                VALUES ('{migrationId}', '10.0.7');";
            cmd.ExecuteNonQuery();
        }

        // InitialUnified: mark applied if Games table already exists
        if (TableExists("Games"))
            MarkApplied("20260510132755_InitialUnified");

        // AddPaginationSeedData: mark applied if PasswordResetTokens table already exists
        if (TableExists("PasswordResetTokens"))
            MarkApplied("20260604155259_AddPaginationSeedData");

        // ConvertPricesToBigint: mark applied only if Wallet column is actually bigint.
        // If history says applied but column is still decimal, remove the record so EF re-runs it.
        cmd.CommandText = @"
            SELECT COUNT(1) FROM sys.columns c
            JOIN sys.tables t ON c.object_id = t.object_id
            JOIN sys.types ty ON c.user_type_id = ty.user_type_id
            WHERE t.name = 'Users' AND c.name = 'Wallet' AND ty.name = 'bigint'";
        var walletIsBigint = Convert.ToInt32(cmd.ExecuteScalar()) > 0;
        if (walletIsBigint)
        {
            MarkApplied("20260604170351_ConvertPricesToBigint");
        }
        else
        {
            // Column still decimal — remove stale history entry so EF actually runs the migration
            cmd.CommandText = @"
                DELETE FROM [__EFMigrationsHistory]
                WHERE [MigrationId] = '20260604170351_ConvertPricesToBigint';";
            cmd.ExecuteNonQuery();
        }
    }
    finally
    {
        conn.Close();
    }

    db.Database.Migrate();

    // Seed data được chạy thủ công qua database/seeds/seed_data.sql
}

app.MapOpenApi();

// Swagger UI cho /swagger
app.UseSwaggerUI(c => c.SwaggerEndpoint("/openapi/v1.json", "GameStore API v1"));

app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();
