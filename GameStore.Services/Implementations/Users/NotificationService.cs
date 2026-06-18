using GameStore.Services.Interfaces.Users;
// GameStore.Services/NotificationService.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using GameStore.DTOs.Notifications;
using GameStore.Entities.Store;
using GameStore.Repository;

namespace GameStore.Services.Implementations.Users;
public class NotificationService : INotificationService
{
    private readonly GameStoreDbContext _context;

    public NotificationService(GameStoreDbContext context) => _context = context;

    public async Task<IEnumerable<NotificationDto>> GetUserNotificationsAsync(int userId, bool unreadOnly = false)
    {
        var query = _context.Notifications
            .Where(n => n.UserId == userId);
        if (unreadOnly)
            query = query.Where(n => !n.IsRead);

        return await query
            .OrderByDescending(n => n.CreatedAt)
            .Select(n => new NotificationDto
            {
                Id = n.Id,
                Title = n.Title,
                Message = n.Message,
                Link = n.Link,
                IsRead = n.IsRead,
                CreatedAt = n.CreatedAt
            })
            .Take(50) // giới hạn 50 thông báo gần nhất
            .ToListAsync();
    }

    public async Task MarkAsReadAsync(int notificationId, int userId)
    {
        var noti = await _context.Notifications
            .FirstOrDefaultAsync(n => n.Id == notificationId && n.UserId == userId);
        if (noti != null)
        {
            noti.IsRead = true;
            await _context.SaveChangesAsync();
        }
    }

    public async Task CreateNotificationAsync(int userId, string title, string message, string? link = null)
    {
        _context.Notifications.Add(new Notification
        {
            UserId = userId,
            Title = title,
            Message = message,
            Link = link,
            CreatedAt = DateTime.UtcNow
        });
        await _context.SaveChangesAsync();
    }
}
