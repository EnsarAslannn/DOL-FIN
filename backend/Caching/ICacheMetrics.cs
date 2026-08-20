namespace api.Caching
{
    public sealed record CacheKeyStats(long Hits, long Misses)
    {
        public double HitRate => Hits + Misses > 0 ? (double)Hits / (Hits + Misses) : 0;
    }

    public interface ICacheMetrics
    {
        void RecordHit(string key);

        void RecordMiss(string key);

        IReadOnlyDictionary<string, CacheKeyStats> GetSnapshot();
    }
}
