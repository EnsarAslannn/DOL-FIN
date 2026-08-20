using api.Interfaces;
using api.Models;
using api.Service;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace api.Tests.Service
{
    public class CacheWarmingServiceTests
    {
        [Fact]
        public async Task WarmAsync_CallsGetMarketTrendsOnceToPopulateCache()
        {
            var stockRepo = new Mock<IStockRepository>();
            stockRepo.Setup(r => r.GetMarketTrendsAsync()).ReturnsAsync(new List<Stock>());
            var service = new CacheWarmingService(
                stockRepo.Object,
                new Mock<ILogger<CacheWarmingService>>().Object
            );

            await service.WarmAsync();

            stockRepo.Verify(r => r.GetMarketTrendsAsync(), Times.Once);
        }

        [Fact]
        public async Task WarmAsync_WhenRepositoryThrows_SwallowsExceptionSoStartupIsNotBlocked()
        {
            var stockRepo = new Mock<IStockRepository>();
            stockRepo
                .Setup(r => r.GetMarketTrendsAsync())
                .ThrowsAsync(new InvalidOperationException("Redis unavailable"));
            var service = new CacheWarmingService(
                stockRepo.Object,
                new Mock<ILogger<CacheWarmingService>>().Object
            );

            var exception = await Record.ExceptionAsync(() => service.WarmAsync());

            Assert.Null(exception);
        }
    }
}
