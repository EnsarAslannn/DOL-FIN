namespace api.Dtos.Portfolio
{
    public class StockAllocationDto
    {
        public int StockId { get; set; }
        public string Symbol { get; set; } = string.Empty;
        public string CompanyName { get; set; } = string.Empty;
        public string Industry { get; set; } = string.Empty;
        public int Quantity { get; set; }

        public decimal AverageCostPerShare { get; set; }

        public decimal CurrentPrice { get; set; }

        public decimal CurrentValue { get; set; }
        public decimal GainLossAmount { get; set; }
        public decimal GainLossPercent { get; set; }
        public decimal AllocationPercent { get; set; }
    }
}
