namespace api.Dtos.Portfolio
{
    public class RebalancingRecommendationDto
    {
        public List<StockAdjustmentDto> Adjustments { get; set; } = [];
        public string Summary { get; set; } = string.Empty;
    }
}
