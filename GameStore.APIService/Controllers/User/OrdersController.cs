// GameStore.APIService/Controllers/OrdersController.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using GameStore.Entities.Store;
using GameStore.Services.Interfaces.Users;
using System.Security.Claims;
using GameStore.DTOs.Orders;
using GameStore.DTOs.Common;
using GameStore.Repository;
using Microsoft.EntityFrameworkCore;

namespace GameStore.APIService.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;
    public OrdersController(IOrderService orderService) => _orderService = orderService;

    [HttpGet]
    public async Task<IActionResult> GetMyOrders()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var orders = await _orderService.GetByUser(userId);
        return Ok(orders);
    }

    [HttpGet("history")]
    public async Task<IActionResult> GetMyOrderHistory()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var history = await _orderService.GetOrderHistoryAsync(userId);
        return Ok(history);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var order = await _orderService.GetById(id);
        if (order == null) return NotFound(new { message = "Order not found" });

        var context = HttpContext.RequestServices.GetRequiredService<GameStoreDbContext>();
        var currentUser = await context.Users.FindAsync(userId);

        var isAdmin = User.IsInRole("Admin");
        var isBuyer = order.UserId == userId;
        var isRecipient = currentUser != null &&
            !string.IsNullOrWhiteSpace(order.RecipientEmail) &&
            string.Equals(order.RecipientEmail, currentUser.Email, StringComparison.OrdinalIgnoreCase);

        // Cho phép: admin, người mua, hoặc người nhận quà (theo email)
        if (!isAdmin && !isBuyer && !isRecipient)
            return Forbid();

        // Nếu người mua xem đơn quà tặng, ẩn key để tránh lộ thông tin cho người không được phép.
        if (!isAdmin && isBuyer && !string.IsNullOrWhiteSpace(order.RecipientEmail))
        {
            foreach (var detail in order.OrderDetails)
            {
                detail.GameKeys = new List<GameKey>();
            }
        }

        return Ok(order);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateOrderDto dto)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        try
        {
            var order = await _orderService.CreateOrder(
                userId,
                dto.Items.Select(i => (i.GameId, i.Quantity)).ToList(),
                dto.PaymentMethod,   // thêm
                dto.Email,           // thêm
                dto.Phone,           // thêm
                dto.RecipientEmail   // quà tặng
            );
            return CreatedAtAction(nameof(GetById), new { id = order.Id }, order);
        }
        catch (Exception ex) { return BadRequest(new { message = ex.Message }); }
    }
    [HttpPut("{id}/cancel")]
    public async Task<IActionResult> Cancel(int id)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        try
        {
            var order = await _orderService.GetById(id);
            if (order == null) return NotFound(new { message = "Order not found" });
            if (!User.IsInRole("Admin") && order.UserId != userId)
                return Forbid();
            await _orderService.CancelOrder(id);
            return Ok(new { message = "Order cancelled" });
        }
        catch (Exception ex) { return BadRequest(new { message = ex.Message }); }
    }
}
