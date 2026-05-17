// GameStore.Services/NotificationService.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using GameStore.DTOs.Notifications;
using GameStore.Entities.Store;
using GameStore.Repository.EFCore;

namespace GameStore.Services;

public class NotificationService : INotificationService
{
    private readonly INotificationRepository _notiRepo;
    public NotificationService(INotificationRepository notiRepo) => _notiRepo = notiRepo;

    public async Task<IEnumerable<NotificationDto>> GetUserNotificationsAsync(int userId, bool unreadOnly = false)
    {
        var notis = await _notiRepo.GetByUserAsync(userId, unreadOnly);
        return notis.Select(n => new NotificationDto
        {
            Id = n.Id,
            Title = n.Title,
            Message = n.Message,
            Link = n.Link,
            IsRead = n.IsRead,
            CreatedAt = n.CreatedAt
        });
    }

    public async Task MarkAsReadAsync(int notificationId, int userId) =>
        await _notiRepo.MarkAsReadAsync(notificationId, userId);

    public async Task CreateNotificationAsync(int userId, string title, string message, string? link = null)
    {
        await _notiRepo.AddAsync(new Notification
        {
            UserId = userId,
            Title = title,
            Message = message,
            Link = link,
            CreatedAt = DateTime.UtcNow
        });
    }
}
