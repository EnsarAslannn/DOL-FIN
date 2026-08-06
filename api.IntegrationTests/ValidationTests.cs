using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using api.Dtos.Account;
using api.Dtos.Portfolio;
using api.Dtos.Stock;
using api.IntegrationTests.TestHelpers;
using Xunit;

namespace api.IntegrationTests
{
    [Collection("Integration")]
    public class ValidationTests
    {
        private readonly DolfinApiFactory _factory;

        public ValidationTests(DolfinApiFactory factory)
        {
            _factory = factory;
        }

        private static JsonElement GetErrorsElement(JsonDocument document)
        {
            foreach (var property in document.RootElement.EnumerateObject())
            {
                if (string.Equals(property.Name, "errors", StringComparison.OrdinalIgnoreCase))
                {
                    return property.Value;
                }
            }

            throw new InvalidOperationException(
                $"No 'errors' property found in response body: {document.RootElement}"
            );
        }

        [Fact]
        public async Task CreateStock_EmptySymbolAndCompanyName_ReturnsBadRequestWithFieldErrors()
        {
            var client = await AuthHelper.CreateAuthenticatedClientAsync(_factory, asAdmin: true);

            var response = await client.PostAsJsonAsync(
                "/api/stock",
                new CreateStockRequestDto
                {
                    Symbol = "",
                    CompanyName = "",
                    Purchase = 42.50m,
                    LastDiv = 0.10m,
                    Industry = "Software",
                    MarketCap = 1_000_000_000,
                }
            );

            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            using var document = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
            var errors = GetErrorsElement(document);
            Assert.True(errors.TryGetProperty("Symbol", out _));
            Assert.True(errors.TryGetProperty("CompanyName", out _));
        }

        [Fact]
        public async Task CreateStock_InvalidSymbolCharacters_ReturnsBadRequest()
        {
            var client = await AuthHelper.CreateAuthenticatedClientAsync(_factory, asAdmin: true);

            var response = await client.PostAsJsonAsync(
                "/api/stock",
                new CreateStockRequestDto
                {
                    Symbol = "BAD SYMBOL!",
                    CompanyName = "Whatever Inc.",
                    Purchase = 42.50m,
                    LastDiv = 0.10m,
                    Industry = "Software",
                    MarketCap = 1_000_000_000,
                }
            );

            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task AddPortfolio_ZeroQuantity_ReturnsBadRequestWithFieldError()
        {
            var client = await AuthHelper.CreateAuthenticatedClientAsync(_factory);

            var response = await client.PostAsJsonAsync(
                "/api/portfolio",
                new TradeRequestDto { Symbol = "AAPL", Quantity = 0 }
            );

            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            using var document = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
            var errors = GetErrorsElement(document);
            Assert.True(errors.TryGetProperty("Quantity", out _));
        }

        [Fact]
        public async Task Register_EmptyUsernameAndInvalidEmail_ReturnsBadRequestWithFieldErrors()
        {
            var client = TestClientFactory.CreateHttpsClient(_factory);

            var response = await client.PostAsJsonAsync(
                "/api/account/register",
                new RegisterDto
                {
                    Username = "",
                    Email = "not-an-email",
                    Password = AuthHelper.DefaultPassword,
                }
            );

            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            using var document = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
            var errors = GetErrorsElement(document);
            Assert.True(errors.TryGetProperty("Username", out _));
            Assert.True(errors.TryGetProperty("Email", out _));
        }

        [Fact]
        public async Task GetAllStocks_PageSizeOutOfRange_ReturnsBadRequest()
        {
            var client = await AuthHelper.CreateAuthenticatedClientAsync(_factory);

            var response = await client.GetAsync("/api/stock?pageSize=0");

            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }
    }
}
