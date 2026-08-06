using Microsoft.Extensions.Caching.Hybrid;

namespace api.Caching
{
    public static class HybridCacheMetricsExtensions
    {
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
