# Admin Service + Controller – Cheatsheet thi

> **Service:** `GameStore.Services/AdminService.cs` — Inject: `_context`, `_gameService`, `_orderService`  
> **Controller:** `GameStore.APIService/Controllers/AdminController.cs` — route gốc `api/admin`, toàn bộ action đều cần `[Authorize(Roles = "Admin")]`

---

## Pattern chung lặp đi lặp lại

### 0. Cấu trúc Controller (khung cố định)

```csharp
[Authorize(Roles = "Admin")]
[Route("api/admin")]
[ApiController]
public class AdminController : ControllerBase
{
    private readonly IAdminService _adminService;
    public AdminController(IAdminService adminService) => _adminService = adminService;

    // Các action viết tiếp ở đây...
}
```

> **Quy tắc trả về:**
> - Lấy danh sách → `Ok(PagedResponse<T>.Create(items, totalCount, page, pageSize))`
> - Lấy 1 đối tượng / object tự tạo → `Ok(result)`
> - Tạo/Sửa/Xóa thành công → `Ok(new { message = "..." })`
> - Có lỗi → dùng `try/catch` + `BadRequest(new { message = ex.Message })`

---

### 1. Truy vấn + filter + sort + phân trang (dùng cho mọi bảng)

```csharp
public async Task<(IEnumerable<X> Items, int TotalCount)> GetXAsync(
    string? keyword, string? sortBy, bool desc, int page, int pageSize)
{
    (page, pageSize) = PaginationHelper.Validate(page, pageSize);
    var query = _context.Xs.AsQueryable();

    // Filter
    if (!string.IsNullOrEmpty(keyword))
        query = query.Where(x => x.Name.Contains(keyword));

    var totalCount = await query.CountAsync();

    // Sort
    query = sortBy?.ToLower() switch
    {
        "name" => desc ? query.OrderByDescending(x => x.Name) : query.OrderBy(x => x.Name),
        _      => query.OrderByDescending(x => x.CreatedAt)
    };

    // Phân trang
    var items = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
    return (items, totalCount);
}
```

### 2. CRUD cơ bản

**Service:**
```csharp
// Tạo mới — kiểm tra trùng trước
public async Task CreateAsync(XDto dto)
{
    if (await _context.Xs.AnyAsync(x => x.Name == dto.Name))
        throw new Exception("Name already exists");
    _context.Xs.Add(new X { Name = dto.Name });
    await _context.SaveChangesAsync();
}

// Cập nhật — null-safe (chỉ đổi trường nào được gửi lên)
public async Task UpdateAsync(int id, XDto dto)
{
    var item = await _context.Xs.FindAsync(id) ?? throw new Exception("Not found");
    item.Name = dto.Name ?? item.Name;
    await _context.SaveChangesAsync();
}

// Xóa — kiểm tra ràng buộc trước
public async Task DeleteAsync(int id)
{
    var item = await _context.Xs.FindAsync(id) ?? throw new Exception("Not found");
    _context.Xs.Remove(item);
    await _context.SaveChangesAsync();
}
```

**Controller tương ứng:**
```csharp
[HttpPost("xs")]
public async Task<IActionResult> CreateX([FromBody] XDto dto)
{
    try { await _adminService.CreateAsync(dto); return Ok(new { message = "Created" }); }
    catch (Exception ex) { return BadRequest(new { message = ex.Message }); }
}

[HttpPut("xs/{id}")]
public async Task<IActionResult> UpdateX(int id, [FromBody] XDto dto)
{
    try { await _adminService.UpdateAsync(id, dto); return Ok(new { message = "Updated" }); }
    catch (Exception ex) { return BadRequest(new { message = ex.Message }); }
}

[HttpDelete("xs/{id}")]
public async Task<IActionResult> DeleteX(int id)
{
    try { await _adminService.DeleteAsync(id); return Ok(new { message = "Deleted" }); }
    catch (Exception ex) { return BadRequest(new { message = ex.Message }); }
}
```

---

## Tính năng thầy có thể bắt code thêm

### A. Top game bán chạy nhất

**Service:**
```csharp
public async Task<object> GetTopGamesAsync(int top = 10)
{
    var result = await _context.OrderDetails
        .Where(od => od.Order.Status == "Completed")
        .GroupBy(od => od.GameId)
        .Select(g => new
        {
            gameId  = g.Key,
            title   = g.First().Game.Title,
            sold    = g.Sum(od => od.Quantity),
            revenue = g.Sum(od => od.Quantity * od.UnitPrice)
        })
        .OrderByDescending(x => x.sold)
        .Take(top)
        .ToListAsync();

    return result;
}
```

