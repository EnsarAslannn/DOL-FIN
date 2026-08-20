namespace api.Dtos.Portfolio
{
    public class TradeRequestDto
    {
        public string Symbol { get; set; } = string.Empty;

        public int Quantity { get; set; }
    }
}
