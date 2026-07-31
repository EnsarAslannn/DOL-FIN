using api.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace api.Service
{
    // Lightweight stand-in for a job scheduler: this app has no Hangfire/
    // Quartz infrastructure (and no Hangfire storage tables), and a single
    // periodic timer is all a daily price check needs. Runs in its own DI
    // scope per tick since IPriceAlertService/ApplicationDBContext are scoped
    // services and this class itself is a singleton (BackgroundService
    // convention).
    public class PriceAlertBackgroundService : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<PriceAlertBackgroundService> _logger;
        private readonly TimeSpan _checkInterval;

        public PriceAlertBackgroundService(
            IServiceScopeFactory scopeFactory,
            ILogger<PriceAlertBackgroundService> logger,
            IConfiguration configuration
        )
        {
            _scopeFactory = scopeFactory;
            _logger = logger;
            var hours = configuration.GetValue<double?>("PriceAlerts:CheckIntervalHours") ?? 24;
            _checkInterval = TimeSpan.FromHours(hours);
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    using var scope = _scopeFactory.CreateScope();
                    var alertService = scope.ServiceProvider.GetRequiredService<IPriceAlertService>();
                    await alertService.CheckAndTriggerAlertsAsync();
                }
                catch (Exception ex)
                {
                    // A failed check must not crash the host -- it just tries
                    // again on the next tick.
                    _logger.LogError(ex, "Price alert background check failed");
                }

                try
                {
                    await Task.Delay(_checkInterval, stoppingToken);
                }
                catch (OperationCanceledException)
                {
                    // Expected during shutdown.
                }
            }
        }
    }
}
