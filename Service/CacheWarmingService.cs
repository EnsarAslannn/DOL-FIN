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
                await _stockRepo.GetMarketTrendsAsync();
                _logger.LogInformation("Cache warming completed: stock trends");
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Cache warming failed; continuing startup");
            }
        }
    }
}
