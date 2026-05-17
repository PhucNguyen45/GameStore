// GameStore.Repository/EFCore/NotificationRepository.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using GameStore.Entities.Store;

namespace GameStore.Repository.EFCore;

public class NotificationRepository : Repository<Notification>, INotificationRepository
{
    public NotificationRepository(GameStoreDbContext context) : base(context) { }

    public async Task<List<Notification>> GetByUserAsync(
        int userId, bool unreadOnly = false, int limit = 50)
    {
        var query = _dbSet.Where(n => n.UserId == userId);
        if (unreadOnly) query = query.Where(n => !n.IsRead);
        return await query.OrderByDescending(n => n.CreatedAt).Take(limit).ToListAsync();
    }

    public async Task MarkAsReadAsync(int notificationId, int userId)
    {
        var noti = await _dbSet.FirstOrDefaultAsync(n => n.Id == notificationId && n.UserId == userId);
        if (noti != null)
        {
            noti.IsRead = true;
            await _context.SaveChangesAsync();
        }
    }
}
