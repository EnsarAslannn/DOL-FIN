using Microsoft.Extensions.Caching.Hybrid;

namespace api.Caching
{
    public static class HybridCacheMetricsExtensions
    {
        // HybridCache.GetOrCreateAsync doesn't tell the caller whether it hit
        // or missed -- the factory only runs on a miss, so a flag set inside
        // it is the cleanest way to observe that without fighting the
        // library's API or duplicating its request-coalescing logic (see the
        // note on GetOrCreateAsync in CachedStockRepository/PortfolioService:
        // that coalescing is HybridCache's own built-in stampede protection,
        // not something this app reimplements).
        public static async ValueTask<T> GetOrCreateWithMetricsAsync<T>(
            this HybridCache cache,
            ICacheMetrics metrics,
            string key,
            Func<CancellationToken, ValueTask<T>> factory,
            HybridCacheEntryOptions? options = null,
            IEnumerable<string>? tags = null,
            CancellationToken cancellationToken = default
        )
        {
            var wasMiss = false;

            var result = await cache.GetOrCreateAsync(
                key,
                async ct =>
                {
                    wasMiss = true;
                    return await factory(ct);
                },
                options,
                tags,
                cancellationToken
            );

            if (wasMiss)
            {
                metrics.RecordMiss(key);
            }
            else
            {
                metrics.RecordHit(key);
            }

            return result;
        }
    }
}
