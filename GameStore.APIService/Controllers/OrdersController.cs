// GameStore.APIService/Controllers/OrdersController.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using GameStore.Services;
using System.Security.Claims;

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

    [HttpGet("all")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20) =>
        Ok(await _orderService.GetAll(page, pageSize));

    [HttpGet("search")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> SearchOrders(
        [FromQuery] int page = 1, [FromQuery] int pageSize = 10,
        [FromQuery] string? keyword = null, [FromQuery] DateTime? fromDate = null,
        [FromQuery] DateTime? toDate = null, [FromQuery] string? status = null)
    {
        var result = await _orderService.SearchOrders(page, pageSize, keyword, fromDate, toDate, status);
        return Ok(new { data = result.Items.Select(o => new { o.Id, o.UserId, o.OrderDate, o.TotalAmount, o.Status, o.PaymentMethod, Username = o.User?.Username }), totalCount = result.TotalCount });
    }

    [HttpPut("{id}/status")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateStatusDto dto)
    {
        try { await _orderService.UpdateStatus(id, dto.Status); return Ok(new { message = "Status updated" }); }
        catch (Exception ex) { return BadRequest(new { message = ex.Message }); }
    }


    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var order = await _orderService.GetById(id);
        return order == null ? NotFound(new { message = "Order not found" }) : Ok(order);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateOrderDto dto)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        try
        {
            var order = await _orderService.CreateOrder(userId, dto.Items.Select(i => (i.GameId, i.Quantity)).ToList());
            return CreatedAtAction(nameof(GetById), new { id = order.Id }, order);
        }
        catch (Exception ex) { return BadRequest(new { message = ex.Message }); }
    }

    [HttpPut("{id}/cancel")]
    public async Task<IActionResult> Cancel(int id)
    {
        try { await _orderService.CancelOrder(id); return Ok(new { message = "Order cancelled" }); }
        catch (Exception ex) { return BadRequest(new { message = ex.Message }); }
    }
}

public class CreateOrderDto { public List<OrderItemDto> Items { get; set; } = new(); }
public class OrderItemDto { public int GameId { get; set; } public int Quantity { get; set; } = 1; }
public class UpdateStatusDto { public string Status { get; set; } = ""; }
