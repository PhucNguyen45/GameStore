    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.EntityFrameworkCore;
    using GameStore.Entities.Store;
    using GameStore.Entities.Games;
    using GameStore.Repository.EFCore;

    namespace GameStore.Services;

    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IGameRepository _gameRepository;
        private readonly IUserRepository _userRepository;
        private readonly GameStore.Repository.GameStoreDbContext _context;

        public OrderService(IOrderRepository orderRepository, IGameRepository gameRepository, IUserRepository userRepository, GameStore.Repository.GameStoreDbContext context)
        {
            _orderRepository = orderRepository;
            _gameRepository = gameRepository;
            _userRepository = userRepository;
            _context = context;
        }

        public async Task<Order?> GetById(int id) => 
            await _context.Orders
                .Include(o => o.OrderDetails)
                .ThenInclude(od => od.Game)
                .Include(o => o.OrderDetails)
                .ThenInclude(od => od.GameKeys)
                .FirstOrDefaultAsync(o => o.Id == id);
        public async Task<List<Order>> GetByUser(int userId) => await _orderRepository.GetByUserAsync(userId);
        public async Task<List<Order>> GetAll(int page, int pageSize) => (await _orderRepository.GetAllAsync()).ToList();

        public async Task<(List<Order> Items, int TotalCount)> SearchOrders(int page, int pageSize, string? keyword, DateTime? fromDate, DateTime? toDate, string? status)
        {
            var query = _context.Orders.Include(o => o.User).AsQueryable();

            if (!string.IsNullOrEmpty(keyword))
            {
                var isNumeric = int.TryParse(keyword, out int orderId);
                query = query.Where(o => o.User.Username.Contains(keyword) || (isNumeric && o.Id == orderId));
            }
            if (fromDate.HasValue)
            {
                query = query.Where(o => o.OrderDate >= fromDate.Value);
            }
            if (toDate.HasValue)
            {
                query = query.Where(o => o.OrderDate <= toDate.Value);
            }
            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(o => o.Status == status);
            }

            int totalCount = await query.CountAsync();
            var items = await query.OrderByDescending(o => o.OrderDate)
                                .Skip((page - 1) * pageSize)
                                .Take(pageSize)
                                .ToListAsync();
            return (items, totalCount);
        }

        public async Task<Order> CreateOrder(int userId, List<(int GameId, int Quantity)> items, string paymentMethod = "Wallet", string? email = null, string? phone = null)
        {
            decimal totalAmount = 0;
            var orderDetails = new List<OrderDetail>();
            var user = await _userRepository.GetByIdAsync(userId);

            // KIỂM TRA GAME ĐÃ MUA CHƯA
            foreach (var (gameId, _) in items)
            {
                var alreadyOwned = await _context.OrderDetails
                    .AnyAsync(od => od.Order.UserId == userId
                                && od.Order.Status == "Completed"
                                && od.GameId == gameId);

                if (alreadyOwned)
                {
                    var game = await _gameRepository.GetByIdAsync(gameId);
                    throw new Exception($"You already own '{game?.Title}'!");
                }
            }

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

            // 1. Kiểm tra số dư nếu dùng Wallet
            if (paymentMethod.Equals("Wallet", StringComparison.OrdinalIgnoreCase))
            {
                if (user == null || user.Wallet < totalAmount)
                    throw new Exception("Insufficient wallet balance");

                // 2. Trừ tiền
                user.Wallet -= totalAmount;
            }

            // 3. Tạo order
            var order = new Order
            {
                UserId = userId,
                TotalAmount = totalAmount,
                Status = "Pending", // Mặc định là Pending để admin duyệt
                PaymentMethod = paymentMethod,
                Email = email,
                Phone = phone,
                OrderDate = DateTime.Now,
                OrderDetails = orderDetails
            };

            _context.Orders.Add(order);

            // 4. Save tất cả trong 1 lần
            await _context.SaveChangesAsync();

            return order;
        }

        public async Task<Order> UpdateStatus(int orderId, string status)
        {
            var order = await _context.Orders
                .Include(o => o.OrderDetails)
                .ThenInclude(od => od.Game)
                .FirstOrDefaultAsync(o => o.Id == orderId);

            if (order == null) throw new Exception("Order not found");

            if (status.Equals("Completed", StringComparison.OrdinalIgnoreCase) && order.Status != "Completed")
            {
                foreach (var detail in order.OrderDetails)
                {
                    for (int i = 0; i < detail.Quantity; i++)
                    {
                        var key = await _context.GameKeys
                            .FirstOrDefaultAsync(k => k.GameId == detail.GameId && !k.IsUsed);

                        if (key == null)
                        {
                            throw new Exception($"No available keys for game: {detail.Game?.Title}");
                        }

                        key.IsUsed = true;
                        key.UsedAt = DateTime.Now;
                        key.OrderDetailId = detail.Id;
                        _context.GameKeys.Update(key);
                    }
                }
                
                // Simulating sending keys to Gmail
                Console.WriteLine($"[SIMULATION] Sending game keys to {order.Email ?? "user"} for Order #{order.Id}");
            }

            if (status.Equals("Cancelled", StringComparison.OrdinalIgnoreCase) && order.Status != "Cancelled")
            {
                var user = await _userRepository.GetByIdAsync(order.UserId);
                if (user != null && order.PaymentMethod.Equals("Wallet", StringComparison.OrdinalIgnoreCase))
                {
                    user.Wallet += order.TotalAmount;
                    _context.Users.Update(user);
                }
            }

            order.Status = status;
            _context.Orders.Update(order);
            await _context.SaveChangesAsync();
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
