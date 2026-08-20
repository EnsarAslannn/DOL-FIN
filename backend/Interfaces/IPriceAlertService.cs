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

        Task<int> CheckAndTriggerAlertsAsync();

        Task<List<AlertNotification>> GetNotificationsAsync(AppUser user);

        Task<AlertNotification?> GetNotificationByIdAsync(int notificationId);

        Task MarkNotificationReadAsync(AlertNotification notification);
    }
}
