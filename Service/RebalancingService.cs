using api.Dtos.Portfolio;
using api.Interfaces;
using api.Models;

namespace api.Service
{
    // Deliberately simple: suggests an equal-weight target across the user's
    // current holdings. Real portfolio optimization (mean-variance, target
    // asset-class splits, tax-aware rebalancing) is out of scope for this MVP.
    public class RebalancingService : IRebalancingService
    {
        // Within this band of the equal-weight target, no action is suggested
        // -- otherwise a portfolio that's already essentially balanced would
        // get noisy "buy 1 / sell 1 share" suggestions purely from rounding.
        private const decimal ToleranceBandPercent = 2m;

        private readonly IPortfolioAnalyticsService _analyticsService;

        public RebalancingService(IPortfolioAnalyticsService analyticsService)
        {
            _analyticsService = analyticsService;
        }

        public async Task<RebalancingRecommendationDto> GetRecommendationAsync(AppUser user)
        {
            var metrics = await _analyticsService.GetMetricsAsync(user);

            if (metrics.Allocations.Count == 0)
            {
                return new RebalancingRecommendationDto
                {
                    Adjustments = [],
                    Summary = "No open positions to rebalance.",
                };
            }

            var targetPercent = 100m / metrics.Allocations.Count;

            var adjustments = metrics
                .Allocations.Select(allocation =>
                    BuildAdjustment(allocation, targetPercent, metrics.CurrentValue)
                )
                .ToList();

            return new RebalancingRecommendationDto
            {
                Adjustments = adjustments,
                Summary =
                    $"Equal-weight target across {metrics.Allocations.Count} holding(s) is {targetPercent:F1}% each.",
            };
        }

        private static StockAdjustmentDto BuildAdjustment(
            StockAllocationDto allocation,
            decimal targetPercent,
            decimal totalCurrentValue
        )
        {
            var deviation = allocation.AllocationPercent - targetPercent;
            var action =
                Math.Abs(deviation) <= ToleranceBandPercent ? "Hold"
                : deviation > 0 ? "Sell"
                : "Buy";

            var suggestedQuantity = 0;
            if (action != "Hold" && allocation.CurrentPrice > 0)
            {
                var targetValue = totalCurrentValue * (targetPercent / 100);
                var valueDifference = Math.Abs(targetValue - allocation.CurrentValue);
                suggestedQuantity = (int)
                    Math.Round(valueDifference / allocation.CurrentPrice, MidpointRounding.AwayFromZero);
            }

            return new StockAdjustmentDto
            {
                StockId = allocation.StockId,
                Symbol = allocation.Symbol,
                CurrentAllocationPercent = allocation.AllocationPercent,
                TargetAllocationPercent = targetPercent,
                Action = action,
                SuggestedQuantity = suggestedQuantity,
            };
        }
    }
}
