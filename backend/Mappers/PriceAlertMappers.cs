using api.Dtos.Alerts;
using api.Models;

namespace api.Mappers
{
    public static class PriceAlertMappers
    {
        public static PriceAlertDto ToPriceAlertDto(this PriceAlert alert)
        {
            return new PriceAlertDto
            {
                Id = alert.Id,
                StockId = alert.StockId,
                Symbol = alert.Stock.Symbol,
                TargetPrice = alert.TargetPrice,
                Condition = alert.Condition,
                IsActive = alert.IsActive,
                TriggeredAt = alert.TriggeredAt,
                CreatedAt = alert.CreatedAt,
            };
        }

        public static AlertNotificationDto ToAlertNotificationDto(this AlertNotification notification)
        {
            return new AlertNotificationDto
            {
                Id = notification.Id,
                PriceAlertId = notification.PriceAlertId,
                Message = notification.Message,
                IsRead = notification.IsRead,
                CreatedAt = notification.CreatedAt,
            };
        }
    }
}