**Controller:**
```csharp
[HttpGet("top-games")]
public async Task<IActionResult> GetTopGames([FromQuery] int top = 10)
    => Ok(await _adminService.GetTopGamesAsync(top));
```

---

### B. Thống kê user mới đăng ký theo tháng

**Service:**
```csharp
public async Task<object> GetNewUsersStatAsync(int year)
{
    var users = await _context.Users
        .Where(u => u.CreatedAt.Year == year)
        .Select(u => new { u.CreatedAt.Month })
        .ToListAsync();

    var monthNames = new[] { "T1","T2","T3","T4","T5","T6","T7","T8","T9","T10","T11","T12" };

    var rows = Enumerable.Range(1, 12).Select(m => new
    {
        label = monthNames[m - 1],
        count = users.Count(u => u.Month == m)
    }).ToList();

    return new { year, rows, total = users.Count };
}
```

**Controller:**
```csharp
[HttpGet("users/stats")]
public async Task<IActionResult> GetNewUsersStat([FromQuery] int? year)
    => Ok(await _adminService.GetNewUsersStatAsync(year ?? DateTime.UtcNow.Year));
```

---

### C. Thống kê số key còn lại theo từng game

**Service:**
```csharp
public async Task<object> GetKeyStockByGameAsync()
{
    var result = await _context.Games
        .Select(g => new
        {
            gameId    = g.Id,
            title     = g.Title,
            total     = _context.GameKeys.Count(k => k.GameId == g.Id),
            available = _context.GameKeys.Count(k => k.GameId == g.Id && !k.IsUsed
                            && (k.ExpiresAt == null || k.ExpiresAt > DateTime.UtcNow)),
            used      = _context.GameKeys.Count(k => k.GameId == g.Id && k.IsUsed)
        })
        .OrderBy(g => g.available)
        .ToListAsync();

    return result;
}
```

**Controller:**
```csharp
[HttpGet("gamekeys/stock")]
public async Task<IActionResult> GetKeyStock()
    => Ok(await _adminService.GetKeyStockByGameAsync());
```

---

### D. Khóa / mở khóa user (ban/unban)

**Service:**
```csharp
public async Task ToggleUserActiveAsync(int userId)
{
    var user = await _context.Users.FindAsync(userId)
        ?? throw new Exception("User not found");
    user.IsActive = !user.IsActive;
    await _context.SaveChangesAsync();
}
```

**Controller:**
```csharp
[HttpPut("users/{id}/toggle-active")]
public async Task<IActionResult> ToggleUserActive(int id)
{
    try { await _adminService.ToggleUserActiveAsync(id); return Ok(new { message = "Updated" }); }
    catch (Exception ex) { return BadRequest(new { message = ex.Message }); }
}
```

---

### E. Tìm đơn hàng theo khoảng tiền

**Service:**
```csharp
public async Task<object> GetOrdersByAmountRangeAsync(long min, long max, int page, int pageSize)
{
    (page, pageSize) = PaginationHelper.Validate(page, pageSize);

    var query = _context.Orders
        .Include(o => o.User)
        .Where(o => o.TotalAmount >= min && o.TotalAmount <= max);

    var totalCount = await query.CountAsync();
    var items = await query
        .OrderByDescending(o => o.OrderDate)
        .Skip((page - 1) * pageSize)
        .Take(pageSize)
        .Select(o => new {
            o.Id, o.TotalAmount, o.Status, o.OrderDate,
            username = o.User.Username
        })
        .ToListAsync();

    return new { items, totalCount };
}
```

**Controller:**
```csharp
[HttpGet("orders/by-amount")]
public async Task<IActionResult> GetOrdersByAmount(
    [FromQuery] long min = 0, [FromQuery] long max = long.MaxValue,
    [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    => Ok(await _adminService.GetOrdersByAmountRangeAsync(min, max, page, pageSize));
```

---

### F. Doanh thu theo từng game

**Service:**
```csharp
public async Task<object> GetRevenueByGameAsync(int? top)
{
    var query = _context.OrderDetails
        .Where(od => od.Order.Status == "Completed")
        .GroupBy(od => new { od.GameId, od.Game.Title })
        .Select(g => new
        {
            gameId  = g.Key.GameId,
            title   = g.Key.Title,
            sold    = g.Sum(od => od.Quantity),
            revenue = g.Sum(od => od.Quantity * od.UnitPrice)
        })
        .OrderByDescending(x => x.revenue);

    var result = top.HasValue
        ? await query.Take(top.Value).ToListAsync()
        : await query.ToListAsync();

    return result;
}
```

