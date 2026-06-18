// GameStore.Entities/Store/WalletTransaction.cs
using System;
using GameStore.Entities.Users;

namespace GameStore.Entities.Store
{
    public class WalletTransaction
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        /// <summary>Số tiền biến động (VND): dương = nạp/hoàn, âm = chi tiêu</summary>
        public long Amount { get; set; }
        /// <summary>Số dư ví trước giao dịch (VND)</summary>
        public long BalanceBefore { get; set; }
        /// <summary>Số dư ví sau giao dịch (VND)</summary>
        public long BalanceAfter { get; set; }
        public string Type { get; set; } = string.Empty; // TopUp, Purchase, Refund, AdminAdjust
        public string? Description { get; set; }  // e.g. "Nạp ví", "Thanh toán đơn #5", "Admin hoàn tiền"
        public int? OrderId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public virtual User User { get; set; } = null!;
    }
}
