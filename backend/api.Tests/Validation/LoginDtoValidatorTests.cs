using api.Dtos.Account;
using api.Validation;
using Xunit;

namespace api.Tests.Validation
{
    public class LoginDtoValidatorTests
    {
        private static readonly LoginDtoValidator Validator = new();

        [Fact]
        public void Validate_ValidCredentials_ReturnsTrue()
        {
            var result = Validator.Validate(new LoginDto { UserName = "trader1", Password = "secret" });

            Assert.True(result.IsValid);
        }

        [Fact]
        public void Validate_UserNameEmpty_ReturnsFalse()
        {
            var result = Validator.Validate(new LoginDto { UserName = "", Password = "secret" });

            Assert.False(result.IsValid);
            Assert.Contains(result.Errors, e => e.PropertyName == "UserName");
        }

        [Fact]
        public void Validate_PasswordEmpty_ReturnsFalse()
        {
            var result = Validator.Validate(new LoginDto { UserName = "trader1", Password = "" });

            Assert.False(result.IsValid);
            Assert.Contains(result.Errors, e => e.PropertyName == "Password");
        }
    }
}
