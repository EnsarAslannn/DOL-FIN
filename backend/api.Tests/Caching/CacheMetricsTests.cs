using api.Caching;
using Xunit;

namespace api.Tests.Caching
{
    public class CacheMetricsTests
    {
        [Fact]
        public void GetSnapshot_NoActivity_ReturnsEmpty()
        {
            var metrics = new CacheMetrics();

            Assert.Empty(metrics.GetSnapshot());
        }

        [Fact]
        public void RecordHit_IncrementsHitsForThatKeyOnly()
        {
            var metrics = new CacheMetrics();

            metrics.RecordHit("stock:id:1");
            metrics.RecordHit("stock:id:1");
            metrics.RecordHit("stock:id:2");

            var snapshot = metrics.GetSnapshot();

            Assert.Equal(2, snapshot["stock:id:1"].Hits);
            Assert.Equal(0, snapshot["stock:id:1"].Misses);
            Assert.Equal(1, snapshot["stock:id:2"].Hits);
        }

        [Fact]
        public void RecordMiss_IncrementsMissesForThatKey()
        {
            var metrics = new CacheMetrics();

            metrics.RecordMiss("stock:trends");

            var snapshot = metrics.GetSnapshot();

            Assert.Equal(0, snapshot["stock:trends"].Hits);
            Assert.Equal(1, snapshot["stock:trends"].Misses);
        }

        [Theory]
        [InlineData(9, 1, 0.9)]
        [InlineData(1, 1, 0.5)]
        [InlineData(0, 5, 0.0)]
        public void HitRate_ComputesFromHitsAndMisses(int hits, int misses, double expectedRate)
        {
            var metrics = new CacheMetrics();

            for (var i = 0; i < hits; i++)
                metrics.RecordHit("key");
            for (var i = 0; i < misses; i++)
                metrics.RecordMiss("key");

            Assert.Equal(expectedRate, metrics.GetSnapshot()["key"].HitRate, precision: 5);
        }

        [Fact]
        public void HitRate_NoActivityForKey_IsZeroNotNaN()
        {
            var stats = new CacheKeyStats(0, 0);

            Assert.Equal(0, stats.HitRate);
        }

        [Fact]
        public async Task RecordHit_IsThreadSafeUnderConcurrentAccess()
        {
            var metrics = new CacheMetrics();

            var tasks = Enumerable
                .Range(0, 100)
                .Select(_ => Task.Run(() => metrics.RecordHit("shared-key")))
                .ToArray();
            await Task.WhenAll(tasks);

            Assert.Equal(100, metrics.GetSnapshot()["shared-key"].Hits);
        }
    }
}
