using api.Dtos.Stock;
using api.Mappers;
using api.Models;
using Xunit;

namespace api.Tests.Mappers
{
    public class StockMappersTests
    {
        [Fact]
        public void ToStockDto_MapsAllFields()
        {
            var stock = new Stock
            {
                Id = 1,
                Symbol = "AAPL",
                CompanyName = "Apple Inc.",
                Purchase = 185.20m,
                LastDiv = 0.24m,
                Industry = "Consumer Electronics",
                MarketCap = 2_850_000_000_000,
                Comments =
                [
                    new Comment
                    {
                        Id = 1,
                        Title = "Nice",
                        Content = "Great buy",
                        StockId = 1,
                        AppUserId = "user-1",
                        AppUser = new AppUser { Id = "user-1", UserName = "trader" },
                    },
                ],
            };

            var dto = stock.ToStockDto();

            Assert.Equal(stock.Id, dto.Id);
            Assert.Equal(stock.Symbol, dto.Symbol);
            Assert.Equal(stock.CompanyName, dto.CompanyName);
            Assert.Equal(stock.Purchase, dto.Purchase);
            Assert.Equal(stock.LastDiv, dto.LastDiv);
            Assert.Equal(stock.Industry, dto.Industry);
            Assert.Equal(stock.MarketCap, dto.MarketCap);
            Assert.Single(dto.Comments);
            Assert.Equal("trader", dto.Comments[0].CreatedBy);
        }

        [Fact]
        public void ToStockDto_NoComments_ReturnsEmptyList()
        {
            var stock = new Stock
            {
                Id = 1,
                Symbol = "AAPL",
                CompanyName = "Apple Inc.",
                Purchase = 185.20m,
                LastDiv = 0.24m,
                Industry = "Consumer Electronics",
                MarketCap = 2_850_000_000_000,
            };

            var dto = stock.ToStockDto();

            Assert.Empty(dto.Comments);
        }

        [Fact]
        public void ToStockFromCreateDto_TrimsAndUppercasesSymbol()
        {
            var createDto = new CreateStockRequestDto
            {
                Symbol = " aapl ",
                CompanyName = "Apple Inc.",
                Purchase = 185.20m,
                LastDiv = 0.24m,
                Industry = "Consumer Electronics",
                MarketCap = 2_850_000_000_000,
            };

            var stock = createDto.ToStockFromCreateDto();

            Assert.Equal("AAPL", stock.Symbol);
            Assert.Equal(createDto.CompanyName, stock.CompanyName);
            Assert.Equal(createDto.Purchase, stock.Purchase);
            Assert.Equal(createDto.LastDiv, stock.LastDiv);
            Assert.Equal(createDto.Industry, stock.Industry);
            Assert.Equal(createDto.MarketCap, stock.MarketCap);
        }
    }
}
