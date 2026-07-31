namespace api.Dtos.Portfolio
{
    public class StockAdjustmentDto
    {
        public int StockId { get; set; }
        public string Symbol { get; set; } = string.Empty;
        public decimal CurrentAllocationPercent { get; set; }
        public decimal TargetAllocationPercent { get; set; }

        // "Buy", "Sell", or "Hold"
        public string Action { get; set; } = string.Empty;

        // Always >= 0; Action indicates the direction.
        public int SuggestedQuantity { get; set; }
    }
}