**Controller:**
```csharp
[HttpGet("revenue/by-game")]
public async Task<IActionResult> GetRevenueByGame([FromQuery] int? top)
    => Ok(await _adminService.GetRevenueByGameAsync(top));
```

---

### G. Đếm đơn hàng theo trạng thái (tổng quan)

**Service:**
```csharp
public async Task<object> GetOrderSummaryAsync()
{
    var groups = await _context.Orders
        .GroupBy(o => o.Status)
        .Select(g => new { status = g.Key, count = g.Count() })
        .ToListAsync();

    return new
    {
        pending   = groups.FirstOrDefault(g => g.status == "Pending")?.count   ?? 0,
        completed = groups.FirstOrDefault(g => g.status == "Completed")?.count ?? 0,
        cancelled = groups.FirstOrDefault(g => g.status == "Cancelled")?.count ?? 0,
        refunded  = groups.FirstOrDefault(g => g.status == "Refunded")?.count  ?? 0,
    };
}
```

**Controller:**
```csharp
[HttpGet("orders/summary")]
public async Task<IActionResult> GetOrderSummary()
    => Ok(await _adminService.GetOrderSummaryAsync());
```

---

## Các endpoint có sẵn trong dự án (tra nhanh)

| Method | Route | Tác dụng |
|--------|-------|----------|
| GET | `api/admin/dashboard` | Tổng quan hệ thống |
| GET | `api/admin/revenue?groupBy=month&year=2026` | Doanh thu theo tháng/năm |
| GET | `api/admin/games` | Danh sách game (filter, sort, phân trang) |
| POST | `api/admin/games` | Tạo game mới |
| PUT | `api/admin/games/{id}` | Sửa game |
| DELETE | `api/admin/games/{id}` | Xóa game |
| GET | `api/admin/users` | Danh sách user |
| PUT | `api/admin/users/{id}` | Sửa user |
| DELETE | `api/admin/users/{id}` | Xóa user |
| GET | `api/admin/orders` | Danh sách đơn hàng |
| PUT | `api/admin/orders/{id}/status` | Duyệt / hủy đơn |
| GET | `api/admin/categories` | Danh sách thể loại |
| POST/PUT/DELETE | `api/admin/categories/{id}` | CRUD thể loại |
| GET | `api/admin/gamekeys` | Danh sách key game |
| POST | `api/admin/gamekeys` | Thêm 1 key |
| POST | `api/admin/gamekeys/batch` | Thêm nhiều key |
| PUT/DELETE | `api/admin/gamekeys/{id}` | Sửa / xóa key |
| GET | `api/admin/payments` | Danh sách thanh toán |
| POST | `api/admin/payments/refund/{id}` | Hoàn tiền |
| GET | `api/admin/roles` | Danh sách role |
| POST/PUT/DELETE | `api/admin/roles/{id}` | CRUD role |
| POST | `api/admin/staff/assign` | Gán role cho user |
| POST | `api/admin/staff/revoke` | Thu hồi role |

---

## Ghi nhớ nhanh các hàm EF Core hay dùng

| Hàm | Tác dụng |
|-----|----------|
| `.Where(x => ...)` | Lọc điều kiện |
| `.OrderBy(x => ...)` / `.OrderByDescending(...)` | Sắp xếp |
| `.Skip(n).Take(m)` | Phân trang |
| `.CountAsync()` | Đếm tổng |
| `.AnyAsync(x => ...)` | Kiểm tra tồn tại |
| `.FindAsync(id)` | Tìm theo khóa chính |
| `.Include(x => x.Y)` | Load navigation property |
| `.ThenInclude(y => y.Z)` | Load navigation lồng nhau |
| `.GroupBy(x => ...)` | Nhóm dữ liệu |
| `.Select(x => new { ... })` | Chọn trường cần lấy |
| `.ToListAsync()` | Thực thi query, trả về List |
| `.FirstOrDefaultAsync(...)` | Lấy 1 bản ghi đầu tiên |
| `.SumAsync(x => x.Field)` | Tính tổng |
| `SaveChangesAsync()` | Commit thay đổi vào DB |
| `_context.Xs.Add(obj)` | Thêm mới |
| `_context.Xs.Remove(obj)` | Xóa |
| `_context.Xs.Update(obj)` | Cập nhật |
