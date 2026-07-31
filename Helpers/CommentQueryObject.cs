namespace api.Helpers
{
    public class CommentQueryObject
    {
        public string? Symbol { get; set; }
        public bool IsDescending { get; set; } = true;

        public int PageNumber { get; set; } = 1;

        public int PageSize { get; set; } = 20;
    }
}
