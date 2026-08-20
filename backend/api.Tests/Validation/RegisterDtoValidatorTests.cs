using api.Dtos.Account;
using api.Validation;
using Xunit;

namespace api.Tests.Validation
{
    public class RegisterDtoValidatorTests
    {
        private static readonly RegisterDtoValidator Validator = new();

        private static RegisterDto MakeValidDto() =>
            new()
            {
                Username = "trader1",
                Email = "trader1@example.com",
                Password = "Str0ng!Passw0rd#",
            };

        [Fact]
        public void Validate_AllFieldsValid_ReturnsTrue()
        {
            var result = Validator.Validate(MakeValidDto());

            Assert.True(result.IsValid);
        }

        [Fact]
        public void Validate_UsernameEmpty_ReturnsFalse()
        {
            var dto = MakeValidDto();
            dto.Username = "";

            var result = Validator.Validate(dto);

            Assert.False(result.IsValid);
            Assert.Contains(result.Errors, e => e.PropertyName == "Username");
        }

        [Theory]
        [InlineData("not-an-email")]
        [InlineData("missing-at-sign.com")]
        public void Validate_InvalidEmail_ReturnsFalse(string email)
        {
            var dto = MakeValidDto();
            dto.Email = email;

            var result = Validator.Validate(dto);

            Assert.False(result.IsValid);
            Assert.Contains(result.Errors, e => e.PropertyName == "Email");
        }

        [Fact]
        public void Validate_PasswordEmpty_ReturnsFalse()
        {
            var dto = MakeValidDto();
            dto.Password = "";

            var result = Validator.Validate(dto);

            Assert.False(result.IsValid);
            Assert.Contains(result.Errors, e => e.PropertyName == "Password");
        }
    }
}
