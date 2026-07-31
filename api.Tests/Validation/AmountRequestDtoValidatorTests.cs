using api.Dtos.Portfolio;
using api.Validation;
using Xunit;

namespace api.Tests.Validation
{
    public class AmountRequestDtoValidatorTests
    {
        private static readonly AmountRequestDtoValidator Validator = new();

        [Theory]
        [InlineData(0.01)]
        [InlineData(500)]
        public void Validate_ValidAmount_ReturnsTrue(decimal amount)
        {
            var result = Validator.Validate(new AmountRequestDto { Amount = amount });

            Assert.True(result.IsValid);
        }

        [Fact]
        public void Validate_NegativeAmount_ReturnsFalse()
        {
            var result = Validator.Validate(new AmountRequestDto { Amount = -50 });

            Assert.False(result.IsValid);
            Assert.Contains(result.Errors, e => e.PropertyName == "Amount");
        }

        [Fact]
        public void Validate_ZeroAmount_ReturnsFalse()
        {
            var result = Validator.Validate(new AmountRequestDto { Amount = 0 });

            Assert.False(result.IsValid);
            Assert.Contains(result.Errors, e => e.PropertyName == "Amount");
        }
    }
}
