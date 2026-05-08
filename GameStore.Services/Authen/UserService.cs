// GameStore.Services/Authen/UserService.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameStore.Common.Auth;
using GameStore.Entities.Users;
using GameStore.Repository.EFCore;

namespace GameStore.Services.Authen;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;

    public UserService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<User?> Authenticate(string username, string password)
    {
        if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password))
            return null;

        var user = await _userRepository.GetByUsernameAsync(username);
        if (user == null) return null;

        if (user.Salt != null && user.Salt.Length > 0)
        {
            if (!TokenHelper.IsValidPassword(password, user.Salt, user.Password))
                return null;
        }
        else
        {
            if (user.Password != password) return null;
        }

        return user;
    }

    public async Task<User?> GetById(int id) => await _userRepository.GetByIdAsync(id);
    public async Task<List<User>> GetAll() => (await _userRepository.GetAllAsync()).ToList();

    public async Task<User> Register(User user, string password)
    {
        byte[] salt;
        user.Password = TokenHelper.HashPassword(password, out salt);
        user.Salt = salt;
        user.CreatedAt = DateTime.Now;
        user.IsActive = true;
        await _userRepository.AddAsync(user);
        return user;
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
}
