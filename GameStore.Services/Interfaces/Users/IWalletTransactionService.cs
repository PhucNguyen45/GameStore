// GameStore.Services/User/IWalletTransactionService.cs
using System.Collections.Generic;
using System.Threading.Tasks;
using GameStore.DTOs.User.Wallet;

namespace GameStore.Services.Interfaces.Users
{
    public interface IWalletTransactionService
    {
        Task<IEnumerable<WalletTransactionDto>> GetUserTransactionsAsync(int userId, int page = 1, int pageSize = 20);
        Task LogTransactionAsync(int userId, long amount, long balanceBefore, long balanceAfter, string type, string? description = null, int? orderId = null);
    }
}
