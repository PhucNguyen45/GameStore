// GameStore.DTOs/Common/PaginationHelper.cs
namespace GameStore.DTOs.Common;

public static class PaginationHelper
{
    public const int MaxPageSize = 100;

    /// <summary>
    /// Validates and clamps pagination parameters to safe values.
    /// page sẽ được clamp về tối thiểu 1, pageSize sẽ được clamp trong khoảng 1-MaxPageSize.
    /// </summary>
    public static (int Page, int PageSize) Validate(int page, int pageSize)
    {
        return (
            Math.Max(1, page),
            Math.Clamp(pageSize, 1, MaxPageSize)
        );
    }
}
