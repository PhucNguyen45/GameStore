// GameStore.Services/Admin/AdminPaymentService.cs
using System.Threading.Tasks;
using GameStore.DTOs.Admin;

namespace GameStore.Services.Admin;

public interface IAdminPaymentService
{
    Task<object> GetPaymentsAsync(string? keyword, string? status, string? method,
        DateTime? fromDate, DateTime? toDate, int page, int pageSize);
    Task<object> GetOrderPaymentsAsync(int orderId);
    Task RefundPaymentAsync(int paymentId, RefundDto? dto);
}
