using api.Dtos.Comment;
using api.Mappers;
using api.Models;
using Xunit;

namespace api.Tests.Mappers
{
    public class CommentMapperTests
    {
        [Fact]
        public void ToCommentDto_WithAppUser_UsesUserNameAsCreatedBy()
        {
            var comment = new Comment
            {
                Id = 1,
                Title = "Nice",
                Content = "Great buy",
                StockId = 5,
                AppUserId = "user-1",
                AppUser = new AppUser { Id = "user-1", UserName = "trader" },
            };

            var dto = comment.ToCommentDto();

            Assert.Equal(comment.Id, dto.Id);
            Assert.Equal(comment.Title, dto.Title);
            Assert.Equal(comment.Content, dto.Content);
            Assert.Equal(comment.StockId, dto.StockId);
            Assert.Equal("trader", dto.CreatedBy);
        }

        [Fact]
        public void ToCommentDto_WithoutAppUser_FallsBackToAnonymous()
        {
            var comment = new Comment
            {
                Id = 1,
                Title = "Nice",
                Content = "Great buy",
                AppUserId = "user-1",
                AppUser = null!,
            };

            var dto = comment.ToCommentDto();

            Assert.Equal("Anonymous", dto.CreatedBy);
        }

        [Fact]
        public void ToCommentFromCreate_SetsStockAndUserIds()
        {
            var createDto = new CreateCommentDto { Title = "Nice", Content = "Great buy" };

            var comment = createDto.ToCommentFromCreate(stockId: 5, appUserId: "user-1");

            Assert.Equal("Nice", comment.Title);
            Assert.Equal("Great buy", comment.Content);
            Assert.Equal(5, comment.StockId);
            Assert.Equal("user-1", comment.AppUserId);
        }

        [Fact]
        public void ToCommentFromUpdate_SetsUserIdAndLeavesStockIdUnset()
        {
            var updateDto = new UpdateCommentRequestDto { Title = "Updated", Content = "Updated content" };

            var comment = updateDto.ToCommentFromUpdate(appUserId: "user-1");

            Assert.Equal("Updated", comment.Title);
            Assert.Equal("Updated content", comment.Content);
            Assert.Equal("user-1", comment.AppUserId);
            Assert.Null(comment.StockId);
        }
    }
}
