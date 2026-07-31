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
    /// <summary>
    /// Registration, login/logout, and the current user's profile.
    /// </summary>
    /// <remarks>
    /// Authentication is cookie-based, not a Bearer token returned in the
    /// response body: Login/Register set an httpOnly <c>access_token</c>
    /// cookie (a short-lived JWT) that subsequent requests send
    /// automatically. Mutating requests made after that also require an
    /// <c>X-CSRF-TOKEN</c> header matching the <c>XSRF-TOKEN</c> cookie,
    /// which <see cref="GetUserProfile"/> is responsible for issuing -- call
    /// it once right after login/register before making any POST/PUT/DELETE.
    /// </remarks>
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

        /// <summary>
        /// Log in with a username and password.
        /// </summary>
        /// <remarks>
        /// On success, sets an httpOnly <c>access_token</c> cookie (a JWT
        /// valid for 4 hours) -- the token is not returned in the response
        /// body. Five failed attempts within the lockout window locks the
        /// account for 15 minutes (see Program.cs's Identity.Lockout
        /// options); a locked-out account also gets 401, just with a
        /// different message, not a distinct status code.
        ///
        /// Sample request:
        ///
        ///     POST /api/account/login
        ///     { "userName": "trader1", "password": "Str0ng!Passw0rd#" }
        ///
        /// Sample response body:
        ///
        ///     { "userName": "trader1", "email": "trader1@example.com", "walletBalance": 1000.00 }
        /// </remarks>
        /// <response code="200">Login succeeded; access_token cookie set.</response>
        /// <response code="400">userName or password missing (see FluentValidation errors).</response>
        /// <response code="401">Unknown username, wrong password, or account locked out.</response>
        /// <response code="429">Too many login attempts from this client in the current window.</response>
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

        /// <summary>
        /// Register a new user and log them in immediately.
        /// </summary>
        /// <remarks>
        /// Every new account starts in the "User" role with a $0 wallet
        /// balance, and gets the same access_token cookie a subsequent Login
        /// would set. Password complexity (12+ chars, upper/lower/digit/
        /// symbol) is enforced by ASP.NET Core Identity, not this endpoint --
        /// a weak password fails with Identity's own error codes, not
        /// FluentValidation's.
        ///
        /// Sample request:
        ///
        ///     POST /api/account/register
        ///     {
        ///        "username": "trader1",
        ///        "email": "trader1@example.com",
        ///        "password": "Str0ng!Passw0rd#"
        ///     }
        ///
        /// Sample response body:
        ///
        ///     { "userName": "trader1", "email": "trader1@example.com", "walletBalance": 0 }
        /// </remarks>
        /// <response code="200">Account created; access_token cookie set.</response>
        /// <response code="400">
        /// Invalid input. Either a FluentValidation ValidationProblemDetails
        /// (empty username, malformed email, empty password) or a plain list
        /// of Identity errors (username taken, password fails complexity
        /// rules) depending on which check rejected it.
        /// </response>
        /// <response code="429">Too many registration attempts from this client in the current window.</response>
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

        /// <summary>
        /// Log out and revoke every token issued to the current user.
        /// </summary>
        /// <remarks>
        /// Rotates the user's SecurityStamp, which immediately invalidates
        /// every JWT already issued to them (checked on every request via
        /// OnTokenValidated in Program.cs) -- not just the cookie this
        /// request clears. A copy of the token held elsewhere (XSS, a shared
        /// machine, a log line) stops working right away.
        /// </remarks>
        /// <response code="200">Logged out; all cookies cleared and tokens revoked.</response>
        /// <response code="401">Not authenticated.</response>
        [HttpPost("logout")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
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

        /// <summary>
        /// Get the current user's profile, and (re)issue the CSRF cookie.
        /// </summary>
        /// <remarks>
        /// This is the only endpoint that issues the XSRF-TOKEN cookie the
        /// CSRF middleware requires on every authenticated mutating request
        /// -- call it once right after login/register (and again after a
        /// page reload, since a refresh restores the session from the
        /// access_token cookie alone) before making any POST/PUT/DELETE.
        ///
        /// Sample response body:
        ///
        ///     { "walletBalance": 1000.00, "userName": "trader1", "email": "trader1@example.com" }
        /// </remarks>
        /// <response code="200">Profile returned; XSRF-TOKEN cookie (re)issued.</response>
        /// <response code="401">Not authenticated, or the identity in the token no longer resolves to a user.</response>
        [HttpGet("profile")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
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