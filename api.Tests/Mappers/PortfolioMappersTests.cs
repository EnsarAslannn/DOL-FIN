using api.Mappers;
using api.Models;
using Xunit;

namespace api.Tests.Mappers
{
    public class PortfolioMappersTests
    {
        [Fact]
        public void ToPortfolioDto_MapsStockFieldsAndPositionFields()
        {
            var stock = new Stock
            {
                Id = 5,
                Symbol = "AAPL",
                CompanyName = "Apple Inc.",
                Purchase = 185.20m,
                LastDiv = 0.24m,
                Industry = "Consumer Electronics",
                MarketCap = 2_850_000_000_000,
            };
            var portfolio = new Portfolio
            {
                AppUserId = "user-1",
                StockId = stock.Id,
                Stock = stock,
                Quantity = 10,
                AveragePrice = 150m,
            };

            var dto = portfolio.ToPortfolioDto();

            // PortfolioDto.Id intentionally mirrors the stock id, not the
            // portfolio row's own id -- the client keys positions by stock.
            Assert.Equal(stock.Id, dto.Id);
            Assert.Equal(stock.Symbol, dto.Symbol);
            Assert.Equal(stock.CompanyName, dto.CompanyName);
            Assert.Equal(stock.Purchase, dto.Purchase);
            Assert.Equal(stock.LastDiv, dto.LastDiv);
            Assert.Equal(stock.Industry, dto.Industry);
            Assert.Equal(stock.MarketCap, dto.MarketCap);
            Assert.Equal(portfolio.Quantity, dto.Quantity);
            Assert.Equal(portfolio.AveragePrice, dto.AveragePrice);
        }
    }
}
