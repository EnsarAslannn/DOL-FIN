using api.Dtos.Comment;
using api.Extensions;
using api.Helpers;
using api.Interfaces;
using api.Mappers;
using api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    /// <summary>
    /// Comments on stocks.
    /// </summary>
    /// <remarks>
    /// Only the comment's own author can update or delete it; everyone else
    /// gets 403, not 404, so ownership is distinguishable from "doesn't exist"
    /// (see Update/Delete below). Create/Update/Delete require the
    /// X-CSRF-TOKEN header described on AccountController.GetUserProfile.
    /// </remarks>
    [Route("api/comment")]
    [ApiController]
    [Authorize]
    [Produces("application/json")]
    public class CommentController : ControllerBase
    {
        private readonly ICommentRepository _commentRepo;
        private readonly IStockRepository _stockRepo;
        private readonly IStockCacheInvalidator _stockCacheInvalidator;
        private readonly UserManager<AppUser> _userManager;

        public CommentController(
            ICommentRepository commentRepo,
            IStockRepository stockRepo,
            IStockCacheInvalidator stockCacheInvalidator,
            UserManager<AppUser> userManager
        )
        {
            _commentRepo = commentRepo;
            _stockRepo = stockRepo;
            _stockCacheInvalidator = stockCacheInvalidator;
            _userManager = userManager;
        }

        /// <summary>
        /// List comments, with optional filtering, sorting, and pagination.
        /// </summary>
        /// <param name="queryObject">Filter, sort, and pagination parameters.</param>
        /// <response code="200">A page of comments (possibly empty).</response>
        /// <response code="400">pageNumber &lt; 1 or pageSize outside 1-100.</response>
        /// <response code="401">Not authenticated.</response>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<CommentDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(Microsoft.AspNetCore.Mvc.ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> GettAll([FromQuery] CommentQueryObject queryObject)
        {
            var comments = await _commentRepo.GettAllAsync(queryObject);
            var commentDto = comments.Select(s => s.ToCommentDto());

            return Ok(commentDto);
        }

        /// <summary>
        /// Get a single comment by ID. No authentication required.
        /// </summary>
        /// <param name="id">Comment ID.</param>
        /// <response code="200">Comment found.</response>
        /// <response code="404">No comment with that ID.</response>
        [HttpGet("{id:int}")]
        [AllowAnonymous]
        [ProducesResponseType(typeof(CommentDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            var comment = await _commentRepo.GetByIdAsync(id);

            if (comment == null)
            {
                return NotFound();
            }

            return Ok(comment.ToCommentDto());
        }

        /// <summary>
        /// Post a new comment on a stock.
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///
        ///     POST /api/comment/1
        ///     { "title": "Great buy", "content": "This stock looks promising." }
        /// </remarks>
        /// <param name="stockId">Stock to comment on.</param>
        /// <param name="commentDto">Title and content (both 5-280 characters).</param>
        /// <response code="201">Comment created.</response>
        /// <response code="400">Stock does not exist, or title/content fails validation.</response>
        /// <response code="401">Not authenticated.</response>
        [HttpPost("{stockId:int}")]
        [ProducesResponseType(typeof(CommentDto), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> Create(
            [FromRoute] int stockId,
            [FromBody] CreateCommentDto commentDto
        )
        {
            if (!await _stockRepo.StockExists(stockId))
            {
                return BadRequest("Stock does not exist");
            }

            var appUser = await User.GetAuthenticatedUserAsync(_userManager);
            if (appUser == null)
                return Unauthorized("User context not found.");

            var commentModel = commentDto.ToCommentFromCreate(stockId, appUser.Id);
            await _commentRepo.CreateAsync(commentModel);
            await _stockCacheInvalidator.InvalidateStockAsync(stockId);

            return CreatedAtAction(
                nameof(GetById),
                new { id = commentModel.Id },
                commentModel.ToCommentDto()
            );
        }

        /// <summary>
        /// Update a comment's title and content. Author only.
        /// </summary>
        /// <param name="id">Comment ID to update.</param>
        /// <param name="updateDto">New title and content (both 5-280 characters).</param>
        /// <response code="200">Comment updated.</response>
        /// <response code="400">Title/content fails validation.</response>
        /// <response code="401">Not authenticated.</response>
        /// <response code="403">Authenticated as a different user than the comment's author.</response>
        /// <response code="404">No comment with that ID.</response>
        [HttpPut("{id:int}")]
        [ProducesResponseType(typeof(CommentDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Update(
            [FromRoute] int id,
            [FromBody] UpdateCommentRequestDto updateDto
        )
        {
            var appUser = await User.GetAuthenticatedUserAsync(_userManager);
            if (appUser == null)
                return Unauthorized("User context not found.");

            var existingComment = await _commentRepo.GetByIdAsync(id);
            if (existingComment == null)
            {
                return NotFound("Comment not found");
            }
            if (existingComment.AppUserId != appUser.Id)
            {
                return Forbid();
            }

            var comment = await _commentRepo.UpdateAsync(
                id,
                updateDto.ToCommentFromUpdate(appUser.Id)
            );

            if (comment == null)
            {
                return NotFound("Comment not found");
            }

            if (existingComment.StockId.HasValue)
            {
                await _stockCacheInvalidator.InvalidateStockAsync(existingComment.StockId.Value);
            }

            return Ok(comment.ToCommentDto());
        }

        /// <summary>
        /// Delete a comment. Author only.
        /// </summary>
        /// <remarks>
        /// Unlike the other actions on this controller, the response body on
        /// success is the raw Comment domain model, not CommentDto (a
        /// pre-existing inconsistency, not new to this pass).
        /// </remarks>
        /// <param name="id">Comment ID to delete.</param>
        /// <response code="200">Comment deleted.</response>
        /// <response code="401">Not authenticated.</response>
        /// <response code="403">Authenticated as a different user than the comment's author.</response>
        /// <response code="404">No comment with that ID.</response>
        [HttpDelete("{id:int}")]
        [ProducesResponseType(typeof(api.Models.Comment), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            var appUser = await User.GetAuthenticatedUserAsync(_userManager);
            if (appUser == null)
                return Unauthorized("User context not found.");

            var existingComment = await _commentRepo.GetByIdAsync(id);
            if (existingComment == null)
            {
                return NotFound("Comment does not exist");
            }
            if (existingComment.AppUserId != appUser.Id)
            {
                return Forbid();
            }

            var commentModel = await _commentRepo.DeleteAsync(id);

            if (commentModel == null)
            {
                return NotFound("Comment does not exist");
            }

            if (existingComment.StockId.HasValue)
            {
                await _stockCacheInvalidator.InvalidateStockAsync(existingComment.StockId.Value);
            }

            return Ok(commentModel);
        }
    }
}
