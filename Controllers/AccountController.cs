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
        public async Task<IActionResult> Logout()
        {
            // Rotating the SecurityStamp invalidates every JWT already issued
            // to this user (see OnTokenValidated in Program.cs), not just the
            // cookie deleted below -- a copy of the token held elsewhere
            // (XSS, shared machine, log leak) stops working immediately.
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
                    // Matches the JWT's own lifetime (TokenService.CreateToken)
                    // so the browser doesn't keep sending an already-expired
                    // token for days after it stops working.
                    Expires = DateTimeOffset.UtcNow.AddHours(4),
                }
            );

            // NOT issuing the CSRF cookie here: this request itself arrives
            // unauthenticated (the access_token cookie only takes effect on
            // the *next* request), and the antiforgery system binds a token
            // to whatever identity was current when it was generated. Doing
            // it here would bind the token to "anonymous", which then fails
            // validation against the now-authenticated user on every
            // subsequent request. The frontend calls GET /account/profile
            // right after login/register, which issues it correctly.
        }

        // The antiforgery system pairs two DIFFERENT token values: an internal
        // cookie token (never exposed to JS) and a "request token" that must
        // be echoed back on mutating requests. GetAndStoreTokens sets the
        // internal cookie as a side effect; we separately expose its
        // RequestToken value in a JS-readable XSRF-TOKEN cookie so the
        // frontend can read it and send it back as the X-CSRF-TOKEN header.
        // Must only be called from a request where HttpContext.User already
        // reflects the authenticated identity (see note on SetAuthCookie).
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
        public async Task<IActionResult> GetUserProfile()
        {
            // A page refresh restores the session from the access_token cookie
            // alone; the XSRF-TOKEN cookie needs re-issuing here too so it
            // survives a full reload.
            IssueCsrfCookie();

            var user = await User.GetAuthenticatedUserAsync(_userManager);
            if (user == null)
                return Unauthorized("User identity context could not be resolved from token claims.");

            return Ok(new { user.WalletBalance, user.UserName, user.Email });
        }
    }
}