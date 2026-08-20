using api.Dtos.Alerts;
using api.Models;
using api.Validation;
using Xunit;

namespace api.Tests.Validation
{
    public class CreatePriceAlertRequestDtoValidatorTests
    {
        private static readonly CreatePriceAlertRequestDtoValidator Validator = new();

        [Fact]
        public void Validate_ValidRequest_ReturnsTrue()
        {
            var dto = new CreatePriceAlertRequestDto
            {
                StockId = 1,
                TargetPrice = 200m,
                Condition = PriceAlertCondition.GreaterThanOrEqual,
            };

            var result = Validator.Validate(dto);

            Assert.True(result.IsValid);
        }

        [Fact]
        public void Validate_StockIdZero_ReturnsFalse()
        {
            var dto = new CreatePriceAlertRequestDto
            {
                StockId = 0,
                TargetPrice = 200m,
                Condition = PriceAlertCondition.GreaterThanOrEqual,
            };

            var result = Validator.Validate(dto);

            Assert.False(result.IsValid);
            Assert.Contains(result.Errors, e => e.PropertyName == "StockId");
        }

        [Fact]
        public void Validate_TargetPriceZero_ReturnsFalse()
        {
            var dto = new CreatePriceAlertRequestDto
            {
                StockId = 1,
                TargetPrice = 0m,
                Condition = PriceAlertCondition.GreaterThanOrEqual,
            };

            var result = Validator.Validate(dto);

            Assert.False(result.IsValid);
            Assert.Contains(result.Errors, e => e.PropertyName == "TargetPrice");
        }

        [Fact]
        public void Validate_InvalidConditionValue_ReturnsFalse()
        {
            var dto = new CreatePriceAlertRequestDto
            {
                StockId = 1,
                TargetPrice = 200m,
                Condition = (PriceAlertCondition)99,
            };

            var result = Validator.Validate(dto);

            Assert.False(result.IsValid);
            Assert.Contains(result.Errors, e => e.PropertyName == "Condition");
        }
    }
}
