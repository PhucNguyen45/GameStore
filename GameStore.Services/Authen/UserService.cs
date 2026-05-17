// GameStore.Services/Authen/UserService.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameStore.Common.Auth;
using GameStore.Entities.Users;
using GameStore.Entities.Auth;
using GameStore.Repository.EFCore;

namespace GameStore.Services.Authen;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly IRoleRepository _roleRepo;
    private readonly IUserRoleRepository _userRoleRepo;

    public UserService(IUserRepository userRepository, IRoleRepository roleRepo, IUserRoleRepository userRoleRepo)
    {
        _userRepository = userRepository;
        _roleRepo = roleRepo;
        _userRoleRepo = userRoleRepo;
    }

    public async Task<User?> Authenticate(string username, string password)
    {
        if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password))
            return null;

        var user = await _userRepository.GetByUsernameForAuthAsync(username);
        if (user == null || user.Salt == null || user.Salt.Length == 0) return null;

        return TokenHelper.IsValidPassword(password, user.Salt, user.Password)
        ? user
        : null;
    }

    public async Task<User?> GetById(int id) => await _userRepository.GetByIdAsync(id);
    public async Task<List<User>> GetAll() => (await _userRepository.GetAllAsync()).ToList();

    public async Task<User> Register(User user, string password)
    {
        byte[] salt;
        user.Password = TokenHelper.HashPassword(password, out salt);
        user.Salt = salt;
        user.CreatedAt = DateTime.UtcNow;
        user.IsActive = true;
        await _userRepository.AddAsync(user);
        return user;
    }

    // Mới: đăng ký user và tự động gán role "User"
    public async Task<User> RegisterUserAsync(User user, string password)
    {
        var createdUser = await Register(user, password);
        var userRole = await _roleRepo.GetByNameAsync("User");
        if (userRole != null)
        {
            await _userRoleRepo.AddRoleToUserAsync(createdUser.Id, userRole.Id);
        }
        return createdUser;
    }

    public async Task Update(User user, string? password = null)
    {
        if (!string.IsNullOrEmpty(password))
        {
            byte[] salt;
            user.Password = TokenHelper.HashPassword(password, out salt);
            user.Salt = salt;
        }
        await _userRepository.UpdateAsync(user);
    }

    public async Task Delete(int id)
    {
        var user = await _userRepository.GetByIdAsync(id);
        if (user != null)
        {
            user.IsActive = false;
            await _userRepository.UpdateAsync(user);
        }
    }

    public async Task<(List<User> Users, int TotalCount)> Search(string? keyword, int page, int pageSize) =>
        await _userRepository.SearchAsync(keyword, page, pageSize);

    public async Task<bool> IsUsernameExists(string username) =>
        await _userRepository.IsUsernameExists(username);

    public async Task<bool> IsEmailExists(string email) =>
        await _userRepository.IsEmailExists(email);

    public async Task<decimal> GetWalletBalance(int userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        return user?.Wallet ?? 0;
    }

    public async Task AddToWallet(int userId, decimal amount)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user != null)
        {
            user.Wallet += amount;
            await _userRepository.UpdateAsync(user);
        }
    }

    // Mới: lấy tên role của user
    public async Task<string?> GetRoleNameAsync(int userId)
    {
        var userRole = await _userRoleRepo.GetActiveRoleByUserIdAsync(userId);
        return userRole?.Role?.Name;
    }
}
