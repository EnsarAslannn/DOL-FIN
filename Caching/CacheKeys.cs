using api.Helpers;

namespace api.Caching
{
    /// <summary>
    /// Single source of truth for every cache key/tag this app uses. Only
    /// covers the read paths that are actually cached (see
    /// CachedStockRepository, CachedCommentRepository, PortfolioService) --
    /// there is no entry here for anything that doesn't have a real
    /// GetOrCreateAsync call behind it.
    /// </summary>
    public static class CacheKeys
    {
        // Stock
        public const string StockListTag = "stock:list";
        public const string StockTrends = "stock:trends";

        public static string StockById(int id) => $"stock:id:{id}";

        public static string StockBySymbol(string symbol) => $"stock:symbol:{symbol.Trim().ToUpperInvariant()}";

        public static string StockList(QueryObject query)
        {
            string Norm(string? value) => string.IsNullOrWhiteSpace(value) ? "_" : value.Trim().ToLowerInvariant();

            return string.Join(
                '|',
                "stock:list:" + Norm(query.Symbol),
                Norm(query.CompanyName),
                Norm(query.SortBy),
                query.IsDescending,
                query.PageNumber,
                query.PageSize
            );
        }

        // Comment
        public const string CommentListTag = "comment:list";

        public static string CommentById(int id) => $"comment:id:{id}";

        public static string CommentList(CommentQueryObject query)
        {
            string Norm(string? value) => string.IsNullOrWhiteSpace(value) ? "_" : value.Trim().ToLowerInvariant();

            return string.Join(
                '|',
                "comment:list:" + Norm(query.Symbol),
                query.IsDescending,
                query.PageNumber,
                query.PageSize
            );
        }

        // Portfolio -- one user's full set of positions, not a single
        // "portfolio" row (see Portfolio model: one row per stock held).
        public static string PortfolioByUser(string userId) => $"portfolio:user:{userId}";
    }
}
