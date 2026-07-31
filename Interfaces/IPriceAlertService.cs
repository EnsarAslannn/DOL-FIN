using api.Models;

namespace api.Interfaces
{
    public interface IPriceAlertService
    {
        Task<PriceAlert> CreateAlertAsync(
            AppUser user,
            int stockId,
            decimal targetPrice,
            PriceAlertCondition condition
        );

        Task<List<PriceAlert>> GetActiveAlertsAsync(AppUser user);

        // Evaluates every untriggered active alert against its stock's current
        // price and creates a notification for each one that now matches.
        // Returns how many fired, for logging by the caller (see
        // PriceAlertBackgroundService).
        Task<int> CheckAndTriggerAlertsAsync();

        Task<List<AlertNotification>> GetNotificationsAsync(AppUser user);

        Task<AlertNotification?> GetNotificationByIdAsync(int notificationId);

        Task MarkNotificationReadAsync(AlertNotification notification);
    }
}
