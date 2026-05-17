// GameStore.Repository/EFCore/IUserRoleRepository.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameStore.Entities.Users;

namespace GameStore.Repository.EFCore;

public interface IUserRoleRepository : IRepository<UserRole>
{
    Task<UserRole?> GetActiveRoleByUserIdAsync(int userId);
    Task AddRoleToUserAsync(int userId, int roleId);
}
