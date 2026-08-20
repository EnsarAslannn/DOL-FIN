using api.Dtos.Comment;
using api.Validation;
using Xunit;

namespace api.Tests.Validation
{
    public class CreateCommentDtoValidatorTests
    {
        private static readonly CreateCommentDtoValidator Validator = new();

        [Fact]
        public void Validate_ValidTitleAndContent_ReturnsTrue()
        {
            var dto = new CreateCommentDto { Title = "Great buy", Content = "This stock looks promising." };

            var result = Validator.Validate(dto);

            Assert.True(result.IsValid);
        }

        [Fact]
        public void Validate_TitleEmpty_ReturnsFalse()
        {
            var dto = new CreateCommentDto { Title = "", Content = "This stock looks promising." };

            var result = Validator.Validate(dto);

            Assert.False(result.IsValid);
            Assert.Contains(result.Errors, e => e.PropertyName == "Title");
        }

        [Fact]
        public void Validate_TitleTooShort_ReturnsFalse()
        {
            var dto = new CreateCommentDto { Title = "Hi", Content = "This stock looks promising." };

            var result = Validator.Validate(dto);

            Assert.False(result.IsValid);
            Assert.Contains(result.Errors, e => e.PropertyName == "Title");
        }

        [Fact]
        public void Validate_ContentTooLong_ReturnsFalse()
        {
            var dto = new CreateCommentDto { Title = "Great buy", Content = new string('a', 281) };

            var result = Validator.Validate(dto);

            Assert.False(result.IsValid);
            Assert.Contains(result.Errors, e => e.PropertyName == "Content");
        }

        [Fact]
        public void Validate_ContentEmpty_ReturnsFalse()
        {
            var dto = new CreateCommentDto { Title = "Great buy", Content = "" };

            var result = Validator.Validate(dto);

            Assert.False(result.IsValid);
            Assert.Contains(result.Errors, e => e.PropertyName == "Content");
        }
    }
}
