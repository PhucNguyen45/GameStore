// GameStore.DTOs/Common/PagedResponse.cs
namespace GameStore.DTOs.Common;

public class PagedResponse<T>
{
    public List<T> Data { get; set; } = new();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / Math.Max(1, PageSize));

    public PagedResponse() { }

    public PagedResponse(IEnumerable<T> data, int totalCount, int page, int pageSize)
    {
        Data = data.ToList();
        TotalCount = totalCount;
        Page = page;
        PageSize = pageSize;
    }

    public static PagedResponse<T> Create(IEnumerable<T> data, int totalCount, int page, int pageSize)
    {
        var (validPage, validPageSize) = PaginationHelper.Validate(page, pageSize);
        return new(data, totalCount, validPage, validPageSize);
    }
}
