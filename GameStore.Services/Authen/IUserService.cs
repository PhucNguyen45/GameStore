// GameStore.Services/Authen/IUserService.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameStore.Entities.Users;

namespace GameStore.Services.Authen;

public interface IUserService
{
    Task<User?> Authenticate(string username, string password);
    Task<User?> GetById(int id);
    Task<List<User>> GetAll();
    Task<User> Register(User user, string password); // vẫn giữ, chỉ tạo user
    Task<User> RegisterUserAsync(User user, string password); // mới: tạo user và gán role mặc định
    Task Update(User user, string? password = null);
    Task Delete(int id);
    Task<(List<User> Users, int TotalCount)> Search(string? keyword, int page, int pageSize);
    Task<bool> IsUsernameExists(string username);
    Task<bool> IsEmailExists(string email);
    Task<decimal> GetWalletBalance(int userId);
    Task AddToWallet(int userId, decimal amount);
    Task<string?> GetRoleNameAsync(int userId); // mới
}
