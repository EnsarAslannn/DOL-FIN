namespace api.Dtos.Portfolio
{
    public class PortfolioMetricsDto
    {
        public decimal TotalInvestedAmount { get; set; }
        public decimal CurrentValue { get; set; }
        public decimal GainLossAmount { get; set; }
        public decimal GainLossPercent { get; set; }
        public List<StockAllocationDto> Allocations { get; set; } = [];
    }
}
