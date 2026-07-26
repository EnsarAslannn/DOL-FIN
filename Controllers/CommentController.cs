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
    [Route("api/comment")]
    [ApiController]
    [Authorize]
    public class CommentController : ControllerBase
    {
        private readonly ICommentRepository _commentRepo;
        private readonly IStockRepository _stockRepo;
        private readonly UserManager<AppUser> _userManager;

        public CommentController(
            ICommentRepository commentRepo,
            IStockRepository stockRepo,
            UserManager<AppUser> userManager
        )
        {
            _commentRepo = commentRepo;
            _stockRepo = stockRepo;
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<IActionResult> GettAll([FromQuery] CommentQueryObject queryObject)
        {
            var comments = await _commentRepo.GettAllAsync(queryObject);
            var commentDto = comments.Select(s => s.ToCommentDto());

            return Ok(commentDto);
        }

        [HttpGet("{id:int}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            var comment = await _commentRepo.GetByIdAsync(id);

            if (comment == null)
            {
                return NotFound();
            }

            return Ok(comment.ToCommentDto());
        }

        [HttpPost("{stockId:int}")]
        public async Task<IActionResult> Create(
            [FromRoute] int stockId,
            [FromBody] CreateCommentDto commentDto
        )
        {
            if (!await _stockRepo.StockExists(stockId))
            {
                return BadRequest("Stock does not exist");
            }

            var appUser = await GetAuthenticatedUserAsync();
            if (appUser == null)
                return Unauthorized("User context not found.");

            var commentModel = commentDto.ToCommentFromCreate(stockId, appUser.Id);
            await _commentRepo.CreateAsync(commentModel);

            return CreatedAtAction(
                nameof(GetById),
                new { id = commentModel.Id },
                commentModel.ToCommentDto()
            );
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(
            [FromRoute] int id,
            [FromBody] UpdateCommentRequestDto updateDto
        )
        {
            var appUser = await GetAuthenticatedUserAsync();
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

            return Ok(comment.ToCommentDto());
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            var appUser = await GetAuthenticatedUserAsync();
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

            return Ok(commentModel);
        }

        private async Task<AppUser?> GetAuthenticatedUserAsync()
        {
            var username = User.GetUsername();
            if (string.IsNullOrEmpty(username))
                return null;

            return await _userManager.FindByNameAsync(username);
        }
    }
}
