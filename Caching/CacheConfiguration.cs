using Microsoft.Extensions.Caching.Hybrid;

namespace api.Caching
{
    public static class CacheConfiguration
    {
        private static readonly TimeSpan LocalCacheExpiry = TimeSpan.FromSeconds(30);

        public static readonly HybridCacheEntryOptions StockList = new()
        {
            Expiration = TimeSpan.FromSeconds(60),
            LocalCacheExpiration = LocalCacheExpiry,
        };

        public static readonly HybridCacheEntryOptions StockDetail = new()
        {
            Expiration = TimeSpan.FromMinutes(5),
            LocalCacheExpiration = LocalCacheExpiry,
        };

        public static readonly HybridCacheEntryOptions StockTrends = new()
        {
            Expiration = TimeSpan.FromMinutes(10),
            LocalCacheExpiration = LocalCacheExpiry,
        };

        public static readonly HybridCacheEntryOptions CommentList = new()
        {
            Expiration = TimeSpan.FromSeconds(60),
            LocalCacheExpiration = LocalCacheExpiry,
        };

        public static readonly HybridCacheEntryOptions CommentDetail = new()
        {
            Expiration = TimeSpan.FromMinutes(5),
            LocalCacheExpiration = LocalCacheExpiry,
        };

        public static readonly HybridCacheEntryOptions Portfolio = new()
        {
            Expiration = TimeSpan.FromMinutes(5),
            LocalCacheExpiration = LocalCacheExpiry,
        };
    }
}
