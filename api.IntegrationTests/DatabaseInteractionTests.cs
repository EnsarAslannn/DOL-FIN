using System.Net;
using System.Net.Http.Json;
using api.Data;
using api.Dtos.Portfolio;
using api.Dtos.Stock;
using api.IntegrationTests.TestHelpers;
using api.Models;
using api.Repository;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace api.IntegrationTests
{
    [Collection("Integration")]
    public class DatabaseInteractionTests
    {
        private readonly DolfinApiFactory _factory;

        public DatabaseInteractionTests(DolfinApiFactory factory)
        {
            _factory = factory;
        }

        private static CreateStockRequestDto MakeCreateDto(string symbol) =>
            new()
            {
                Symbol = symbol,
                CompanyName = "Integration Test Corp",
                Purchase = 42.50m,
                LastDiv = 0.10m,
                Industry = "Software",
                MarketCap = 1_000_000_000,
            };

        [Fact]
        public async Task CreateStock_ViaApi_IsImmediatelyVisibleToADirectDbQuery()
        {
            var symbol = $"T{Guid.NewGuid():N}"[..7].ToUpperInvariant();
            var client = await AuthHelper.CreateAuthenticatedClientAsync(_factory, asAdmin: true);

            var createResponse = await client.PostAsJsonAsync("/api/stock", MakeCreateDto(symbol));
            Assert.Equal(HttpStatusCode.Created, createResponse.StatusCode);

            using var scope = _factory.Services.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<ApplicationDBContext>();
            var stored = await db.Stock.FirstOrDefaultAsync(s => s.Symbol == symbol);

            Assert.NotNull(stored);
        }

        [Fact]
        public async Task DeleteStock_CascadesToRemoveThePortfolioPositionHoldingIt()
        {
            var symbol = $"T{Guid.NewGuid():N}"[..7].ToUpperInvariant();
            var adminClient = await AuthHelper.CreateAuthenticatedClientAsync(_factory, asAdmin: true);
            var createResponse = await adminClient.PostAsJsonAsync("/api/stock", MakeCreateDto(symbol));
            var stock = await createResponse.Content.ReadFromJsonAsync<StockDto>();

            var traderClient = await AuthHelper.CreateAuthenticatedClientAsync(_factory);
            await traderClient.PostAsJsonAsync(
                "/api/portfolio/deposit",
                new AmountRequestDto { Amount = 1000m }
            );
            var buyResponse = await traderClient.PostAsJsonAsync(
                "/api/portfolio",
                new TradeRequestDto { Symbol = symbol, Quantity = 1 }
            );
            Assert.Equal(HttpStatusCode.OK, buyResponse.StatusCode);

            var deleteResponse = await adminClient.DeleteAsync($"/api/stock/{stock!.Id}");
            Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);

            using var scope = _factory.Services.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<ApplicationDBContext>();
            var orphanedPosition = await db.Portfolios.FirstOrDefaultAsync(p => p.StockId == stock.Id);

            Assert.Null(orphanedPosition);
        }

        [Fact]
        public async Task StockRepository_CreateAsync_DuplicateSymbol_ViolatesDatabaseUniqueConstraint()
        {
            var symbol = $"T{Guid.NewGuid():N}"[..7].ToUpperInvariant();

            using var firstScope = _factory.Services.CreateScope();
            var firstRepo = firstScope.ServiceProvider.GetRequiredService<StockRepository>();
            await firstRepo.CreateAsync(
                new Stock
                {
                    Symbol = symbol,
                    CompanyName = "First",
                    Purchase = 10m,
                    LastDiv = 0.1m,
                    Industry = "Software",
                    MarketCap = 1,
                }
            );

            using var secondScope = _factory.Services.CreateScope();
            var secondRepo = secondScope.ServiceProvider.GetRequiredService<StockRepository>();

            await Assert.ThrowsAsync<DbUpdateException>(
                () =>
                    secondRepo.CreateAsync(
                        new Stock
                        {
                            Symbol = symbol,
                            CompanyName = "Second",
                            Purchase = 20m,
                            LastDiv = 0.2m,
                            Industry = "Software",
                            MarketCap = 2,
                        }
                    )
            );
        }
    }
}
