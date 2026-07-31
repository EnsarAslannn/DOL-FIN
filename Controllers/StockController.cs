using api.Dtos.Stock;
using api.Helpers;
using api.Interfaces;
using api.Mappers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    /// <summary>
    /// The stock catalog: browse, look up, and (Admin-only) manage listings.
    /// </summary>
    /// <remarks>
    /// Every action requires authentication; Create/Update/Delete
    /// additionally require the Admin role. Reads are served through a
    /// Redis-backed cache with a direct-DB fallback (see
    /// CachedStockRepository) -- a stale Redis instance never turns into an
    /// error, just a slower response.
    /// </remarks>
    [Route("api/stock")]
    [ApiController]
    [Authorize]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public class StockController : ControllerBase
    {
        private readonly IStockRepository _stockRepo;

        public StockController(IStockRepository stockRepo)
        {
            _stockRepo = stockRepo;
        }

        /// <summary>
        /// List stocks, with optional filtering, sorting, and pagination.
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///
        ///     GET /api/stock?symbol=AAP&amp;sortBy=MarketCap&amp;isDescending=true&amp;pageNumber=1&amp;pageSize=20
        ///
        /// <c>symbol</c> and <c>companyName</c> filter by substring (case-insensitive);
        /// <c>sortBy</c> accepts <c>"Symbol"</c> or <c>"MarketCap"</c> (anything else falls back to
        /// insertion order); <c>pageSize</c> is capped at 100.
        /// </remarks>
        /// <param name="query">Filter, sort, and pagination parameters.</param>
        /// <response code="200">A page of stocks (possibly empty).</response>
        /// <response code="400">pageNumber &lt; 1 or pageSize outside 1-100.</response>
        [HttpGet]
        [ProducesResponseType(typeof(List<StockDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(Microsoft.AspNetCore.Mvc.ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetAll([FromQuery] QueryObject query)
        {
            var stocks = await _stockRepo.GetAllAsync(query);
            var stockDto = stocks.Select(s => s.ToStockDto()).ToList();

            return Ok(stockDto);
        }

        /// <summary>
        /// Get a single stock by its database ID, including its comments.
        /// </summary>
        /// <param name="id">Stock ID.</param>
        /// <response code="200">Stock found.</response>
        /// <response code="404">No stock with that ID.</response>
        [HttpGet("{id:int}")]
        [ProducesResponseType(typeof(StockDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            var stock = await _stockRepo.GetByIdAsync(id);

            if (stock == null)
            {
                return NotFound();
            }

            return Ok(stock.ToStockDto());
        }

        /// <summary>
        /// Create a new stock listing. Admin only.
        /// </summary>
        /// <remarks>
        /// The symbol is trimmed and upper-cased before the uniqueness check
        /// and before it's stored, so "aapl" and " AAPL " both collide with
        /// an existing "AAPL" row.
        ///
        /// Sample request:
        ///
        ///     POST /api/stock
        ///     {
        ///        "symbol": "NVDA",
        ///        "companyName": "NVIDIA Corporation",
        ///        "purchase": 875.50,
        ///        "lastDiv": 0.04,
        ///        "industry": "Semiconductors",
        ///        "marketCap": 2150000000000
        ///     }
        /// </remarks>
        /// <param name="stockDto">New stock's details.</param>
        /// <response code="201">Stock created; Location header points at GetById.</response>
        /// <response code="400">Validation failed (see FluentValidation errors).</response>
        /// <response code="403">Authenticated but not an Admin.</response>
        /// <response code="409">A stock with that symbol already exists.</response>
        [HttpPost]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(typeof(StockDto), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(Microsoft.AspNetCore.Mvc.ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        public async Task<IActionResult> Create([FromBody] CreateStockRequestDto stockDto)
        {
            if (await _stockRepo.GetBySymbolAsync(stockDto.Symbol) != null)
            {
                return Conflict($"A stock with symbol '{stockDto.Symbol.Trim().ToUpperInvariant()}' already exists.");
            }

            var stockModel = stockDto.ToStockFromCreateDto();
            await _stockRepo.CreateAsync(stockModel);

            return CreatedAtAction(
                nameof(GetById),
                new { id = stockModel.Id },
                stockModel.ToStockDto()
            );
        }

        /// <summary>
        /// Replace a stock's details. Admin only.
        /// </summary>
        /// <remarks>
        /// All fields are required and fully replace the existing row -- this
        /// is a full update, not a partial patch. Renaming a stock's symbol
        /// to one already used by a *different* stock is rejected as a
        /// conflict.
        /// </remarks>
        /// <param name="id">Stock ID to update.</param>
        /// <param name="updateDto">Full replacement details.</param>
        /// <response code="200">Stock updated.</response>
        /// <response code="400">Validation failed (see FluentValidation errors).</response>
        /// <response code="403">Authenticated but not an Admin.</response>
        /// <response code="404">No stock with that ID.</response>
        /// <response code="409">Another stock already uses the new symbol.</response>
        [HttpPut("{id:int}")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(typeof(StockDto), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(Microsoft.AspNetCore.Mvc.ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        public async Task<IActionResult> Update(
            [FromRoute] int id,
            [FromBody] UpdateStockRequestDto updateDto
        )
        {
            var conflicting = await _stockRepo.GetBySymbolAsync(updateDto.Symbol);
            if (conflicting != null && conflicting.Id != id)
            {
                return Conflict($"A stock with symbol '{updateDto.Symbol.Trim().ToUpperInvariant()}' already exists.");
            }

            var stockModel = await _stockRepo.UpdateAsync(id, updateDto);

            if (stockModel == null)
            {
                return NotFound();
            }

            return Ok(stockModel.ToStockDto());
        }

        /// <summary>
        /// Delete a stock. Admin only.
        /// </summary>
        /// <remarks>
        /// Cascades: every portfolio position and comment referencing this
        /// stock is deleted along with it (see the FK configuration in
        /// ApplicationDBContext) -- there is no soft-delete or confirmation
        /// step.
        /// </remarks>
        /// <param name="id">Stock ID to delete.</param>
        /// <response code="204">Stock (and its dependent rows) deleted.</response>
        /// <response code="403">Authenticated but not an Admin.</response>
        /// <response code="404">No stock with that ID.</response>
        [HttpDelete("{id:int}")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            var stockModel = await _stockRepo.DeleteAsync(id);

            if (stockModel == null)
            {
                return NotFound();
            }

            return NoContent();
        }

        /// <summary>
        /// Get the fixed list of "trending" stocks the client's market rail shows.
        /// </summary>
        /// <remarks>
        /// Filters the catalog down to a hardcoded set of well-known symbols
        /// (see StockRepository.GetMarketTrendsAsync) -- it is not computed
        /// from price movement or volume. Unlike the other endpoints on this
        /// controller, this returns the Stock domain model directly rather
        /// than StockDto (a pre-existing inconsistency, not new to this pass).
        /// </remarks>
        /// <response code="200">At least one trend stock exists.</response>
        /// <response code="404">None of the trend symbols exist in the database yet.</response>
        [HttpGet("trends")]
        [ProducesResponseType(typeof(List<api.Models.Stock>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetMarketTrends()
        {
            var stocks = await _stockRepo.GetMarketTrendsAsync();

            if (stocks == null || !stocks.Any())
            {
                return NotFound("Trend stocks not found in database.");
            }

            return Ok(stocks);
        }
    }
}
