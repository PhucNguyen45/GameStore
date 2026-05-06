// GameStore.Repository/EFCore/IUserRepository.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameStore.Entities.Users;

namespace GameStore.Repository.EFCore;

public interface IUserRepository : IRepository<User>
{
    Task<User?> GetByUsernameAsync(string username);
    Task<User?> GetByEmailAsync(string email);
    Task<(List<User> Users, int TotalCount)> SearchAsync(string? keyword, int page, int pageSize);
    Task<bool> IsUsernameExists(string username);
    Task<bool> IsEmailExists(string email);
}
