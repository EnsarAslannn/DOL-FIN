using System.ComponentModel.DataAnnotations;

namespace api.Helpers
{
    public class CommentQueryObject
    {
        public string? Symbol { get; set; }
        public bool IsDescending { get; set; } = true;

        [Range(1, int.MaxValue, ErrorMessage = "PageNumber must be at least 1")]
        public int PageNumber { get; set; } = 1;

        [Range(1, 100, ErrorMessage = "PageSize must be between 1 and 100")]
        public int PageSize { get; set; } = 20;
    }
}
