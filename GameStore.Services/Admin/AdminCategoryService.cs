// GameStore.Services/Admin/AdminCategoryService.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameStore.DTOs.Admin;
using GameStore.Entities.Games;
using GameStore.Repository.EFCore;

namespace GameStore.Services.Admin;

public class AdminCategoryService : IAdminCategoryService
{
    private readonly IGenreRepository _genreRepo;

    public AdminCategoryService(IGenreRepository genreRepo) => _genreRepo = genreRepo;

    public async Task<object> GetCategoriesAsync(string? keyword, string? status, bool? hasGames, int page, int pageSize)
    {
        var (genres, totalCount) = await _genreRepo.SearchAsync(keyword, status, hasGames, page, pageSize);
        var data = new List<object>();
        foreach (var g in genres)
        {
            var gameCount = await _genreRepo.GetGameCountAsync(g.Id);
            data.Add(new
            {
                g.Id,
                g.Name,
                g.Description,
                g.IconUrl,
                g.IsActive,
                gameCount
            });
        }
        return new { data, totalCount };
    }

    public async Task CreateCategoryAsync(CategoryDto dto)
    {
        if (await _genreRepo.GetByNameAsync(dto.Name) != null)
            throw new Exception("Category name already exists");
        var genre = new Genre
        {
            Name = dto.Name,
            Description = dto.Description ?? "",
            IconUrl = dto.IconUrl ?? "",
            IsActive = dto.IsActive
        };
        await _genreRepo.AddAsync(genre);
    }

    public async Task UpdateCategoryAsync(int id, CategoryDto dto)
    {
        var genre = await _genreRepo.GetByIdAsync(id) ?? throw new Exception("Category not found");
        if (await _genreRepo.GetByNameAsync(dto.Name) != null && genre.Name != dto.Name)
            throw new Exception("Category name already exists");
        genre.Name = dto.Name;
        genre.Description = dto.Description ?? "";
        genre.IconUrl = dto.IconUrl ?? "";
        genre.IsActive = dto.IsActive;
        await _genreRepo.UpdateAsync(genre);
    }

    public async Task DeleteCategoryAsync(int id)
    {
        var genre = await _genreRepo.GetByIdAsync(id) ?? throw new Exception("Category not found");
        var gameCount = await _genreRepo.GetGameCountAsync(id);
        if (gameCount > 0)
            throw new Exception($"Cannot delete: {gameCount} games use this category");
        await _genreRepo.DeleteByIdAsync(id);
    }
}
