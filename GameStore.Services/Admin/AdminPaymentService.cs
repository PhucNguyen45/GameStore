// GameStore.Services/Admin/AdminPaymentService.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameStore.DTOs.Admin;
using GameStore.Repository.EFCore;
using GameStore.Services.Authen;

namespace GameStore.Services.Admin;

public class AdminPaymentService : IAdminPaymentService
{
    private readonly IPaymentRepository _paymentRepo;
    private readonly IOrderRepository _orderRepo;
    private readonly IUserService _userService;
    private readonly IUserRepository _userRepo;

    public AdminPaymentService(IPaymentRepository paymentRepo, IOrderRepository orderRepo,
        IUserService userService, IUserRepository userRepo)
    {
        _paymentRepo = paymentRepo;
        _orderRepo = orderRepo;
        _userService = userService;
        _userRepo = userRepo;
    }

    public async Task<object> GetPaymentsAsync(string? keyword, string? status, string? method,
        DateTime? fromDate, DateTime? toDate, int page, int pageSize)
    {
        var (payments, totalCount) = await _paymentRepo.SearchPaymentsAsync(keyword, status, method, fromDate, toDate, page, pageSize);
        var data = payments.Select(p => new
        {
            p.Id,
            p.OrderId,
            p.Amount,
            p.PaymentMethod,
            p.Status,
            p.TransactionId,
            p.Note,
            p.PaidAt,
            p.CreatedAt,
            username = p.Order?.User?.Username,
            userId = p.Order?.UserId
        });
        return new { data, totalCount };
    }

    public async Task<object> GetOrderPaymentsAsync(int orderId)
    {
        var order = await _orderRepo.GetOrderWithDetailsAsync(orderId)
                    ?? throw new Exception("Order not found");
        var payments = await _paymentRepo.FindAsync(p => p.OrderId == orderId);
        return new
        {
            order = new
            {
                order.Id,
                order.UserId,
                username = order.User?.Username,
                order.TotalAmount,
                order.Status,
                order.PaymentMethod,
                order.OrderDate,
                items = order.OrderDetails.Select(od => new { od.Id, od.GameId, gameTitle = od.Game?.Title, od.Quantity, od.UnitPrice })
            },
            payments
        };
    }

    public async Task RefundPaymentAsync(int paymentId, RefundDto? dto)
    {
        var payment = await _paymentRepo.GetPaymentWithDetailsAsync(paymentId)
                      ?? throw new Exception("Payment not found");
        if (payment.Status == "Refunded") throw new Exception("Payment already refunded");

        var user = payment.Order.User;
        if (user != null)
        {
            user.Wallet += payment.Amount;
            await _userRepo.UpdateAsync(user);
        }
        payment.Status = "Refunded";
        payment.Note = dto?.Note ?? "Admin refund";
        payment.Order.Status = "Refunded";
        await _paymentRepo.UpdateAsync(payment);
    }
}
