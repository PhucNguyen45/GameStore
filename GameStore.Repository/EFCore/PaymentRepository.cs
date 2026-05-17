// GameStore.Repository/EFCore/PaymentRepository.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using GameStore.Entities.Store;

namespace GameStore.Repository.EFCore;

public class PaymentRepository : Repository<Payment>, IPaymentRepository
{
    public PaymentRepository(GameStoreDbContext context) : base(context) { }

    public async Task<(List<Payment> Payments, int TotalCount)> SearchPaymentsAsync(
        string? keyword, string? status, string? method,
        DateTime? fromDate, DateTime? toDate, int page, int pageSize)
    {
        var query = _dbSet.Include(p => p.Order).ThenInclude(o => o.User).AsQueryable();

        if (!string.IsNullOrEmpty(keyword))
        {
            var isNumeric = int.TryParse(keyword, out int searchId);
            query = query.Where(p => (isNumeric && (p.Id == searchId || p.OrderId == searchId)) ||
                                     (p.TransactionId != null && p.TransactionId.Contains(keyword)) ||
                                     p.Order.User.Username.Contains(keyword));
        }
        if (!string.IsNullOrEmpty(status))
            query = query.Where(p => p.Status == status);
        if (!string.IsNullOrEmpty(method))
            query = query.Where(p => p.PaymentMethod == method);
        if (fromDate.HasValue)
            query = query.Where(p => p.PaidAt >= fromDate.Value);
        if (toDate.HasValue)
            query = query.Where(p => p.PaidAt <= toDate.Value);

        int totalCount = await query.CountAsync();
        var payments = await query.OrderByDescending(p => p.PaidAt)
                                  .Skip((page - 1) * pageSize)
                                  .Take(pageSize)
                                  .ToListAsync();
        return (payments, totalCount);
    }

    public async Task<Payment?> GetPaymentWithDetailsAsync(int paymentId) =>
        await _dbSet.Include(p => p.Order).ThenInclude(o => o.User)
                    .FirstOrDefaultAsync(p => p.Id == paymentId);
}
