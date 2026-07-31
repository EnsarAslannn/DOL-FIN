using Microsoft.Extensions.Caching.Hybrid;

namespace api.Caching
{
    /// <summary>
    /// TTLs by data-freshness requirement, centralized so the same tradeoff
    /// isn't re-decided (and re-typed) at every call site. The 30-second
    /// LocalCacheExpiration is shared everywhere: it's the in-process L1 tier
    /// (HybridCache's own memory cache), which should always be short
    /// relative to the Redis L2 TTL below it -- it exists to absorb bursts
    /// within a single request wave, not to serve genuinely stale data.
    /// </summary>
    public static class CacheConfiguration
    {
        private static readonly TimeSpan LocalCacheExpiry = TimeSpan.FromSeconds(30);

        // Stock list: paginated/filtered, so a write anywhere invalidates
        // every cached page via StockListTag rather than one key -- a
        // shorter TTL here bounds how long a stale page can linger between
        // writes on cache paths that Redis's tag-based removal doesn't reach.
        public static readonly HybridCacheEntryOptions StockList = new()
        {
            Expiration = TimeSpan.FromSeconds(60),
            LocalCacheExpiration = LocalCacheExpiry,
        };

        // Single stock lookups (by id/symbol): explicitly invalidated on
        // every create/update/delete (see CachedStockRepository), so the TTL
        // is just a backstop, not the primary freshness mechanism.
        public static readonly HybridCacheEntryOptions StockDetail = new()
        {
            Expiration = TimeSpan.FromMinutes(5),
            LocalCacheExpiration = LocalCacheExpiry,
        };

        // Market trends: a fixed, well-known symbol list (see
        // StockRepository.GetMarketTrendsAsync) that every client hits on
        // load -- the longest TTL here because it's both the cheapest to
        // keep briefly stale and the hottest read in the app.
        public static readonly HybridCacheEntryOptions StockTrends = new()
        {
            Expiration = TimeSpan.FromMinutes(10),
            LocalCacheExpiration = LocalCacheExpiry,
        };

        // Comment list/detail: user-generated, can change at any time, so
        // this stays short -- it exists to absorb repeated reads of the same
        // stock's comment thread, not to hide genuine staleness.
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

        // A user's full position list: invalidated on every buy/sell/
        // deposit/withdraw (see PortfolioService), so this is also just a
        // backstop TTL rather than the thing keeping it fresh.
        public static readonly HybridCacheEntryOptions Portfolio = new()
        {
            Expiration = TimeSpan.FromMinutes(5),
            LocalCacheExpiration = LocalCacheExpiry,
        };
    }
}
