using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GameStore.DTOs.Common;

public class ApiResponse<T>
{
    public T? Data { get; set; }
    public int? TotalCount { get; set; }
    public string? Message { get; set; }
}
