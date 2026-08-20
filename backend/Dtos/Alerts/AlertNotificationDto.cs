namespace api.Dtos.Alerts
{
    public class AlertNotificationDto
    {
        public int Id { get; set; }
        public int PriceAlertId { get; set; }
        public string Message { get; set; } = string.Empty;
        public bool IsRead { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
