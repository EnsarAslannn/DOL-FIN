using System.Net;
using System.Net.Http.Json;
using api.Dtos.Stock;
using api.IntegrationTests.TestHelpers;
using Xunit;

namespace api.IntegrationTests
{
    [Collection("Integration")]
    public class StockCachingTests
    {
        private readonly DolfinApiFactory _factory;

        public StockCachingTests(DolfinApiFactory factory)
        {
            _factory = factory;
        }

        private static CreateStockRequestDto MakeCreateDto(string symbol) =>
            new()
            {
                Symbol = symbol,
                CompanyName = "Stock Caching Test Corp",
                Purchase = 42.50m,
                LastDiv = 0.10m,
                Industry = "Software",
                MarketCap = 1_000_000_000,
            };

        [Fact]
        public async Task Update_AfterDetailWasCached_ReturnsUpdatedCompanyNameNotStaleOne()
        {
            var symbol = $"T{Guid.NewGuid():N}"[..7].ToUpperInvariant();
            var admin = await AuthHelper.CreateAuthenticatedClientAsync(_factory, asAdmin: true);

            var createResponse = await admin.PostAsJsonAsync("/api/stock", MakeCreateDto(symbol));
            var created = await createResponse.Content.ReadFromJsonAsync<StockDto>();

            // Populate the by-id cache entry.
            var beforeUpdate = await admin.GetAsync($"/api/stock/{created!.Id}");
            var beforeDto = await beforeUpdate.Content.ReadFromJsonAsync<StockDto>();
            Assert.Equal("Stock Caching Test Corp", beforeDto!.CompanyName);

            var updateDto = new UpdateStockRequestDto
            {
                Symbol = symbol,
                CompanyName = "Renamed Corp",
                Purchase = 50.00m,
                LastDiv = 0.20m,
                Industry = "Software",
                MarketCap = 2_000_000_000,
            };
            var updateResponse = await admin.PutAsJsonAsync($"/api/stock/{created.Id}", updateDto);
            Assert.Equal(HttpStatusCode.OK, updateResponse.StatusCode);

            var afterUpdate = await admin.GetAsync($"/api/stock/{created.Id}");
            var afterDto = await afterUpdate.Content.ReadFromJsonAsync<StockDto>();

            Assert.Equal("Renamed Corp", afterDto!.CompanyName);
        }

        [Fact]
        public async Task Delete_AfterDetailWasCached_ReturnsNotFoundNotStaleValue()
        {
            var symbol = $"T{Guid.NewGuid():N}"[..7].ToUpperInvariant();
            var admin = await AuthHelper.CreateAuthenticatedClientAsync(_factory, asAdmin: true);

            var createResponse = await admin.PostAsJsonAsync("/api/stock", MakeCreateDto(symbol));
            var created = await createResponse.Content.ReadFromJsonAsync<StockDto>();

            // Populate the by-id cache entry.
            await admin.GetAsync($"/api/stock/{created!.Id}");

            var deleteResponse = await admin.DeleteAsync($"/api/stock/{created.Id}");
            Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);

            var afterDelete = await admin.GetAsync($"/api/stock/{created.Id}");

            Assert.Equal(HttpStatusCode.NotFound, afterDelete.StatusCode);
        }

        [Fact]
        public async Task Create_AfterListWasCached_IsVisibleOnNextList()
        {
            var symbol = $"T{Guid.NewGuid():N}"[..7].ToUpperInvariant();
            var admin = await AuthHelper.CreateAuthenticatedClientAsync(_factory, asAdmin: true);

            // Populate the stock-list cache entry for this exact filter.
            var firstList = await admin.GetAsync($"/api/stock?symbol={symbol}");
            var firstStocks = await firstList.Content.ReadFromJsonAsync<List<StockDto>>();
            Assert.Empty(firstStocks!);

            var createResponse = await admin.PostAsJsonAsync("/api/stock", MakeCreateDto(symbol));
            Assert.Equal(HttpStatusCode.Created, createResponse.StatusCode);

            var secondList = await admin.GetAsync($"/api/stock?symbol={symbol}");
            var secondStocks = await secondList.Content.ReadFromJsonAsync<List<StockDto>>();

            Assert.Contains(secondStocks!, s => s.Symbol == symbol);
        }
    }
}
