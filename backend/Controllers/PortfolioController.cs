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
