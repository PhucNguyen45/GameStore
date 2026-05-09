using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using GameStore.DTOs.Admin;
using GameStore.Entities.Auth;
using GameStore.Entities.Games;
using GameStore.Entities.Store;
using GameStore.Entities.Users;
using GameStore.Repository;

namespace GameStore.Services;

public class AdminService : IAdminService
{
    private readonly GameStoreDbContext _context;
    private readonly IGameService _gameService;
    private readonly IOrderService _orderService;

    public AdminService(GameStoreDbContext context, IGameService gameService, IOrderService orderService)
    {
        _context = context;
        _gameService = gameService;
        _orderService = orderService;
    }

    // ================= DASHBOARD =================
    public async Task<object> GetDashboardAsync()
    {
        var totalGames = await _context.Games.CountAsync();
        var totalUsers = await _context.Users.CountAsync();
        var totalOrders = await _context.Orders.CountAsync();
        var revenue = await _context.Orders
            .Where(o => o.Status == "Completed")
            .SumAsync(o => o.TotalAmount);

        return new
        {
            totalGames,
            totalUsers,
            totalOrders,
            totalRevenue = revenue
        };
    }

    // ================= GAMES =================
    public async Task<(IEnumerable<Game> Games, int TotalCount)> GetGamesAsync(
        string? keyword, int? genreId, decimal? minPrice, decimal? maxPrice,
        string? sortBy, bool desc, int page, int pageSize)
    {
        var (games, totalCount) = await _gameService.Search(
            keyword, genreId, minPrice, maxPrice,
            sortBy ?? "CreatedAt", desc,
            page, pageSize
        );
        return (games, totalCount);
    }

    public async Task<Game> CreateGameAsync(AdminGameCreateDto dto)
    {
        var game = new Game
        {
            Title = dto.Title,
            Description = dto.Description ?? "",
            Price = dto.Price,
            DiscountPrice = dto.DiscountPrice,
            Developer = dto.Developer ?? "",
            Publisher = dto.Publisher ?? "",
            ReleaseDate = dto.ReleaseDate ?? DateTime.UtcNow,
            TrailerUrl = dto.TrailerUrl ?? "",
            CoverImageUrl = dto.CoverImageUrl ?? "",
            MinimumOS = dto.MinimumOS ?? "",
            MinimumProcessor = dto.MinimumProcessor ?? "",
            MinimumMemory = dto.MinimumMemory ?? "",
            MinimumGraphics = dto.MinimumGraphics ?? "",
            MinimumStorage = dto.MinimumStorage ?? ""
        };
        var created = await _gameService.Create(game);

        if (dto.GenreIds != null && dto.GenreIds.Any())
        {
            foreach (var gid in dto.GenreIds)
            {
                _context.GameGenres.Add(new GameGenre { GameId = created.Id, GenreId = gid });
            }
            await _context.SaveChangesAsync();
        }

        return created;
    }

