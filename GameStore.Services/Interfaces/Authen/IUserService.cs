// GameStore.Services/Authen/IUserService.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GameStore.Services.Interfaces.Authen;

public interface IUserService
{
    Task<GameStore.Entities.Users.User?> Authenticate(string username, string password);
    Task<GameStore.Entities.Users.User?> GetById(int id);
    Task<List<GameStore.Entities.Users.User>> GetAll();
    Task<GameStore.Entities.Users.User> Register(GameStore.Entities.Users.User user, string password);
    Task Update(GameStore.Entities.Users.User user, string? password = null, string? currentPassword = null);
    Task Delete(int id);
    Task<(List<GameStore.Entities.Users.User> Users, int TotalCount)> Search(string? keyword, int page, int pageSize);
    Task<bool> IsUsernameExists(string username);
    Task<bool> IsEmailExists(string email);
    Task<long> GetWalletBalance(int userId);
    Task AddToWallet(int userId, long amount);
}
