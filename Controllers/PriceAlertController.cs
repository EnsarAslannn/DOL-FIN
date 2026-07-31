using api.Dtos.Alerts;
using api.Extensions;
using api.Interfaces;
using api.Mappers;
using api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    /// <summary>
    /// Price alerts on individual stocks, and the notifications they generate.
    /// </summary>
    /// <remarks>
    /// Alerts and notifications are scoped to the authenticated user, not to
    /// a named portfolio -- there is no portfolioId on either. A daily
    /// background check (PriceAlertBackgroundService) evaluates every active,
    /// not-yet-triggered alert against Stock.Purchase, the only price this
    /// app tracks (there is no live market feed); it is not real-time. Create
    /// and the notification-read action require the X-CSRF-TOKEN header
    /// described on AccountController.GetUserProfile.
    /// </remarks>
    [Route("api/alerts")]
    [ApiController]
    [Authorize]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public class PriceAlertController : ControllerBase
    {
        private readonly IPriceAlertService _alertService;
        private readonly UserManager<AppUser> _userManager;

        public PriceAlertController(IPriceAlertService alertService, UserManager<AppUser> userManager)
        {
            _alertService = alertService;
            _userManager = userManager;
        }

        /// <summary>
        /// Create a price alert for a stock.
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///
        ///     POST /api/alerts
        ///     { "stockId": 1, "targetPrice": 200, "condition": "GreaterThanOrEqual" }
        ///
        /// <c>condition</c> is <c>"GreaterThanOrEqual"</c> or <c>"LessThanOrEqual"</c>.
        /// </remarks>
        /// <param name="dto">Stock, target price, and trigger condition.</param>
        /// <response code="201">Alert created.</response>
        /// <response code="400">targetPrice &lt;= 0, invalid condition, or stockId doesn't exist.</response>
        [HttpPost]
        [ProducesResponseType(typeof(PriceAlertDto), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(Microsoft.AspNetCore.Mvc.ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Create([FromBody] CreatePriceAlertRequestDto dto)
        {
            var appUser = await User.GetAuthenticatedUserAsync(_userManager);
            if (appUser == null)
                return Unauthorized("User context not found.");

            try
            {
                var alert = await _alertService.CreateAlertAsync(
                    appUser,
                    dto.StockId,
                    dto.TargetPrice,
                    dto.Condition
                );
                return CreatedAtAction(nameof(GetAlerts), null, alert.ToPriceAlertDto());
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>
        /// List the current user's active price alerts.
        /// </summary>
        /// <remarks>
        /// "Active" means <c>isActive</c>, independent of whether it has
        /// already fired once -- a triggered alert stays in this list
        /// (<c>triggeredAt</c> is set) unless deactivated.
        /// </remarks>
        /// <response code="200">The user's active alerts (possibly empty).</response>
        [HttpGet]
        [ProducesResponseType(typeof(List<PriceAlertDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAlerts()
        {
            var appUser = await User.GetAuthenticatedUserAsync(_userManager);
            if (appUser == null)
                return Unauthorized("User context not found.");

            var alerts = await _alertService.GetActiveAlertsAsync(appUser);
            return Ok(alerts.Select(a => a.ToPriceAlertDto()));
        }

        /// <summary>
        /// List the current user's alert notifications, newest first.
        /// </summary>
        /// <response code="200">The user's notifications (possibly empty).</response>
        [HttpGet("notifications")]
        [ProducesResponseType(typeof(List<AlertNotificationDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetNotifications()
        {
            var appUser = await User.GetAuthenticatedUserAsync(_userManager);
            if (appUser == null)
                return Unauthorized("User context not found.");

            var notifications = await _alertService.GetNotificationsAsync(appUser);
            return Ok(notifications.Select(n => n.ToAlertNotificationDto()));
        }

        /// <summary>
        /// Mark a notification as read. Owner only.
        /// </summary>
        /// <param name="id">Notification ID.</param>
        /// <response code="200">Notification marked read.</response>
        /// <response code="403">Authenticated as a different user than the notification's owner.</response>
        /// <response code="404">No notification with that ID.</response>
        [HttpPost("notifications/{id:int}/read")]
        [ProducesResponseType(typeof(AlertNotificationDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> MarkNotificationRead([FromRoute] int id)
        {
            var appUser = await User.GetAuthenticatedUserAsync(_userManager);
            if (appUser == null)
                return Unauthorized("User context not found.");

            var notification = await _alertService.GetNotificationByIdAsync(id);
            if (notification == null)
                return NotFound("Notification not found");

            if (notification.AppUserId != appUser.Id)
                return Forbid();

            await _alertService.MarkNotificationReadAsync(notification);
            return Ok(notification.ToAlertNotificationDto());
        }
    }
}
