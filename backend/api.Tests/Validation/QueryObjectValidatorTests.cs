using api.Helpers;
using api.Validation;
using Xunit;

namespace api.Tests.Validation
{
    public class QueryObjectValidatorTests
    {
        private static readonly QueryObjectValidator Validator = new();

        [Fact]
        public void Validate_Defaults_ReturnsTrue()
        {
            var result = Validator.Validate(new QueryObject());

            Assert.True(result.IsValid);
        }

        [Fact]
        public void Validate_PageNumberZero_ReturnsFalse()
        {
            var result = Validator.Validate(new QueryObject { PageNumber = 0 });

            Assert.False(result.IsValid);
            Assert.Contains(result.Errors, e => e.PropertyName == "PageNumber");
        }

        [Theory]
        [InlineData(0)]
        [InlineData(101)]
        public void Validate_PageSizeOutOfRange_ReturnsFalse(int pageSize)
        {
            var result = Validator.Validate(new QueryObject { PageSize = pageSize });

            Assert.False(result.IsValid);
            Assert.Contains(result.Errors, e => e.PropertyName == "PageSize");
        }
    }
}
