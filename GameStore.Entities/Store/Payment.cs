using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GameStore.Entities.Store
{
    public class Payment
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public decimal Amount { get; set; }
        public string PaymentMethod { get; set; } = "Wallet"; // Wallet, CreditCard, PayPal
        public string Status { get; set; } = "Completed"; // Completed, Failed, Refunded, Pending
        public string? TransactionId { get; set; }
        public string? Note { get; set; }
        public DateTime PaidAt { get; set; } = DateTime.Now;
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public virtual Order Order { get; set; } = null!;
    }
}
