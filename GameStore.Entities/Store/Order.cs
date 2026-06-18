// GameStore.Entities/Store/Order.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameStore.Entities.Users;

namespace GameStore.Entities.Store;

public class Order
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public DateTime OrderDate { get; set; } = DateTime.UtcNow;        /// <summary>Tổng tiền đơn hàng (VND)</summary>
        public long TotalAmount { get; set; }
    public string Status { get; set; } = "Pending"; // Pending, Completed, Cancelled, Refunded
    public string? Email { get; set; }          // thêm
    public string? Phone { get; set; }          // thêm
    public string PaymentMethod { get; set; } = "Wallet"; // thêm (đã có default)

    public virtual User User { get; set; } = null!;
    public virtual ICollection<OrderDetail> OrderDetails { get; set; } = new HashSet<OrderDetail>();
}
