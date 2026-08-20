using api.Dtos.Stock;
using api.Validation;
using Xunit;

namespace api.Tests.Validation
{
    public class UpdateStockRequestDtoValidatorTests
    {
        private static readonly UpdateStockRequestDtoValidator Validator = new();

        private static UpdateStockRequestDto MakeValidDto() =>
            new()
            {
                Symbol = "AAPL",
                CompanyName = "Apple Inc.",
                Purchase = 185.20m,
                LastDiv = 0.24m,
                Industry = "Consumer Electronics",
                MarketCap = 2_850_000_000_000,
            };

        [Fact]
        public void Validate_AllFieldsValid_ReturnsTrue()
        {
            var result = Validator.Validate(MakeValidDto());

            Assert.True(result.IsValid);
        }

        [Fact]
        public void Validate_SymbolEmpty_ReturnsFalse()
        {
            var dto = MakeValidDto();
            dto.Symbol = "";

            var result = Validator.Validate(dto);

            Assert.False(result.IsValid);
            Assert.Contains(result.Errors, e => e.PropertyName == "Symbol");
        }

        [Fact]
        public void Validate_MarketCapNegative_ReturnsFalse()
        {
            var dto = MakeValidDto();
            dto.MarketCap = -5;

            var result = Validator.Validate(dto);

            Assert.False(result.IsValid);
            Assert.Contains(result.Errors, e => e.PropertyName == "MarketCap");
        }
    }
}
