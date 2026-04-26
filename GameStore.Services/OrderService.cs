using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameStore.Entities.Store;
using GameStore.Entities.Games;
using GameStore.Repository.EFCore;

namespace GameStore.Services;

public class OrderService : IOrderService
{
    private readonly IOrderRepository _orderRepository;
    private readonly IGameRepository _gameRepository;
    private readonly IUserRepository _userRepository;

    public OrderService(IOrderRepository orderRepository, IGameRepository gameRepository, IUserRepository userRepository)
    {
        _orderRepository = orderRepository;
        _gameRepository = gameRepository;
        _userRepository = userRepository;
    }

    public async Task<Order?> GetById(int id) => await _orderRepository.GetByIdAsync(id);
    public async Task<List<Order>> GetByUser(int userId) => await _orderRepository.GetByUserAsync(userId);
    public async Task<List<Order>> GetAll(int page, int pageSize) => (await _orderRepository.GetAllAsync()).ToList();

    public async Task<Order> CreateOrder(int userId, List<(int GameId, int Quantity)> items)
    {
        decimal totalAmount = 0;
        var orderDetails = new List<OrderDetail>();
        var user = await _userRepository.GetByIdAsync(userId);

        foreach (var (gameId, quantity) in items)
        {
            var game = await _gameRepository.GetByIdAsync(gameId);
            if (game == null) throw new Exception($"Game {gameId} not found");

            var price = game.DiscountPrice ?? game.Price;
            totalAmount += price * quantity;

            orderDetails.Add(new OrderDetail
            {
                GameId = gameId,
                Quantity = quantity,
                UnitPrice = price
            });
        }

        if (user == null || user.Wallet < totalAmount)
            throw new Exception("Insufficient wallet balance");

        user.Wallet -= totalAmount;
        await _userRepository.UpdateAsync(user);

        var order = new Order
        {
            UserId = userId,
            TotalAmount = totalAmount,
            Status = "Pending",
            OrderDate = DateTime.Now
        };

        await _orderRepository.AddAsync(order);

        foreach (var detail in orderDetails)
        {
            detail.OrderId = order.Id;
        }

        return order;
    }

    public async Task<Order> UpdateStatus(int orderId, string status)
    {
        var order = await _orderRepository.GetByIdAsync(orderId);
        if (order == null) throw new Exception("Order not found");
        order.Status = status;
        await _orderRepository.UpdateAsync(order);
        return order;
    }

    public async Task CancelOrder(int orderId)
    {
        var order = await _orderRepository.GetByIdAsync(orderId);
        if (order == null) throw new Exception("Order not found");
        if (order.Status == "Completed") throw new Exception("Cannot cancel completed order");

        var user = await _userRepository.GetByIdAsync(order.UserId);
        if (user != null) { user.Wallet += order.TotalAmount; await _userRepository.UpdateAsync(user); }
        order.Status = "Cancelled";
        await _orderRepository.UpdateAsync(order);
    }
}
