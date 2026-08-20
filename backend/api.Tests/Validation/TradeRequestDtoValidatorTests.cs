using api.Dtos.Portfolio;
using api.Validation;
using Xunit;

namespace api.Tests.Validation
{
    public class TradeRequestDtoValidatorTests
    {
        private static readonly TradeRequestDtoValidator Validator = new();

        [Theory]
        [InlineData("AAPL", 1)]
        [InlineData("MSFT", 1000)]
        public void Validate_ValidTrade_ReturnsTrue(string symbol, int quantity)
        {
            var dto = new TradeRequestDto { Symbol = symbol, Quantity = quantity };

            var result = Validator.Validate(dto);

            Assert.True(result.IsValid);
        }

        [Fact]
        public void Validate_SymbolEmpty_ReturnsFalse()
        {
            var dto = new TradeRequestDto { Symbol = "", Quantity = 1 };

            var result = Validator.Validate(dto);

            Assert.False(result.IsValid);
            Assert.Contains(result.Errors, e => e.PropertyName == "Symbol");
        }

        [Theory]
        [InlineData(0)]
        [InlineData(-5)]
        public void Validate_NonPositiveQuantity_ReturnsFalse(int quantity)
        {
            var dto = new TradeRequestDto { Symbol = "AAPL", Quantity = quantity };

            var result = Validator.Validate(dto);

            Assert.False(result.IsValid);
            Assert.Contains(result.Errors, e => e.PropertyName == "Quantity");
        }
    }
}
