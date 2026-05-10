using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using GameStore.Services;

namespace GameStore.APIService.Controllers;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class NotificationController : ControllerBase
{
    private readonly INotificationService _notiService;
    public NotificationController(INotificationService notiService) => _notiService = notiService;

    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] bool unread = false)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        return Ok(await _notiService.GetUserNotificationsAsync(userId, unread));
    }

    [HttpPut("{id}/read")]
    public async Task<IActionResult> MarkRead(int id)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        await _notiService.MarkAsReadAsync(id, userId);
        return Ok();
    }
}
