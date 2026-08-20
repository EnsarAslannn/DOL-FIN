using api.Dtos.Comment;
using api.Models;

namespace api.Mappers
{
    public static class CommentMapper
    {
        public static CommentDto ToCommentDto(this Comment commentModel)
        {
            return new CommentDto
            {
                Id = commentModel.Id,
                Title = commentModel.Title,
                Content = commentModel.Content,
                CreatedOn = commentModel.CreatedOn,
                CreatedBy = commentModel.AppUser?.UserName ?? "Anonymous",
                StockId = commentModel.StockId,
            };
        }

        public static Comment ToCommentFromCreate(
            this CreateCommentDto commentDto,
            int stockId,
            string appUserId
        )
        {
            return new Comment
            {
                Title = commentDto.Title,
                Content = commentDto.Content,
                StockId = stockId,
                AppUserId = appUserId,
            };
        }

        public static Comment ToCommentFromUpdate(
            this UpdateCommentRequestDto commentDto,
            string appUserId
        )
        {
            return new Comment
            {
                Title = commentDto.Title,
                Content = commentDto.Content,
                AppUserId = appUserId,
            };
        }
    }
}
