// GameStore.DTOs/Orders/OrderHistoryDto.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
namespace GameStore.DTOs.Orders;

public class OrderHistoryDto
{
    public int Id { get; set; }
    public DateTime OrderDate { get; set; }
    /// <summary>Tổng tiền đơn hàng (VND)</summary>
    public long TotalAmount { get; set; }
    public string Status { get; set; } = string.Empty;
    public string PaymentMethod { get; set; } = string.Empty;
    public List<OrderHistoryItemDto> Items { get; set; } = new();
}

public class OrderHistoryItemDto
{
    public int GameId { get; set; }
    public string GameTitle { get; set; } = string.Empty;
    public int Quantity { get; set; }
    /// <summary>Đơn giá (VND)</summary>
    public long UnitPrice { get; set; }
}
