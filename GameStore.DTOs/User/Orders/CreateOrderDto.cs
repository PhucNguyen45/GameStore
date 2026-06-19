// GameStore.DTOs/Orders/CreateOrderDto.cs
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace GameStore.DTOs.Orders;

public class CreateOrderDto
{
    public List<OrderItemDto> Items { get; set; } = new();
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string PaymentMethod { get; set; } = "Wallet";
    [EmailAddress]
    public string? RecipientEmail { get; set; } // Email người nhận nếu mua tặng
}

public class OrderItemDto
{
    public int GameId { get; set; }
    public int Quantity { get; set; } = 1;
}
