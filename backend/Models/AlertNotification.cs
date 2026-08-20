using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models
{
    [Table("AlertNotifications")]
    public class AlertNotification
    {
        public int Id { get; set; }

        public int PriceAlertId { get; set; }

        public required string AppUserId { get; set; }

        public string Message { get; set; } = string.Empty;

        public bool IsRead { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public PriceAlert PriceAlert { get; set; } = default!;
    }
}
