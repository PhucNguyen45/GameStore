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
}