    public async Task UpdateGameAsync(int id, AdminGameUpdateDto dto)
    {
        var existing = await _gameService.GetById(id) ?? throw new Exception("Game not found");

        existing.Title = dto.Title ?? existing.Title;
        existing.Description = dto.Description ?? existing.Description;
        existing.Price = dto.Price ?? existing.Price;
        existing.DiscountPrice = dto.DiscountPrice ?? existing.DiscountPrice;
        existing.Developer = dto.Developer ?? existing.Developer;
        existing.Publisher = dto.Publisher ?? existing.Publisher;
        existing.CoverImageUrl = dto.CoverImageUrl ?? existing.CoverImageUrl;
        existing.TrailerUrl = dto.TrailerUrl ?? existing.TrailerUrl;
        existing.MinimumOS = dto.MinimumOS ?? existing.MinimumOS;
        existing.MinimumProcessor = dto.MinimumProcessor ?? existing.MinimumProcessor;
        existing.MinimumMemory = dto.MinimumMemory ?? existing.MinimumMemory;
        existing.MinimumGraphics = dto.MinimumGraphics ?? existing.MinimumGraphics;
        existing.MinimumStorage = dto.MinimumStorage ?? existing.MinimumStorage;

        if (dto.GenreIds != null)
        {
            var existingGenres = _context.GameGenres.Where(gg => gg.GameId == id);
            _context.GameGenres.RemoveRange(existingGenres);
            foreach (var gid in dto.GenreIds)
            {
                _context.GameGenres.Add(new GameGenre { GameId = id, GenreId = gid });
            }
        }

        if (dto.ReleaseDate.HasValue)
            existing.ReleaseDate = dto.ReleaseDate.Value;

        await _gameService.Update(existing);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteGameAsync(int id)
    {
        var existing = await _gameService.GetById(id) ?? throw new Exception("Game not found");
        await _gameService.Delete(id);
    }

    // ================= USERS =================
    public async Task<(IEnumerable<User> Users, int TotalCount)> GetUsersAsync(
        string? keyword, string? sortBy, bool desc, int page, int pageSize)
    {
        var query = _context.Users.AsQueryable();

        if (!string.IsNullOrEmpty(keyword))
            query = query.Where(u => u.Username.Contains(keyword) || u.DisplayName.Contains(keyword) || u.Email.Contains(keyword));

        var totalCount = await query.CountAsync();

        query = sortBy?.ToLower() switch
        {
            "id" => desc ? query.OrderByDescending(u => u.Id) : query.OrderBy(u => u.Id),
            "username" => desc ? query.OrderByDescending(u => u.Username) : query.OrderBy(u => u.Username),
            "displayname" => desc ? query.OrderByDescending(u => u.DisplayName) : query.OrderBy(u => u.DisplayName),
            "email" => desc ? query.OrderByDescending(u => u.Email) : query.OrderBy(u => u.Email),
            "wallet" => desc ? query.OrderByDescending(u => u.Wallet) : query.OrderBy(u => u.Wallet),
            "createdat" => desc ? query.OrderByDescending(u => u.CreatedAt) : query.OrderBy(u => u.CreatedAt),
            _ => query.OrderByDescending(u => u.CreatedAt)
        };

        var users = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
        return (users, totalCount);
    }

    public async Task UpdateUserAsync(int id, AdminUserUpdateDto dto)
    {
        var user = await _context.Users.FindAsync(id) ?? throw new Exception("User not found");
        user.DisplayName = dto.DisplayName ?? user.DisplayName;
        user.Email = dto.Email ?? user.Email;
        if (dto.Wallet.HasValue) user.Wallet = dto.Wallet.Value;
        if (dto.IsActive.HasValue) user.IsActive = dto.IsActive.Value;
        await _context.SaveChangesAsync();
    }

    public async Task DeleteUserAsync(int id)
    {
        var user = await _context.Users.FindAsync(id) ?? throw new Exception("User not found");
        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
    }

    // ================= ORDERS =================
    public async Task<(IEnumerable<Order> Orders, int TotalCount)> GetOrdersAsync(
        string? keyword, DateTime? fromDate, DateTime? toDate, string? status,
        string? sortBy, bool desc, int page, int pageSize)
    {
        var query = _context.Orders.Include(o => o.User).AsQueryable();

        if (!string.IsNullOrEmpty(keyword))
        {
            var isNumeric = int.TryParse(keyword, out int searchId);
            query = query.Where(o => o.User.Username.Contains(keyword) || (isNumeric && o.Id == searchId));
        }
        if (fromDate.HasValue) query = query.Where(o => o.OrderDate >= fromDate.Value);
        if (toDate.HasValue) query = query.Where(o => o.OrderDate <= toDate.Value);
        if (!string.IsNullOrEmpty(status)) query = query.Where(o => o.Status == status);

        var totalCount = await query.CountAsync();

        query = sortBy?.ToLower() switch
        {
            "id" => desc ? query.OrderByDescending(o => o.Id) : query.OrderBy(o => o.Id),
            "totalamount" => desc ? query.OrderByDescending(o => o.TotalAmount) : query.OrderBy(o => o.TotalAmount),
            "status" => desc ? query.OrderByDescending(o => o.Status) : query.OrderBy(o => o.Status),
            "orderdate" => desc ? query.OrderByDescending(o => o.OrderDate) : query.OrderBy(o => o.OrderDate),
            _ => query.OrderByDescending(o => o.OrderDate)
        };

        var orders = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
        return (orders, totalCount);
    }

    public async Task UpdateOrderStatusAsync(int orderId, string status)
    {
        await _orderService.UpdateStatus(orderId, status);
    }

    // ================= CATEGORIES (Genres) =================
    public async Task<object> GetCategoriesAsync(string? keyword, string? status, int page, int pageSize)
    {
        var query = _context.Genres.AsQueryable();

        if (!string.IsNullOrEmpty(keyword))
            query = query.Where(g => g.Name.Contains(keyword) || g.Description.Contains(keyword));
        if (status == "active") query = query.Where(g => g.IsActive);
        else if (status == "inactive") query = query.Where(g => !g.IsActive);

        var totalCount = await query.CountAsync();
        var data = await query.OrderBy(g => g.Name).Skip((page - 1) * pageSize).Take(pageSize)
            .Select(g => new
            {
                g.Id,
                g.Name,
                g.Description,
                g.IconUrl,
                g.IsActive,
                gameCount = _context.GameGenres.Count(gg => gg.GenreId == g.Id)
            }).ToListAsync();

        return new { data, totalCount };
    }

    public async Task CreateCategoryAsync(CategoryDto dto)
    {
        if (await _context.Genres.AnyAsync(g => g.Name == dto.Name))
            throw new Exception("Category name already exists");
        var genre = new Genre { Name = dto.Name, Description = dto.Description ?? "", IconUrl = dto.IconUrl ?? "", IsActive = dto.IsActive };
        _context.Genres.Add(genre);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateCategoryAsync(int id, CategoryDto dto)
    {
        var genre = await _context.Genres.FindAsync(id) ?? throw new Exception("Category not found");
        if (await _context.Genres.AnyAsync(g => g.Name == dto.Name && g.Id != id))
            throw new Exception("Category name already exists");
        genre.Name = dto.Name;
        genre.Description = dto.Description ?? "";
        genre.IconUrl = dto.IconUrl ?? "";
        genre.IsActive = dto.IsActive;
        await _context.SaveChangesAsync();
    }

    public async Task DeleteCategoryAsync(int id)
    {
        var genre = await _context.Genres.FindAsync(id) ?? throw new Exception("Category not found");
        var gamesUsingGenre = await _context.GameGenres.CountAsync(gg => gg.GenreId == id);
        if (gamesUsingGenre > 0)
            throw new Exception($"Cannot delete: {gamesUsingGenre} games use this category");
        _context.Genres.Remove(genre);
        await _context.SaveChangesAsync();
    }

    // ================= GAME KEYS =================
    public async Task<object> GetGameKeysAsync(string? keyword, int? gameId, string? status, int page, int pageSize)
    {
        var query = _context.GameKeys.Include(k => k.Game).AsQueryable();

        if (!string.IsNullOrEmpty(keyword))
            query = query.Where(k => k.KeyCode.Contains(keyword) || k.Game.Title.Contains(keyword));
        if (gameId.HasValue) query = query.Where(k => k.GameId == gameId.Value);
        if (status == "available") query = query.Where(k => !k.IsUsed && (k.ExpiresAt == null || k.ExpiresAt > DateTime.UtcNow));
        else if (status == "used") query = query.Where(k => k.IsUsed);
        else if (status == "expired") query = query.Where(k => k.ExpiresAt != null && k.ExpiresAt <= DateTime.UtcNow && !k.IsUsed);

        var totalCount = await query.CountAsync();
        var data = await query.OrderByDescending(k => k.CreatedAt).Skip((page - 1) * pageSize).Take(pageSize)
            .Select(k => new
            {
                k.Id,
                k.GameId,
                gameTitle = k.Game.Title,
                k.KeyCode,
                k.IsUsed,
                k.OrderDetailId,
                k.UsedAt,
                k.CreatedAt,
                k.ExpiresAt
            }).ToListAsync();

        var totalKeys = await _context.GameKeys.CountAsync();
        var usedKeys = await _context.GameKeys.CountAsync(k => k.IsUsed);
        var availableKeys = await _context.GameKeys.CountAsync(k => !k.IsUsed && (k.ExpiresAt == null || k.ExpiresAt > DateTime.UtcNow));
        var expiredKeys = await _context.GameKeys.CountAsync(k => k.ExpiresAt != null && k.ExpiresAt <= DateTime.UtcNow && !k.IsUsed);

        return new { data, totalCount, stats = new { totalKeys, usedKeys, availableKeys, expiredKeys } };
    }

    public async Task CreateGameKeyAsync(GameKeyDto dto)
    {
        var game = await _context.Games.FindAsync(dto.GameId) ?? throw new Exception("Game not found");
        if (await _context.GameKeys.AnyAsync(k => k.KeyCode == dto.KeyCode))
            throw new Exception("Key code already exists");
        _context.GameKeys.Add(new GameKey { GameId = dto.GameId, KeyCode = dto.KeyCode, ExpiresAt = dto.ExpiresAt });
        await _context.SaveChangesAsync();
    }

    public async Task CreateBatchGameKeysAsync(BatchGameKeyDto dto)
    {
        var game = await _context.Games.FindAsync(dto.GameId) ?? throw new Exception("Game not found");
        var existing = new HashSet<string>(await _context.GameKeys.Select(k => k.KeyCode).ToListAsync());
        var keys = new List<GameKey>();
        foreach (var code in dto.KeyCodes)
        {
            if (string.IsNullOrWhiteSpace(code) || existing.Contains(code)) continue;
            keys.Add(new GameKey { GameId = dto.GameId, KeyCode = code.Trim(), ExpiresAt = dto.ExpiresAt });
            existing.Add(code);
        }
        if (keys.Count == 0) throw new Exception("No valid keys to add");
        await _context.GameKeys.AddRangeAsync(keys);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteGameKeyAsync(int id)
    {
        var key = await _context.GameKeys.FindAsync(id) ?? throw new Exception("Key not found");
        if (key.IsUsed) throw new Exception("Cannot delete a used key");
        _context.GameKeys.Remove(key);
        await _context.SaveChangesAsync();
    }

    // ================= PAYMENTS =================
    public async Task<object> GetPaymentsAsync(string? keyword, string? status, string? method,
        DateTime? fromDate, DateTime? toDate, int page, int pageSize)
    {
        var query = _context.Payments.Include(p => p.Order).ThenInclude(o => o.User).AsQueryable();

        if (!string.IsNullOrEmpty(keyword))
        {
            var isNumeric = int.TryParse(keyword, out int searchId);
            query = query.Where(p => (isNumeric && (p.Id == searchId || p.OrderId == searchId)) ||
                                     (p.TransactionId != null && p.TransactionId.Contains(keyword)) ||
                                     p.Order.User.Username.Contains(keyword));
        }
        if (!string.IsNullOrEmpty(status)) query = query.Where(p => p.Status == status);
        if (!string.IsNullOrEmpty(method)) query = query.Where(p => p.PaymentMethod == method);
        if (fromDate.HasValue) query = query.Where(p => p.PaidAt >= fromDate.Value);
        if (toDate.HasValue) query = query.Where(p => p.PaidAt <= toDate.Value);

        var totalCount = await query.CountAsync();
        var data = await query.OrderByDescending(p => p.PaidAt).Skip((page - 1) * pageSize).Take(pageSize)
            .Select(p => new
            {
                p.Id,
                p.OrderId,
                p.Amount,
                p.PaymentMethod,
                p.Status,
                p.TransactionId,
                p.Note,
                p.PaidAt,
                p.CreatedAt,
                username = p.Order.User.Username,
                userId = p.Order.UserId
            }).ToListAsync();

        return new { data, totalCount };
    }

    public async Task<object> GetOrderPaymentsAsync(int orderId)
    {
        var order = await _context.Orders.Include(o => o.User).Include(o => o.OrderDetails).ThenInclude(od => od.Game)
            .FirstOrDefaultAsync(o => o.Id == orderId) ?? throw new Exception("Order not found");

        var payments = await _context.Payments.Where(p => p.OrderId == orderId).OrderByDescending(p => p.PaidAt).ToListAsync();

        return new
        {
            order = new
            {
                order.Id,
                order.UserId,
                username = order.User.Username,
                order.TotalAmount,
                order.Status,
                order.PaymentMethod,
                order.OrderDate,
                items = order.OrderDetails.Select(od => new { od.Id, od.GameId, gameTitle = od.Game.Title, od.Quantity, od.UnitPrice })
            },
            payments
        };
    }

    public async Task RefundPaymentAsync(int paymentId, RefundDto? dto)
    {
        var payment = await _context.Payments.Include(p => p.Order).ThenInclude(o => o.User)
            .FirstOrDefaultAsync(p => p.Id == paymentId) ?? throw new Exception("Payment not found");
        if (payment.Status == "Refunded") throw new Exception("Payment already refunded");

        var user = payment.Order.User;
        user.Wallet += payment.Amount;
        payment.Status = "Refunded";
        payment.Note = dto?.Note ?? "Admin refund";
        payment.Order.Status = "Refunded";
        await _context.SaveChangesAsync();
    }

    // ================= ROLES =================
    public async Task<object> GetRolesAsync(string? keyword, int page, int pageSize)
    {
        var query = _context.Roles.Where(r => !r.IsDeleted).AsQueryable();
        if (!string.IsNullOrEmpty(keyword)) query = query.Where(r => r.Name.Contains(keyword) || r.Description.Contains(keyword));

        var totalCount = await query.CountAsync();
        var data = await query.OrderBy(r => r.Name).Skip((page - 1) * pageSize).Take(pageSize)
            .Select(r => new
            {
                r.Id,
                r.Name,
                r.Description,
                r.IsActive,
                r.Created,
                userCount = _context.UserRoles.Count(ur => ur.RoleId == r.Id && !ur.IsDeleted),
                permissions = r.RolePermissions.Select(rp => rp.Permission).ToList()
            }).ToListAsync();

        return new { data, totalCount };
    }

    public async Task CreateRoleAsync(RoleDto dto)
    {
        if (await _context.Roles.AnyAsync(r => r.Name == dto.Name && !r.IsDeleted))
            throw new Exception("Role name already exists");

        var role = new Role
        {
            Name = dto.Name,
            Description = dto.Description ?? "",
            IsActive = true,
            Guid = Guid.NewGuid(),
            CreatedBy = "admin",
            Created = DateTime.UtcNow,
            ModifiedBy = "admin",
            Modified = DateTime.UtcNow
        };
        _context.Roles.Add(role);
        await _context.SaveChangesAsync();

        if (dto.Permissions != null)
        {
            foreach (var perm in dto.Permissions)
            {
                _context.RolePermissions.Add(new RolePermission { RoleId = role.Id, Permission = perm });
            }
            await _context.SaveChangesAsync();
        }
    }

    public async Task UpdateRoleAsync(int id, RoleDto dto)
    {
        var role = await _context.Roles.FindAsync(id) ?? throw new Exception("Role not found");
        if (await _context.Roles.AnyAsync(r => r.Name == dto.Name && r.Id != id && !r.IsDeleted))
            throw new Exception("Role name already exists");

        role.Name = dto.Name;
        role.Description = dto.Description ?? "";
        role.IsActive = dto.IsActive;
        role.ModifiedBy = "admin";
        role.Modified = DateTime.UtcNow;

        var oldPerms = await _context.RolePermissions.Where(rp => rp.RoleId == id).ToListAsync();
        _context.RolePermissions.RemoveRange(oldPerms);
        if (dto.Permissions != null)
        {
            foreach (var perm in dto.Permissions)
            {
                _context.RolePermissions.Add(new RolePermission { RoleId = id, Permission = perm });
            }
        }
        await _context.SaveChangesAsync();
    }

    public async Task DeleteRoleAsync(int id)
    {
        var role = await _context.Roles.FindAsync(id) ?? throw new Exception("Role not found");
        if (role.Name == "Admin" || role.Name == "User")
            throw new Exception("Cannot delete built-in roles");

        var usersWithRole = await _context.UserRoles.CountAsync(ur => ur.RoleId == id && !ur.IsDeleted);
        if (usersWithRole > 0)
            throw new Exception($"Cannot delete: {usersWithRole} users have this role");

        role.IsDeleted = true;
        role.Modified = DateTime.UtcNow;
        await _context.SaveChangesAsync();
    }

    // ================= STAFF =================
    public async Task<object> GetStaffAsync(string? keyword, int? roleId, int page, int pageSize)
    {
        var query = _context.Users.AsQueryable();
        if (roleId.HasValue) query = query.Where(u => u.UserRoles.Any(ur => ur.RoleId == roleId.Value && !ur.IsDeleted));
        if (!string.IsNullOrEmpty(keyword)) query = query.Where(u => u.Username.Contains(keyword) || u.DisplayName.Contains(keyword) || u.Email.Contains(keyword));

        var totalCount = await query.CountAsync();
        var data = await query.OrderBy(u => u.Username).Skip((page - 1) * pageSize).Take(pageSize)
            .Select(u => new
            {
                u.Id,
                u.Username,
                u.DisplayName,
                u.Email,
                u.IsActive,
                u.CreatedAt,
                roles = u.UserRoles.Where(ur => !ur.IsDeleted).Select(ur => new { ur.RoleId, roleName = ur.Role.Name }).ToList()
            }).ToListAsync();

        return new { data, totalCount };
    }

    public async Task AssignRoleAsync(AssignRoleDto dto)
    {
        var user = await _context.Users.FindAsync(dto.UserId) ?? throw new Exception("User not found");
        var role = await _context.Roles.FindAsync(dto.RoleId) ?? throw new Exception("Role not found");

        var existing = await _context.UserRoles.FirstOrDefaultAsync(ur => ur.UserId == dto.UserId && ur.RoleId == dto.RoleId);
        if (existing != null)
        {
            if (!existing.IsDeleted) throw new Exception("User already has this role");
            existing.IsDeleted = false;
            existing.Modified = DateTime.UtcNow;
        }
        else
        {
            _context.UserRoles.Add(new UserRole
            {
                UserId = dto.UserId,
                RoleId = dto.RoleId,
                Guid = Guid.NewGuid(),
                CreatedBy = "admin",
                Created = DateTime.UtcNow,
                ModifiedBy = "admin",
                Modified = DateTime.UtcNow
            });
        }
        await _context.SaveChangesAsync();
    }

    public async Task RevokeRoleAsync(AssignRoleDto dto)
    {
        var userRole = await _context.UserRoles.FirstOrDefaultAsync(ur => ur.UserId == dto.UserId && ur.RoleId == dto.RoleId && !ur.IsDeleted)
                        ?? throw new Exception("User does not have this role");
        userRole.IsDeleted = true;
        userRole.Modified = DateTime.UtcNow;
        await _context.SaveChangesAsync();
    }

    public IEnumerable<string> GetPermissions()
    {
        return new[]
        {
            "games.view", "games.create", "games.edit", "games.delete",
            "users.view", "users.edit", "users.ban",
            "orders.view", "orders.edit",
            "categories.view", "categories.create", "categories.edit", "categories.delete",
            "gamekeys.view", "gamekeys.create", "gamekeys.delete",
            "payments.view", "payments.refund",
            "roles.view", "roles.create", "roles.edit", "roles.delete",
            "staff.view", "staff.assign"
        };
    }
}
