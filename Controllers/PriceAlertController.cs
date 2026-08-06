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
