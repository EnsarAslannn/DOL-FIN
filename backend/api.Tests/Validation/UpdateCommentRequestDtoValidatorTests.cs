using api.Dtos.Comment;
using api.Validation;
using Xunit;

namespace api.Tests.Validation
{
    public class UpdateCommentRequestDtoValidatorTests
    {
        private static readonly UpdateCommentRequestDtoValidator Validator = new();

        [Fact]
        public void Validate_ValidTitleAndContent_ReturnsTrue()
        {
            var dto = new UpdateCommentRequestDto { Title = "Updated title", Content = "Updated content." };

            var result = Validator.Validate(dto);

            Assert.True(result.IsValid);
        }

        [Fact]
        public void Validate_TitleTooShort_ReturnsFalse()
        {
            var dto = new UpdateCommentRequestDto { Title = "Hi", Content = "Updated content." };

            var result = Validator.Validate(dto);

            Assert.False(result.IsValid);
            Assert.Contains(result.Errors, e => e.PropertyName == "Title");
        }
    }
}
