using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using api.Caching;
using api.Dtos.Stock;
using api.IntegrationTests.TestHelpers;
using Xunit;

namespace api.IntegrationTests
{
    [Collection("Integration")]
    public class DiagnosticsEndpointsTests
    {
        private readonly DolfinApiFactory _factory;

        public DiagnosticsEndpointsTests(DolfinApiFactory factory)
        {
            _factory = factory;
        }

        [Fact]
        public async Task GetCacheMetrics_NonAdmin_ReturnsForbidden()
        {
            var client = await AuthHelper.CreateAuthenticatedClientAsync(_factory);

            var response = await client.GetAsync("/api/diagnostics/cache-metrics");

            Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
        }

        [Fact]
        public async Task GetCacheMetrics_Admin_RecordsHitsForRepeatedStockLookup()
        {
            var symbol = $"T{Guid.NewGuid():N}"[..7].ToUpperInvariant();
            var admin = await AuthHelper.CreateAuthenticatedClientAsync(_factory, asAdmin: true);

            var createResponse = await admin.PostAsJsonAsync(
                "/api/stock",
                new CreateStockRequestDto
                {
                    Symbol = symbol,
                    CompanyName = "Cache Metrics Test Corp",
                    Purchase = 42.50m,
                    LastDiv = 0.10m,
                    Industry = "Software",
                    MarketCap = 1_000_000_000,
                }
            );
            var stock = await createResponse.Content.ReadFromJsonAsync<StockDto>();

            await admin.GetAsync($"/api/stock/{stock!.Id}");
            await admin.GetAsync($"/api/stock/{stock.Id}");

            var metricsResponse = await admin.GetAsync("/api/diagnostics/cache-metrics");
            Assert.Equal(HttpStatusCode.OK, metricsResponse.StatusCode);

            var snapshot = await metricsResponse.Content.ReadFromJsonAsync<
                Dictionary<string, CacheKeyStats>
            >(new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            var stockKey = $"stock:id:{stock.Id}";
            Assert.True(snapshot!.ContainsKey(stockKey), $"Expected a cache-metrics entry for '{stockKey}'.");
            Assert.True(snapshot[stockKey].Hits >= 1, "Expected at least one recorded cache hit.");
        }

        [Fact]
        public async Task GetRedisInfo_NonAdmin_ReturnsForbidden()
        {
            var client = await AuthHelper.CreateAuthenticatedClientAsync(_factory);

            var response = await client.GetAsync("/api/diagnostics/redis-info");

            Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
        }

        [Fact]
        public async Task GetRedisInfo_Admin_ReportsConfiguredAgainstRealRedis()
        {
            var admin = await AuthHelper.CreateAuthenticatedClientAsync(_factory, asAdmin: true);

            var response = await admin.GetAsync("/api/diagnostics/redis-info");

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            using var document = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
            Assert.True(document.RootElement.GetProperty("configured").GetBoolean());
        }
    }
}
