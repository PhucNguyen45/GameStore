// GameStore.Services/Admin/IAdminCategoryService.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameStore.DTOs.Admin;

namespace GameStore.Services.Admin;

public interface IAdminCategoryService
{
    Task<object> GetCategoriesAsync(string? keyword, string? status, bool? hasGames, int page, int pageSize);
    Task CreateCategoryAsync(CategoryDto dto);
    Task UpdateCategoryAsync(int id, CategoryDto dto);
    Task DeleteCategoryAsync(int id);
}
