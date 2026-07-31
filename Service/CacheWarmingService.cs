using api.Interfaces;

namespace api.Service
{
    public class CacheWarmingService : ICacheWarmingService
    {
        private readonly IStockRepository _stockRepo;
        private readonly ILogger<CacheWarmingService> _logger;

        public CacheWarmingService(IStockRepository stockRepo, ILogger<CacheWarmingService> logger)
        {
            _stockRepo = stockRepo;
            _logger = logger;
        }

        public async Task WarmAsync()
        {
            try
            {
                // Market trends is a single, fixed cache key hit by every
                // client on load (see StockController.GetMarketTrends) -- the
                // one genuinely worth pre-populating. The paginated stock list
                // has no equivalent: every filter/sort/page combination gets
                // its own cache entry (see CacheKeys.StockList), so there's no
                // single "warm the list" call that would help most requests.
                await _stockRepo.GetMarketTrendsAsync();
                _logger.LogInformation("Cache warming completed: stock trends");
            }
            catch (Exception ex)
            {
                // Warming is an optimization, not a startup requirement -- a
                // failure here (Redis down, DB not yet reachable) must not
                // prevent the app from starting.
                _logger.LogWarning(ex, "Cache warming failed; continuing startup");
            }
        }
    }
}
