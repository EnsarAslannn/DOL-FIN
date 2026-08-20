using api.Models;

namespace api.Dtos.Alerts
{
    public class CreatePriceAlertRequestDto
    {
        public int StockId { get; set; }
        public decimal TargetPrice { get; set; }
        public PriceAlertCondition Condition { get; set; }
    }
}
