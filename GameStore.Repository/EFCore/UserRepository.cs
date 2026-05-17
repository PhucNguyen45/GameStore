// GameStore.Repository/EFCore/UserRepository.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using GameStore.Entities.Users;

namespace GameStore.Repository.EFCore;

public class UserRepository : Repository<User>, IUserRepository
{
    public UserRepository(GameStoreDbContext context) : base(context) { }

    public async Task<User?> GetByUsernameAsync(string username) =>
        await _dbSet.FirstOrDefaultAsync(u => u.Username == username && u.IsActive);

    public async Task<User?> GetByUsernameForAuthAsync(string username) =>
    await _dbSet.FirstOrDefaultAsync(u => u.Username == username); // Không filter IsActive - dùng cho Authentication

    public async Task<User?> GetByEmailAsync(string email) =>
        await _dbSet.FirstOrDefaultAsync(u => u.Email == email && u.IsActive);

    public async Task<(List<User> Users, int TotalCount)> SearchAsync(string? keyword, int page, int pageSize)
    {
        var query = _dbSet.Where(u => u.IsActive);
        if (!string.IsNullOrEmpty(keyword))
        {
            keyword = keyword.ToLower();
            query = query.Where(u => u.Username.ToLower().Contains(keyword)
                || u.DisplayName.ToLower().Contains(keyword)
                || u.Email.ToLower().Contains(keyword));
        }
        var totalCount = await query.CountAsync();
        var users = await query.OrderByDescending(u => u.CreatedAt)
            .Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
        return (users, totalCount);
    }

    public async Task<bool> IsUsernameExists(string username) =>
        await _dbSet.AnyAsync(u => u.Username == username);

    public async Task<bool> IsEmailExists(string email) =>
        await _dbSet.AnyAsync(u => u.Email == email);

    // ADMIN
    public async Task<(List<User> Users, int TotalCount)> AdminSearchAsync(
    string? keyword, bool? isActive, DateTime? fromDate, DateTime? toDate,
    string? sortBy, bool desc, int page, int pageSize)
    {
        var query = _dbSet.AsQueryable();

        if (!string.IsNullOrEmpty(keyword))
            query = query.Where(u => u.Username.Contains(keyword) || u.DisplayName.Contains(keyword) || u.Email.Contains(keyword));
        if (isActive.HasValue)
            query = query.Where(u => u.IsActive == isActive.Value);
        if (fromDate.HasValue)
            query = query.Where(u => u.CreatedAt >= fromDate.Value);
        if (toDate.HasValue)
            query = query.Where(u => u.CreatedAt <= toDate.Value.AddDays(1));

        int totalCount = await query.CountAsync();

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
}
