// GameStore.DTOs/Users/TopUpRequest.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GameStore.DTOs.Users;

public class TopUpRequest
{
    /// <summary>Số tiền nạp (VND)</summary>
    public long Amount { get; set; }
}
