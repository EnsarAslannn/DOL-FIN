using System.ComponentModel.DataAnnotations;

namespace api.Dtos.Comment
{
    public class UpdateCommentRequestDto
    {
        [Required]
        [MinLength(5, ErrorMessage = "Title must be min 5 characters")]
        [MaxLength(280, ErrorMessage = " Title can not be over 280 characters")]
        public string Title { get; set; } = string.Empty;

        [Required]
        [MinLength(5, ErrorMessage = "Content must be min 5 characters")]
        [MaxLength(280, ErrorMessage = " Content can not be over 280 characters")]
        public string Content { get; set; } = string.Empty;
    }
}
