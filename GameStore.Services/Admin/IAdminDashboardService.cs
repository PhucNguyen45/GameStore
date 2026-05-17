// GameStore.Services/Admin/IAdminDashboardService.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
namespace GameStore.Services.Admin;

public interface IAdminDashboardService
{
    Task<object> GetDashboardAsync();
}
