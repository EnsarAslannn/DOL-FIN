using api.Dtos.Account;
using api.Extensions;
using api.Interfaces;
using api.Models;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace api.Controllers
{
    [Route("api/account")]
    [ApiController]
    [Produces("application/json")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly ITokenService _tokenService;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly IAntiforgery _antiforgery;

        public AccountController(
            UserManager<AppUser> userManager,
            ITokenService tokenService,
            SignInManager<AppUser> signInManager,
            IAntiforgery antiforgery
        )
        {
            _userManager = userManager;
            _tokenService = tokenService;
            _signInManager = signInManager;
            _antiforgery = antiforgery;
        }

        [HttpPost("login")]
        [EnableRateLimiting("auth")]
        [ProducesResponseType(typeof(NewUserDto), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(Microsoft.AspNetCore.Mvc.ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status429TooManyRequests)]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            var user = await _userManager.FindByNameAsync(loginDto.UserName);

            if (user == null)
                return Unauthorized("Invalid username or password");

            var result = await _signInManager.CheckPasswordSignInAsync(
                user,
                loginDto.Password,
                lockoutOnFailure: true
            );

            if (result.IsLockedOut)
                return Unauthorized("Account is temporarily locked due to too many failed login attempts. Please try again later.");

            if (!result.Succeeded)
                return Unauthorized("Invalid username or password");

            SetAuthCookie(await _tokenService.CreateToken(user));

            return Ok(
                new NewUserDto
                {
                    UserName = user.UserName ?? string.Empty,
                    Email = user.Email ?? string.Empty,
                    WalletBalance = user.WalletBalance
                }
            );
        }

        [HttpPost("register")]
        [EnableRateLimiting("auth")]
        [ProducesResponseType(typeof(NewUserDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status429TooManyRequests)]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            var appUser = new AppUser
            {
                UserName = registerDto.Username!,
                Email = registerDto.Email!,
                WalletBalance = 0
            };

            var createdUser = await _userManager.CreateAsync(appUser, registerDto.Password!);

            if (!createdUser.Succeeded)
                return BadRequest(createdUser.Errors);

            var roleResult = await _userManager.AddToRoleAsync(appUser, "User");

            if (!roleResult.Succeeded)
                return BadRequest(roleResult.Errors);

            SetAuthCookie(await _tokenService.CreateToken(appUser));

            return Ok(
                new NewUserDto
                {
                    UserName = appUser.UserName ?? string.Empty,
                    Email = appUser.Email ?? string.Empty,
                    WalletBalance = appUser.WalletBalance
                }
            );
        }

        [HttpPost("logout")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> Logout()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user != null)
            {
                await _userManager.UpdateSecurityStampAsync(user);
            }

            Response.Cookies.Delete("access_token");
            Response.Cookies.Delete("XSRF-TOKEN");
            Response.Cookies.Delete("af-token");
            return Ok();
        }

        private void SetAuthCookie(string token)
        {
            Response.Cookies.Append(
                "access_token",
                token,
                new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    Expires = DateTimeOffset.UtcNow.AddHours(4),
                }
            );

        }

        private void IssueCsrfCookie()
        {
            var tokens = _antiforgery.GetAndStoreTokens(HttpContext);
            Response.Cookies.Append(
                "XSRF-TOKEN",
                tokens.RequestToken!,
                new CookieOptions
                {
                    HttpOnly = false,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                }
            );
        }

        [HttpGet("profile")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> GetUserProfile()
        {
            IssueCsrfCookie();

            var user = await User.GetAuthenticatedUserAsync(_userManager);
            if (user == null)
                return Unauthorized("User identity context could not be resolved from token claims.");

            return Ok(new { user.WalletBalance, user.UserName, user.Email });
        }
    }
}