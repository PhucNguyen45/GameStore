// GameStore.Repository/EFCore/IPaymentRepository.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameStore.Entities.Store;

namespace GameStore.Repository.EFCore;

public interface IPaymentRepository : IRepository<Payment>
{
    Task<(List<Payment> Payments, int TotalCount)> SearchPaymentsAsync(
        string? keyword, string? status, string? method,
        DateTime? fromDate, DateTime? toDate, int page, int pageSize);
    Task<Payment?> GetPaymentWithDetailsAsync(int paymentId);
}
