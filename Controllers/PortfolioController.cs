using api.Dtos;
using api.Dtos.Portfolio;
using api.Extensions;
using api.Interfaces;
using api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    /// <summary>
    /// The authenticated user's own holdings: positions, trading, wallet, and analytics.
    /// </summary>
    /// <remarks>
    /// There is no per-user "list of named portfolios" concept in this API --
    /// every action here operates on the single implicit portfolio made up of
    /// the caller's own stock positions (one row per stock held). All
    /// mutating actions (buy/sell/deposit/withdraw) require the
    /// X-CSRF-TOKEN header described on AccountController.GetUserProfile, on
    /// top of the access_token cookie.
    /// </remarks>
    [Route("api/portfolio")]
    [ApiController]
    [Authorize]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public class PortfolioController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IPortfolioService _portfolioService;
        private readonly IPortfolioAnalyticsService _analyticsService;
        private readonly IRebalancingService _rebalancingService;

        public PortfolioController(
            UserManager<AppUser> userManager,
            IPortfolioService portfolioService,
            IPortfolioAnalyticsService analyticsService,
            IRebalancingService rebalancingService
        )
        {
            _userManager = userManager;
            _portfolioService = portfolioService;
            _analyticsService = analyticsService;
            _rebalancingService = rebalancingService;
        }

        /// <summary>
        /// List the current user's stock positions.
        /// </summary>
        /// <remarks>
        /// One entry per stock held, with the user's own weighted-average
        /// cost basis (<c>averagePrice</c>) alongside the stock's current
        /// price (<c>purchase</c>). Backed by a 5-minute Redis cache,
        /// invalidated on every buy/sell (see PortfolioService).
        /// </remarks>
        /// <response code="200">The user's positions (an empty list if they hold nothing).</response>
        [HttpGet]
        [ProducesResponseType(typeof(List<PortfolioDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetUserPortfolio()
        {
            var appUser = await User.GetAuthenticatedUserAsync(_userManager);
            if (appUser == null)
                return Unauthorized("User context not found.");

            var userPortfolio = await _portfolioService.GetUserPortfolioAsync(appUser);
            return Ok(userPortfolio);
        }

        /// <summary>
        /// Get aggregate portfolio metrics: invested amount, current value, gain/loss, and per-stock allocation.
        /// </summary>
        /// <remarks>
        /// All figures are derived on the fly from the current positions
        /// (see PortfolioAnalyticsService) -- nothing here is stored. A user
        /// with no positions gets all-zero totals and an empty allocations list.
        /// </remarks>
        /// <response code="200">Metrics for the current user's portfolio.</response>
        [HttpGet("metrics")]
        [ProducesResponseType(typeof(PortfolioMetricsDto), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetMetrics()
        {
            var appUser = await User.GetAuthenticatedUserAsync(_userManager);
            if (appUser == null)
                return Unauthorized("User context not found.");

            var metrics = await _analyticsService.GetMetricsAsync(appUser);
            return Ok(metrics);
        }

        /// <summary>
        /// Get concentration warnings for the current portfolio.
        /// </summary>
        /// <remarks>
        /// Flags any single stock over 40% of portfolio value, and any
        /// Stock.Industry sector over 60% (grouped by the stock's actual
        /// Industry field, not a hardcoded ticker list). An empty list means
        /// no concerns were found.
        /// </remarks>
        /// <response code="200">Zero or more human-readable warning strings.</response>
        [HttpGet("warnings")]
        [ProducesResponseType(typeof(List<string>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAllocationWarnings()
        {
            var appUser = await User.GetAuthenticatedUserAsync(_userManager);
            if (appUser == null)
                return Unauthorized("User context not found.");

            var warnings = await _analyticsService.GetAllocationWarningsAsync(appUser);
            return Ok(warnings);
        }

        /// <summary>
        /// Get a naive equal-weight rebalancing suggestion.
        /// </summary>
        /// <remarks>
        /// Targets an equal percentage across the user's current holdings and
        /// suggests Buy/Sell/Hold plus a share count per stock (within a 2%
        /// tolerance band, to avoid noisy 1-share suggestions on an
        /// already-balanced portfolio). This is intentionally simple --
        /// it does not do mean-variance optimization, tax-aware rebalancing,
        /// or asset-class targets.
        /// </remarks>
        /// <response code="200">Recommendation (empty adjustments if the user holds nothing).</response>
        [HttpGet("rebalance")]
        [ProducesResponseType(typeof(RebalancingRecommendationDto), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetRebalancingRecommendation()
        {
            var appUser = await User.GetAuthenticatedUserAsync(_userManager);
            if (appUser == null)
                return Unauthorized("User context not found.");

            var recommendation = await _rebalancingService.GetRecommendationAsync(appUser);
            return Ok(recommendation);
        }

        /// <summary>
        /// Buy shares of a stock, funded from the user's wallet balance.
        /// </summary>
        /// <remarks>
        /// Debits <c>quantity * stock.Purchase</c> from the wallet and either
        /// opens a new position or extends an existing one, recomputing its
        /// weighted-average cost basis. Runs in a DB transaction; a
        /// concurrent modification to the same wallet or position surfaces as
        /// a 400, not a 500.
        ///
        /// Sample request:
        ///
        ///     POST /api/portfolio
        ///     { "symbol": "AAPL", "quantity": 10 }
        ///
        /// Sample response body:
        ///
        ///     { "message": "Stock purchased successfully", "newBalance": 814.80 }
        /// </remarks>
        /// <param name="request">Symbol and quantity to buy.</param>
        /// <response code="200">Purchase completed; new wallet balance returned.</response>
        /// <response code="400">
        /// Quantity &lt;= 0, unknown symbol, insufficient wallet balance, or a
        /// concurrent update to the same wallet/position.
        /// </response>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> AddPortfolio([FromBody] TradeRequestDto request)
        {
            var appUser = await User.GetAuthenticatedUserAsync(_userManager);
            if (appUser == null)
                return Unauthorized("User context not found.");

            try
            {
                var result = await _portfolioService.BuyStockAsync(appUser, request.Symbol, request.Quantity);
                return Ok(result);
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
        /// Sell shares of a stock the user currently holds.
        /// </summary>
        /// <remarks>
        /// Credits <c>quantity * stock.Purchase</c> to the wallet. Selling the
        /// full position removes it; a partial sell just reduces the
        /// quantity (the average cost basis is unchanged by a sell).
        ///
        /// Sample request:
        ///
        ///     POST /api/portfolio/sell
        ///     { "symbol": "AAPL", "quantity": 5 }
        /// </remarks>
        /// <param name="request">Symbol and quantity to sell.</param>
        /// <response code="200">Sale completed; new wallet balance returned.</response>
        /// <response code="400">
        /// Quantity &lt;= 0, unknown symbol, insufficient shares held, or a
        /// concurrent update to the same wallet/position.
        /// </response>
        [HttpPost("sell")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> SellPortfolio([FromBody] TradeRequestDto request)
        {
            var appUser = await User.GetAuthenticatedUserAsync(_userManager);
            if (appUser == null)
                return Unauthorized("User context not found.");

            try
            {
                var result = await _portfolioService.SellStockAsync(appUser, request.Symbol, request.Quantity);
                return Ok(result);
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
        /// Add cash to the user's wallet balance.
        /// </summary>
        /// <remarks>
        /// There is no real payment integration behind this -- it directly
        /// credits the wallet, recorded as a "DEPOSIT" transaction.
        ///
        /// Sample request:
        ///
        ///     POST /api/portfolio/deposit
        ///     { "amount": 500.00 }
        /// </remarks>
        /// <param name="request">Amount to deposit (must be &gt;= 0.01).</param>
        /// <response code="200">Deposit completed; new wallet balance returned.</response>
        /// <response code="400">Amount &lt;= 0.</response>
        [HttpPost("deposit")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> DepositFunds([FromBody] AmountRequestDto request)
        {
            var appUser = await User.GetAuthenticatedUserAsync(_userManager);
            if (appUser == null)
                return Unauthorized("User context not found.");

            try
            {
                var result = await _portfolioService.DepositFundsAsync(appUser, request.Amount);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>
        /// Withdraw cash from the user's wallet balance.
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///
        ///     POST /api/portfolio/withdraw
        ///     { "amount": 100.00 }
        /// </remarks>
        /// <param name="request">Amount to withdraw (must be &gt;= 0.01).</param>
        /// <response code="200">Withdrawal completed; new wallet balance returned.</response>
        /// <response code="400">Amount &lt;= 0, or amount exceeds current wallet balance.</response>
        [HttpPost("withdraw")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> WithdrawFunds([FromBody] AmountRequestDto request)
        {
            var appUser = await User.GetAuthenticatedUserAsync(_userManager);
            if (appUser == null)
                return Unauthorized("User context not found.");

            try
            {
                var result = await _portfolioService.WithdrawFundsAsync(appUser, request.Amount);
                return Ok(result);
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
    }
}
