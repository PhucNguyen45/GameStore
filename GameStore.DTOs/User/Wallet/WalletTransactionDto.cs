// GameStore.DTOs/User/Wallet/WalletTransactionDto.cs
using System;

namespace GameStore.DTOs.User.Wallet
{
    public class WalletTransactionDto
    {
        public int Id { get; set; }
        /// <summary>Số tiền biến động (VND): dương = nạp/hoàn, âm = chi tiêu</summary>
        public long Amount { get; set; }
        /// <summary>Số dư trước giao dịch (VND)</summary>
        public long BalanceBefore { get; set; }
        /// <summary>Số dư sau giao dịch (VND)</summary>
        public long BalanceAfter { get; set; }
        public string Type { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int? OrderId { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
