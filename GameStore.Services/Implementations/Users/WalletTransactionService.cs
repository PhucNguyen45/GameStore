// GameStore.Services/User/WalletTransactionService.cs
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using GameStore.DTOs.User.Wallet;
using GameStore.Entities.Store;
using GameStore.Repository;
using GameStore.Services.Interfaces.Users;

namespace GameStore.Services.Implementations.Users
{
    public class WalletTransactionService : IWalletTransactionService
    {
        private readonly GameStoreDbContext _context;

        public WalletTransactionService(GameStoreDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<WalletTransactionDto>> GetUserTransactionsAsync(int userId, int page = 1, int pageSize = 20)
        {
            return await _context.WalletTransactions
                .Where(wt => wt.UserId == userId)
                .OrderByDescending(wt => wt.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(wt => new WalletTransactionDto
                {
                    Id = wt.Id,
                    Amount = wt.Amount,
                    BalanceBefore = wt.BalanceBefore,
                    BalanceAfter = wt.BalanceAfter,
                    Type = wt.Type,
                    Description = wt.Description,
                    OrderId = wt.OrderId,
                    CreatedAt = wt.CreatedAt
                })
                .ToListAsync();
        }

        public async Task LogTransactionAsync(int userId, long amount, long balanceBefore, long balanceAfter, string type, string? description = null, int? orderId = null)
        {
            _context.WalletTransactions.Add(new WalletTransaction
            {
                UserId = userId,
                Amount = amount,
                BalanceBefore = balanceBefore,
                BalanceAfter = balanceAfter,
                Type = type,
                Description = description,
                OrderId = orderId,
                CreatedAt = System.DateTime.UtcNow
            });
            await _context.SaveChangesAsync();
        }
    }
}
