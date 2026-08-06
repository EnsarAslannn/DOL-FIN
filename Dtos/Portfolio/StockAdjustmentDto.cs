namespace api.Dtos.Portfolio
{
    public class StockAdjustmentDto
    {
        public int StockId { get; set; }
        public string Symbol { get; set; } = string.Empty;
        public decimal CurrentAllocationPercent { get; set; }
        public decimal TargetAllocationPercent { get; set; }

        public string Action { get; set; } = string.Empty;

        public int SuggestedQuantity { get; set; }
    }
}
