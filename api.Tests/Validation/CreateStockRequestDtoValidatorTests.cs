using api.Dtos.Stock;
using api.Validation;
using Xunit;

namespace api.Tests.Validation
{
    public class CreateStockRequestDtoValidatorTests
    {
        private static readonly CreateStockRequestDtoValidator Validator = new();

        private static CreateStockRequestDto MakeValidDto() =>
            new()
            {
                Symbol = "AAPL",
                CompanyName = "Apple Inc.",
                Purchase = 185.20m,
                LastDiv = 0.24m,
                Industry = "Consumer Electronics",
                MarketCap = 2_850_000_000_000,
            };

        [Theory]
        [InlineData("AAPL")]
        [InlineData("TEST")]
        [InlineData("BRK.B")]
        public void Validate_ValidSymbol_ReturnsTrue(string symbol)
        {
            var dto = MakeValidDto();
            dto.Symbol = symbol;

            var result = Validator.Validate(dto);

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
        public void Validate_SymbolTooLong_ReturnsFalse()
        {
            var dto = MakeValidDto();
            dto.Symbol = "TOOLONGSYMBOL";

            var result = Validator.Validate(dto);

            Assert.False(result.IsValid);
            Assert.Contains(result.Errors, e => e.PropertyName == "Symbol");
        }

        [Fact]
        public void Validate_SymbolWithInvalidCharacters_ReturnsFalse()
        {
            var dto = MakeValidDto();
            dto.Symbol = "AA PL!";

            var result = Validator.Validate(dto);

            Assert.False(result.IsValid);
            Assert.Contains(result.Errors, e => e.PropertyName == "Symbol");
        }

        [Fact]
        public void Validate_CompanyNameEmpty_ReturnsFalse()
        {
            var dto = MakeValidDto();
            dto.CompanyName = "";

            var result = Validator.Validate(dto);

            Assert.False(result.IsValid);
            Assert.Contains(result.Errors, e => e.PropertyName == "CompanyName");
        }

        [Fact]
        public void Validate_ZeroPurchase_ReturnsFalse()
        {
            var dto = MakeValidDto();
            dto.Purchase = 0;

            var result = Validator.Validate(dto);

            Assert.False(result.IsValid);
            Assert.Contains(result.Errors, e => e.PropertyName == "Purchase");
        }

        [Fact]
        public void Validate_NegativeLastDiv_ReturnsFalse()
        {
            var dto = MakeValidDto();
            dto.LastDiv = -1m;

            var result = Validator.Validate(dto);

            Assert.False(result.IsValid);
            Assert.Contains(result.Errors, e => e.PropertyName == "LastDiv");
        }

        [Fact]
        public void Validate_IndustryEmpty_ReturnsFalse()
        {
            var dto = MakeValidDto();
            dto.Industry = "";

            var result = Validator.Validate(dto);

            Assert.False(result.IsValid);
            Assert.Contains(result.Errors, e => e.PropertyName == "Industry");
        }

        [Fact]
        public void Validate_MarketCapZero_ReturnsFalse()
        {
            var dto = MakeValidDto();
            dto.MarketCap = 0;

            var result = Validator.Validate(dto);

            Assert.False(result.IsValid);
            Assert.Contains(result.Errors, e => e.PropertyName == "MarketCap");
        }

        [Fact]
        public void Validate_AllFieldsValid_ReturnsTrue()
        {
            var result = Validator.Validate(MakeValidDto());

            Assert.True(result.IsValid);
            Assert.Empty(result.Errors);
        }
    }
}
