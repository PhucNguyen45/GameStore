// GameStore.Services/AdminService.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using GameStore.DTOs.Admin;
using GameStore.DTOs.Common;
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

    // Trả về tổng quan hệ thống: số lượng game/user/đơn hàng, tổng doanh thu,
    // doanh thu theo từng tháng trong năm hiện tại, và 20 đơn hàng gần nhất
    public async Task<object> GetDashboardAsync()
    {
        var totalGames = await _context.Games.CountAsync();
        var totalUsers = await _context.Users.CountAsync();
        var totalOrders = await _context.Orders.CountAsync();
        var revenue = await _context.Orders
            .Where(o => o.Status == "Completed")
            .SumAsync(o => o.TotalAmount);

        var currentYear = DateTime.UtcNow.Year;
        var completedOrders = await _context.Orders
            .Where(o => o.Status == "Completed" && o.OrderDate.Year == currentYear)
            .Select(o => new { o.OrderDate, o.TotalAmount })
            .ToListAsync();

        var monthlyRevenue = Enumerable.Range(0, 12).Select(m => new
        {
            month = m + 1,
            value = (double)completedOrders.Where(o => o.OrderDate.Month == m + 1).Sum(o => o.TotalAmount),
            count = completedOrders.Count(o => o.OrderDate.Month == m + 1)
        }).ToList();

        var recentOrders = await _context.Orders
            .Include(o => o.User)
            .OrderByDescending(o => o.OrderDate)
            .Take(20)
            .Select(o => new
            {
                o.Id,
                o.UserId,
                username = o.User.Username,
                o.TotalAmount,
                o.Status,
                o.PaymentMethod,
                o.OrderDate
            })
            .ToListAsync();

        return new
        {
            totalGames,
            totalUsers,
            totalOrders,
            totalRevenue = revenue,
            monthlyRevenue,
            recentOrders
        };
    }

    // ================= GAMES =================

    // Tìm kiếm game theo từ khóa, thể loại, khoảng giá; hỗ trợ sắp xếp và phân trang
    public async Task<(IEnumerable<Game> Games, int TotalCount)> GetGamesAsync(
        string? keyword, int[]? genreIds, long? minPrice, long? maxPrice,
        string? sortBy, bool desc, int page, int pageSize)
    {
        (page, pageSize) = PaginationHelper.Validate(page, pageSize);
        var (games, totalCount) = await _gameService.Search(
            keyword, genreIds, minPrice, maxPrice,
            sortBy ?? "CreatedAt", desc,
            page, pageSize
        );
        return (games, totalCount);
    }

    // Tạo game mới, gán thể loại, rồi tự động sinh 20 game key ngẫu nhiên
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

        // Tự động sinh 20 game keys (không hết hạn)
        var random = new Random();
        int keyCount = 20;
        for (int i = 0; i < keyCount; i++)
        {
            _context.GameKeys.Add(new GameKey
            {
                GameId = created.Id,
                KeyCode = Guid.NewGuid().ToString("N").Substring(0, 12).ToUpper(),
                ExpiresAt = null,
                CreatedAt = DateTime.UtcNow,
                IsUsed = false
            });
        }
        await _context.SaveChangesAsync();

        return created;
    }

    // Cập nhật thông tin game; nếu GenreIds được truyền → xóa hết thể loại cũ rồi gán lại
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

    // Xóa game theo ID (cascade delete các quan hệ liên quan được xử lý bởi GameService)
    public async Task DeleteGameAsync(int id)
    {
        var existing = await _gameService.GetById(id) ?? throw new Exception("Game not found");
        await _gameService.Delete(id);
    }

    // ================= USERS =================

    // Tìm kiếm user theo từ khóa, trạng thái, khoảng ngày đăng ký; kèm danh sách roles của từng user
    public async Task<(IEnumerable<object> Users, int TotalCount)> GetUsersAsync(
        string? keyword, bool? isActive, DateTime? fromDate, DateTime? toDate,
        string? sortBy, bool desc, int page, int pageSize)
    {
        (page, pageSize) = PaginationHelper.Validate(page, pageSize);
        var query = _context.Users.AsQueryable();

        if (!string.IsNullOrEmpty(keyword))
            query = query.Where(u => u.Username.Contains(keyword) || u.DisplayName.Contains(keyword) || u.Email.Contains(keyword));
        if (isActive.HasValue)
            query = query.Where(u => u.IsActive == isActive.Value);
        if (fromDate.HasValue)
            query = query.Where(u => u.CreatedAt >= fromDate.Value);
        if (toDate.HasValue)
            query = query.Where(u => u.CreatedAt <= toDate.Value.AddDays(1));

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

        var users = await query.Skip((page - 1) * pageSize).Take(pageSize)
            .Select(u => (object)new
            {
                u.Id,
                u.Username,
                u.DisplayName,
                u.Email,
                u.Phone,
                u.AvatarUrl,
                u.Wallet,
                u.IsActive,
                u.CreatedAt,
                roles = u.UserRoles
                    .Where(ur => !ur.IsDeleted)
                    .Select(ur => ur.Role.Name)
                    .ToList()
            }).ToListAsync();

        return (users, totalCount);
    }

    // Cập nhật thông tin user (tên, email, SĐT, ảnh đại diện, số dư ví, trạng thái)
    // Chỉ cập nhật trường nào được truyền vào (null-safe update)
    public async Task UpdateUserAsync(int id, AdminUserUpdateDto dto)
    {
        var user = await _context.Users.FindAsync(id) ?? throw new Exception("User not found");
        user.DisplayName = dto.DisplayName ?? user.DisplayName;
        user.Email = dto.Email ?? user.Email;
        if (dto.Phone != null) user.Phone = dto.Phone;
        if (dto.AvatarUrl != null) user.AvatarUrl = dto.AvatarUrl;
        if (dto.Wallet.HasValue) user.Wallet = dto.Wallet.Value;
        if (dto.IsActive.HasValue) user.IsActive = dto.IsActive.Value;
        await _context.SaveChangesAsync();
    }

    // Xóa hoàn toàn user khỏi database theo ID
    public async Task DeleteUserAsync(int id)
    {
        var user = await _context.Users.FindAsync(id) ?? throw new Exception("User not found");
        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
    }

    // ================= ORDERS =================

    // Tìm kiếm đơn hàng theo từ khóa (username hoặc ID), khoảng ngày, trạng thái; phân trang
    public async Task<(IEnumerable<Order> Orders, int TotalCount)> GetOrdersAsync(
        string? keyword, DateTime? fromDate, DateTime? toDate, string? status,
        string? sortBy, bool desc, int page, int pageSize)
    {
        (page, pageSize) = PaginationHelper.Validate(page, pageSize);
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
            "userid" => desc ? query.OrderByDescending(o => o.UserId) : query.OrderBy(o => o.UserId),
            "totalamount" => desc ? query.OrderByDescending(o => o.TotalAmount) : query.OrderBy(o => o.TotalAmount),
            "status" => desc ? query.OrderByDescending(o => o.Status) : query.OrderBy(o => o.Status),
            "paymentmethod" => desc ? query.OrderByDescending(o => o.PaymentMethod) : query.OrderBy(o => o.PaymentMethod),
            "orderdate" => desc ? query.OrderByDescending(o => o.OrderDate) : query.OrderBy(o => o.OrderDate),
            _ => query.OrderByDescending(o => o.OrderDate)
        };

        var orders = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
        return (orders, totalCount);
    }

    // Cập nhật trạng thái đơn hàng (Pending/Completed/Cancelled/Refunded)
    // Việc gửi thông báo cho user được xử lý bên trong OrderService.UpdateStatus
    public async Task UpdateOrderStatusAsync(int orderId, string status)
    {
        await _orderService.UpdateStatus(orderId, status);
    }

    // ================= CATEGORIES (Genres) =================

    // Lấy danh sách thể loại với filter (từ khóa, trạng thái, có game không),
    // kèm số lượng game thuộc mỗi thể loại (gameCount)
    public async Task<object> GetCategoriesAsync(string? keyword, string? status, bool? hasGames,
        string? sortBy, bool desc, int page, int pageSize)
    {
        (page, pageSize) = PaginationHelper.Validate(page, pageSize);
        var query = _context.Genres.AsQueryable();

        if (!string.IsNullOrEmpty(keyword))
            query = query.Where(g => g.Name.Contains(keyword) || g.Description.Contains(keyword));
        if (status == "active") query = query.Where(g => g.IsActive);
        else if (status == "inactive") query = query.Where(g => !g.IsActive);
        if (hasGames == true)
            query = query.Where(g => _context.GameGenres.Any(gg => gg.GenreId == g.Id));
        else if (hasGames == false)
            query = query.Where(g => !_context.GameGenres.Any(gg => gg.GenreId == g.Id));

        var totalCount = await query.CountAsync();

        query = sortBy?.ToLower() switch
        {
            "id" => desc ? query.OrderByDescending(g => g.Id) : query.OrderBy(g => g.Id),
            "name" => desc ? query.OrderByDescending(g => g.Name) : query.OrderBy(g => g.Name),
            "description" => desc ? query.OrderByDescending(g => g.Description) : query.OrderBy(g => g.Description),
            "isactive" => desc ? query.OrderByDescending(g => g.IsActive) : query.OrderBy(g => g.IsActive),
            "gamecount" => desc
                ? query.OrderByDescending(g => _context.GameGenres.Count(gg => gg.GenreId == g.Id))
                : query.OrderBy(g => _context.GameGenres.Count(gg => gg.GenreId == g.Id)),
            _ => query.OrderBy(g => g.Name)
        };

        var data = await query.Skip((page - 1) * pageSize).Take(pageSize)
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

    // Tạo thể loại mới; kiểm tra trùng tên trước khi lưu
    public async Task CreateCategoryAsync(CategoryDto dto)
    {
        if (await _context.Genres.AnyAsync(g => g.Name == dto.Name))
            throw new Exception("Category name already exists");
        var genre = new Genre { Name = dto.Name, Description = dto.Description ?? "", IconUrl = dto.IconUrl ?? "", IsActive = dto.IsActive };
        _context.Genres.Add(genre);
        await _context.SaveChangesAsync();
    }

    // Cập nhật thể loại; kiểm tra tên mới không trùng với thể loại khác
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

    // Xóa thể loại; từ chối nếu vẫn còn game đang gắn với thể loại này
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

    // Lấy danh sách game key với filter (từ khóa, game, trạng thái);
    // trả thêm thống kê tổng số key / đã dùng / còn dùng / hết hạn
    public async Task<object> GetGameKeysAsync(string? keyword, int? gameId, string? status,
        string? sortBy, bool desc, int page, int pageSize)
    {
        (page, pageSize) = PaginationHelper.Validate(page, pageSize);
        var query = _context.GameKeys.Include(k => k.Game).AsQueryable();

        if (!string.IsNullOrEmpty(keyword))
            query = query.Where(k => k.KeyCode.Contains(keyword) || k.Game.Title.Contains(keyword));
        if (gameId.HasValue) query = query.Where(k => k.GameId == gameId.Value);
        if (status == "available") query = query.Where(k => !k.IsUsed && (k.ExpiresAt == null || k.ExpiresAt > DateTime.UtcNow));
        else if (status == "used") query = query.Where(k => k.IsUsed);
        else if (status == "expired") query = query.Where(k => k.ExpiresAt != null && k.ExpiresAt <= DateTime.UtcNow && !k.IsUsed);

        var totalCount = await query.CountAsync();

        query = sortBy?.ToLower() switch
        {
            "id" => desc ? query.OrderByDescending(k => k.Id) : query.OrderBy(k => k.Id),
            "gameid" => desc ? query.OrderByDescending(k => k.GameId) : query.OrderBy(k => k.GameId),
            "gametitle" => desc ? query.OrderByDescending(k => k.Game.Title) : query.OrderBy(k => k.Game.Title),
            "keycode" => desc ? query.OrderByDescending(k => k.KeyCode) : query.OrderBy(k => k.KeyCode),
            "createdat" => desc ? query.OrderByDescending(k => k.CreatedAt) : query.OrderBy(k => k.CreatedAt),
            "expiresat" => desc ? query.OrderByDescending(k => k.ExpiresAt) : query.OrderBy(k => k.ExpiresAt),
            _ => query.OrderByDescending(k => k.CreatedAt)
        };

        var data = await query.Skip((page - 1) * pageSize).Take(pageSize)
            .Select(k => new
            {
                k.Id,
                k.GameId,
                gameTitle = k.Game.Title,
                k.KeyCode,
                k.IsUsed,
                k.OrderDetailId,
                buyerUserId = k.OrderDetail != null ? (int?)k.OrderDetail.Order.UserId : null,
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

    // Tạo 1 game key; kiểm tra key code chưa tồn tại trong hệ thống
    public async Task CreateGameKeyAsync(GameKeyDto dto)
    {
        var game = await _context.Games.FindAsync(dto.GameId) ?? throw new Exception("Game not found");
        if (await _context.GameKeys.AnyAsync(k => k.KeyCode == dto.KeyCode))
            throw new Exception("Key code already exists");
        _context.GameKeys.Add(new GameKey { GameId = dto.GameId, KeyCode = dto.KeyCode, ExpiresAt = dto.ExpiresAt });
        await _context.SaveChangesAsync();
    }

    // Tạo nhiều game key cùng lúc; bỏ qua các code trống hoặc đã tồn tại (không báo lỗi từng cái)
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

    // Cập nhật key code hoặc ngày hết hạn; từ chối nếu key đã được bán (isUsed = true)
    public async Task UpdateGameKeyAsync(int id, UpdateGameKeyDto dto)
    {
        var key = await _context.GameKeys.FindAsync(id) ?? throw new Exception("Key not found");
        if (key.IsUsed) throw new Exception("Cannot edit a used key");
        if (!string.IsNullOrWhiteSpace(dto.KeyCode))
        {
            if (await _context.GameKeys.AnyAsync(k => k.KeyCode == dto.KeyCode && k.Id != id))
                throw new Exception("Key code already exists");
            key.KeyCode = dto.KeyCode;
        }
        key.ExpiresAt = dto.ClearExpiry ? null : (dto.ExpiresAt ?? key.ExpiresAt);
        await _context.SaveChangesAsync();
    }

    // Xóa game key; từ chối nếu key đã được bán (tránh mất dữ liệu lịch sử)
    public async Task DeleteGameKeyAsync(int id)
    {
        var key = await _context.GameKeys.FindAsync(id) ?? throw new Exception("Key not found");
        if (key.IsUsed) throw new Exception("Cannot delete a used key");
        _context.GameKeys.Remove(key);
        await _context.SaveChangesAsync();
    }

    // ================= PAYMENTS =================

    // Lấy danh sách thanh toán, có thể lọc theo từ khóa, trạng thái, phương thức, khoảng ngày
    public async Task<object> GetPaymentsAsync(string? keyword, string? status, string? method,
        DateTime? fromDate, DateTime? toDate, string? sortBy, bool desc, int page, int pageSize)
    {
        (page, pageSize) = PaginationHelper.Validate(page, pageSize);
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

        query = sortBy?.ToLower() switch
        {
            "id" => desc ? query.OrderByDescending(p => p.Id) : query.OrderBy(p => p.Id),
            "orderid" => desc ? query.OrderByDescending(p => p.OrderId) : query.OrderBy(p => p.OrderId),
            "username" => desc ? query.OrderByDescending(p => p.Order.User.Username) : query.OrderBy(p => p.Order.User.Username),
            "amount" => desc ? query.OrderByDescending(p => p.Amount) : query.OrderBy(p => p.Amount),
            "paymentmethod" => desc ? query.OrderByDescending(p => p.PaymentMethod) : query.OrderBy(p => p.PaymentMethod),
            "status" => desc ? query.OrderByDescending(p => p.Status) : query.OrderBy(p => p.Status),
            "paidat" => desc ? query.OrderByDescending(p => p.PaidAt) : query.OrderBy(p => p.PaidAt),
            _ => query.OrderByDescending(p => p.PaidAt)
        };

        var data = await query.Skip((page - 1) * pageSize).Take(pageSize)
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

    // Lấy chi tiết một đơn hàng cụ thể kèm toàn bộ lịch sử thanh toán liên quan
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

    // Hoàn tiền: cộng lại số tiền vào ví user, đổi trạng thái payment và order sang "Refunded"
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

    // Lấy danh sách role (không lấy role đã xóa mềm), kèm số user và danh sách permissions của mỗi role
    public async Task<object> GetRolesAsync(string? keyword, bool? isActive, bool? hasUsers,
        string? sortBy, bool desc, int page, int pageSize)
    {
        (page, pageSize) = PaginationHelper.Validate(page, pageSize);
        var query = _context.Roles.Where(r => !r.IsDeleted).AsQueryable();
        if (!string.IsNullOrEmpty(keyword)) query = query.Where(r => r.Name.Contains(keyword) || r.Description.Contains(keyword));
        if (isActive.HasValue)
            query = query.Where(r => r.IsActive == isActive.Value);
        if (hasUsers == true)
            query = query.Where(r => _context.UserRoles.Any(ur => ur.RoleId == r.Id && !ur.IsDeleted));
        else if (hasUsers == false)
            query = query.Where(r => !_context.UserRoles.Any(ur => ur.RoleId == r.Id && !ur.IsDeleted));

        var totalCount = await query.CountAsync();

        query = sortBy?.ToLower() switch
        {
            "id" => desc ? query.OrderByDescending(r => r.Id) : query.OrderBy(r => r.Id),
            "name" => desc ? query.OrderByDescending(r => r.Name) : query.OrderBy(r => r.Name),
            "description" => desc ? query.OrderByDescending(r => r.Description) : query.OrderBy(r => r.Description),
            "usercount" => desc
                ? query.OrderByDescending(r => _context.UserRoles.Count(ur => ur.RoleId == r.Id && !ur.IsDeleted))
                : query.OrderBy(r => _context.UserRoles.Count(ur => ur.RoleId == r.Id && !ur.IsDeleted)),
            _ => query.OrderBy(r => r.Name)
        };

        var totalUsers = await _context.Users.CountAsync();

        var rawData = await query.Skip((page - 1) * pageSize).Take(pageSize)
            .Select(r => new
            {
                r.Id,
                r.Name,
                r.Description,
                r.IsActive,
                r.Created,
                userCount = _context.UserRoles.Count(ur => ur.RoleId == r.Id && !ur.IsDeleted),
                permissionCount = _context.RolePermissions.Count(rp => rp.RoleId == r.Id)
            }).ToListAsync();

        // Role "User" là mặc định của mọi user → userCount = tổng số user thực tế
        var data = rawData.Select(r => new
        {
            r.Id,
            r.Name,
            r.Description,
            r.IsActive,
            r.Created,
            userCount = r.Name == "User" ? totalUsers : r.userCount,
            r.permissionCount
        }).ToList();

        return new { data, totalCount };
    }

    // Tạo role mới với tên duy nhất; gán danh sách permissions nếu có
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

    // Cập nhật role; chỉ thay đổi permissions nếu dto.Permissions được gửi lên (không null)
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

        if (dto.Permissions != null)
        {
            var oldPerms = await _context.RolePermissions.Where(rp => rp.RoleId == id).ToListAsync();
            _context.RolePermissions.RemoveRange(oldPerms);
            foreach (var perm in dto.Permissions)
            {
                _context.RolePermissions.Add(new RolePermission { RoleId = id, Permission = perm });
            }
        }
        await _context.SaveChangesAsync();
    }

    // Xóa mềm role (IsDeleted = true); bảo vệ role "Admin" và "User" tích hợp sẵn
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

    // Lấy tất cả user kèm danh sách role; dùng để quản lý phân quyền
    public async Task<object> GetStaffAsync(string? keyword, int? roleId, bool? isActive,
        string? sortBy, bool desc, int page, int pageSize)
    {
        (page, pageSize) = PaginationHelper.Validate(page, pageSize);
        var query = _context.Users.AsQueryable();
        if (roleId.HasValue) query = query.Where(u => u.UserRoles.Any(ur => ur.RoleId == roleId.Value && !ur.IsDeleted));
        if (!string.IsNullOrEmpty(keyword)) query = query.Where(u => u.Username.Contains(keyword) || u.DisplayName.Contains(keyword) || u.Email.Contains(keyword));
        if (isActive.HasValue)
            query = query.Where(u => u.IsActive == isActive.Value);

        var totalCount = await query.CountAsync();

        query = sortBy?.ToLower() switch
        {
            "id" => desc ? query.OrderByDescending(u => u.Id) : query.OrderBy(u => u.Id),
            "username" => desc ? query.OrderByDescending(u => u.Username) : query.OrderBy(u => u.Username),
            "displayname" => desc ? query.OrderByDescending(u => u.DisplayName) : query.OrderBy(u => u.DisplayName),
            "email" => desc ? query.OrderByDescending(u => u.Email) : query.OrderBy(u => u.Email),
            _ => query.OrderBy(u => u.Username)
        };

        var data = await query.Skip((page - 1) * pageSize).Take(pageSize)
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

    // Gán role cho user; nếu UserRole đã tồn tại nhưng bị xóa mềm → khôi phục lại
    // Không cho phép gán role "User" qua chức năng này (chỉ dùng cho nhân viên/admin)
    public async Task AssignRoleAsync(AssignRoleDto dto)
    {
        var user = await _context.Users.FindAsync(dto.UserId) ?? throw new Exception("User not found");
        var role = await _context.Roles.FindAsync(dto.RoleId) ?? throw new Exception("Role not found");
        if (role.Name == "User")
            throw new Exception("Không thể gán role 'User' qua chức năng quản lý nhân viên");

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

    // Thu hồi role của user bằng cách xóa mềm bản ghi UserRole (IsDeleted = true)
    public async Task RevokeRoleAsync(AssignRoleDto dto)
    {
        var userRole = await _context.UserRoles.FirstOrDefaultAsync(ur => ur.UserId == dto.UserId && ur.RoleId == dto.RoleId && !ur.IsDeleted)
                        ?? throw new Exception("User does not have this role");
        userRole.IsDeleted = true;
        userRole.Modified = DateTime.UtcNow;
        await _context.SaveChangesAsync();
    }

    // ================= REVENUE =================

    // Doanh thu theo tháng (groupBy="month", year=năm cụ thể) hoặc theo năm (groupBy="year")
    // Chỉ tính đơn hàng có Status = "Completed"
    public async Task<object> GetRevenueAsync(int? year, string groupBy)
    {
        var completedOrders = await _context.Orders
            .Where(o => o.Status == "Completed")
            .Select(o => new { o.TotalAmount, o.OrderDate })
            .ToListAsync();

        if (groupBy == "year")
        {
            var rows = completedOrders
                .GroupBy(o => o.OrderDate.Year)
                .OrderBy(g => g.Key)
                .Select(g => new
                {
                    label = g.Key.ToString(),
                    period = g.Key.ToString(),
                    revenue = g.Sum(o => o.TotalAmount),
                    orders = g.Count(),
                    avgOrder = g.Count() > 0 ? g.Sum(o => o.TotalAmount) / g.Count() : 0
                }).ToList();

            var totalRevenue = rows.Sum(r => r.revenue);
            var totalOrders = rows.Sum(r => r.orders);
            return new
            {
                groupBy = "year",
                rows,
                totalRevenue,
                totalOrders,
                avgOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0
            };
        }
        else
        {
            var targetYear = year ?? DateTime.UtcNow.Year;
            var monthNames = new[] { "T1","T2","T3","T4","T5","T6","T7","T8","T9","T10","T11","T12" };

            var ordersThisYear = completedOrders.Where(o => o.OrderDate.Year == targetYear).ToList();

            var rows = Enumerable.Range(1, 12).Select(m => new
            {
                label = monthNames[m - 1],
                period = $"{targetYear}-{m:D2}",
                revenue = ordersThisYear.Where(o => o.OrderDate.Month == m).Sum(o => o.TotalAmount),
                orders = ordersThisYear.Count(o => o.OrderDate.Month == m),
                avgOrder = ordersThisYear.Count(o => o.OrderDate.Month == m) > 0
                    ? ordersThisYear.Where(o => o.OrderDate.Month == m).Sum(o => o.TotalAmount) /
                      ordersThisYear.Count(o => o.OrderDate.Month == m)
                    : 0
            }).ToList();

            var totalRevenue = rows.Sum(r => r.revenue);
            var totalOrders = rows.Sum(r => r.orders);
            var availableYears = completedOrders.Select(o => o.OrderDate.Year).Distinct().OrderByDescending(y => y).ToList();
            if (!availableYears.Contains(targetYear)) availableYears.Insert(0, targetYear);

            return new
            {
                groupBy = "month",
                year = targetYear,
                rows,
                totalRevenue,
                totalOrders,
                avgOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0,
                availableYears
            };
        }
    }

    // Trả về danh sách tất cả permission hợp lệ trong hệ thống (dùng để gán cho role)
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
