using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models
{
    [Table("PriceAlerts")]
    public class PriceAlert
    {
        public int Id { get; set; }

        public required string AppUserId { get; set; }

        public int StockId { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal TargetPrice { get; set; }

        public PriceAlertCondition Condition { get; set; }

        public bool IsActive { get; set; } = true;

        // Set the first time the condition is met; a triggered alert is left
        // inactive rather than deleted so GetNotificationsAsync has something
        // to join back against, and isn't re-evaluated on every subsequent
        // background check (see PriceAlertService.CheckAndTriggerAlertsAsync).
        public DateTime? TriggeredAt { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public AppUser AppUser { get; set; } = default!;
        public Stock Stock { get; set; } = default!;
    }
}
