// GameStore.Repository/EFCore/INotificationRepository.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameStore.Entities.Store;

namespace GameStore.Repository.EFCore;

public interface INotificationRepository : IRepository<Notification>
{
    Task<List<Notification>> GetByUserAsync(int userId, bool unreadOnly = false, int limit = 50);
    Task MarkAsReadAsync(int notificationId, int userId);
}
