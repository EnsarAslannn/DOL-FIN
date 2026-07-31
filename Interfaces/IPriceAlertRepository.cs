using api.Models;

namespace api.Interfaces
{
    public interface IPriceAlertRepository
    {
        Task<PriceAlert> CreateAsync(PriceAlert alert);

        Task<PriceAlert?> GetByIdAsync(int id);

        Task<List<PriceAlert>> GetActiveAlertsForUserAsync(string appUserId);

        // Used by the background job, which evaluates every user's alerts in
        // one pass rather than being told which user to check.
        Task<List<PriceAlert>> GetAllUntriggeredActiveAlertsAsync();

        Task UpdateAsync(PriceAlert alert);

        Task<AlertNotification> CreateNotificationAsync(AlertNotification notification);

        Task<AlertNotification?> GetNotificationByIdAsync(int id);

        Task<List<AlertNotification>> GetNotificationsForUserAsync(string appUserId);

        Task UpdateNotificationAsync(AlertNotification notification);
    }
}
