using System.Net;
using System.Net.Http.Json;
using api.Dtos;
using api.Dtos.Portfolio;
using api.IntegrationTests.TestHelpers;
using Xunit;

namespace api.IntegrationTests
{
    [Collection("Integration")]
    public class PortfolioEndpointsTests
    {
        private readonly DolfinApiFactory _factory;

        public PortfolioEndpointsTests(DolfinApiFactory factory)
        {
            _factory = factory;
        }

        [Fact]
        public async Task GetUserPortfolio_NewUser_ReturnsEmptyList()
        {
            var client = await AuthHelper.CreateAuthenticatedClientAsync(_factory);

            var response = await client.GetAsync("/api/portfolio");

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            var portfolio = await response.Content.ReadFromJsonAsync<List<PortfolioDto>>();
            Assert.NotNull(portfolio);
            Assert.Empty(portfolio!);
        }

        [Fact]
        public async Task AddPortfolio_AfterDeposit_CreatesPositionVisibleInGetPortfolio()
        {
            var client = await AuthHelper.CreateAuthenticatedClientAsync(_factory);

            var depositResponse = await client.PostAsJsonAsync(
                "/api/portfolio/deposit",
                new AmountRequestDto { Amount = 1000m }
            );
            Assert.Equal(HttpStatusCode.OK, depositResponse.StatusCode);

            var buyResponse = await client.PostAsJsonAsync(
                "/api/portfolio",
                new TradeRequestDto { Symbol = "AAPL", Quantity = 2 }
            );
            Assert.Equal(HttpStatusCode.OK, buyResponse.StatusCode);

            var portfolioResponse = await client.GetAsync("/api/portfolio");
            var portfolio = await portfolioResponse.Content.ReadFromJsonAsync<List<PortfolioDto>>();

            var position = Assert.Single(portfolio!, p => p.Symbol == "AAPL");
            Assert.Equal(2, position.Quantity);
        }

        [Fact]
        public async Task AddPortfolio_WithoutFunds_ReturnsBadRequest()
        {
            var client = await AuthHelper.CreateAuthenticatedClientAsync(_factory);

            var response = await client.PostAsJsonAsync(
                "/api/portfolio",
                new TradeRequestDto { Symbol = "AAPL", Quantity = 1 }
            );

            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }
    }
}
