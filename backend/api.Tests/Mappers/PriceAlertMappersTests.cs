using api.Mappers;
using api.Models;
using Xunit;

namespace api.Tests.Mappers
{
    public class PriceAlertMappersTests
    {
        [Fact]
        public void ToPriceAlertDto_MapsAllFieldsIncludingSymbolFromStock()
        {
            var triggeredAt = new DateTime(2026, 1, 15, 9, 30, 0, DateTimeKind.Utc);
            var createdAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc);
            var alert = new PriceAlert
            {
                Id = 7,
                AppUserId = "user-1",
                StockId = 3,
                TargetPrice = 200m,
                Condition = PriceAlertCondition.GreaterThanOrEqual,
                IsActive = false,
                TriggeredAt = triggeredAt,
                CreatedAt = createdAt,
                Stock = new Stock { Id = 3, Symbol = "AAPL", CompanyName = "Apple Inc." },
            };

            var dto = alert.ToPriceAlertDto();

            Assert.Equal(alert.Id, dto.Id);
            Assert.Equal(alert.StockId, dto.StockId);
            Assert.Equal("AAPL", dto.Symbol);
            Assert.Equal(alert.TargetPrice, dto.TargetPrice);
            Assert.Equal(alert.Condition, dto.Condition);
            Assert.Equal(alert.IsActive, dto.IsActive);
            Assert.Equal(alert.TriggeredAt, dto.TriggeredAt);
            Assert.Equal(alert.CreatedAt, dto.CreatedAt);
        }

        [Fact]
        public void ToPriceAlertDto_NotYetTriggered_TriggeredAtIsNull()
        {
            var alert = new PriceAlert
            {
                Id = 1,
                AppUserId = "user-1",
                StockId = 3,
                TargetPrice = 100m,
                Condition = PriceAlertCondition.LessThanOrEqual,
                IsActive = true,
                TriggeredAt = null,
                Stock = new Stock { Id = 3, Symbol = "NVDA", CompanyName = "NVIDIA Corporation" },
            };

            var dto = alert.ToPriceAlertDto();

            Assert.Null(dto.TriggeredAt);
            Assert.True(dto.IsActive);
        }

        [Fact]
        public void ToAlertNotificationDto_MapsAllFields()
        {
            var createdAt = new DateTime(2026, 2, 1, 12, 0, 0, DateTimeKind.Utc);
            var notification = new AlertNotification
            {
                Id = 42,
                PriceAlertId = 7,
                AppUserId = "user-1",
                Message = "AAPL crossed your target of 200.00",
                IsRead = false,
                CreatedAt = createdAt,
            };

            var dto = notification.ToAlertNotificationDto();

            Assert.Equal(notification.Id, dto.Id);
            Assert.Equal(notification.PriceAlertId, dto.PriceAlertId);
            Assert.Equal(notification.Message, dto.Message);
            Assert.Equal(notification.IsRead, dto.IsRead);
            Assert.Equal(notification.CreatedAt, dto.CreatedAt);
        }
    }
}
