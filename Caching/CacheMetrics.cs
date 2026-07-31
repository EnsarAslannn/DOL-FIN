using System.Collections.Concurrent;

namespace api.Caching
{
    // Registered as a singleton in DI (see Program.cs) rather than exposed as
    // static state -- a static ConcurrentDictionary would be shared process-
    // wide with no way to isolate it between tests or reason about its
    // lifetime, for no benefit over a singleton service that's just as cheap
    // to inject everywhere it's needed.
    public sealed class CacheMetrics : ICacheMetrics
    {
        private sealed class Counters
        {
            private long _hits;
            private long _misses;

            public void IncrementHit() => Interlocked.Increment(ref _hits);

            public void IncrementMiss() => Interlocked.Increment(ref _misses);

            public CacheKeyStats ToStats() =>
                new(Interlocked.Read(ref _hits), Interlocked.Read(ref _misses));
        }

        private readonly ConcurrentDictionary<string, Counters> _stats = new();

        public void RecordHit(string key) => _stats.GetOrAdd(key, _ => new Counters()).IncrementHit();

        public void RecordMiss(string key) => _stats.GetOrAdd(key, _ => new Counters()).IncrementMiss();

        public IReadOnlyDictionary<string, CacheKeyStats> GetSnapshot() =>
            _stats.ToDictionary(kv => kv.Key, kv => kv.Value.ToStats());
    }
}
