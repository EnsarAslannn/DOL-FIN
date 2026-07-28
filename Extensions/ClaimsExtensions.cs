using System.Security.Claims;
using api.Models;
using Microsoft.AspNetCore.Identity;

namespace api.Extensions
{
    public static class ClaimsExtensions
    {
        // Single source of truth for resolving the AppUser behind a
        // ClaimsPrincipal. Previously AccountController, PortfolioController
        // and CommentController each re-implemented this with slightly
        // different (and, for CommentController, weaker) fallback chains --
        // a future auth-scheme change had three divergent places to update.
        public static async Task<AppUser?> GetAuthenticatedUserAsync(
            this ClaimsPrincipal user,
            UserManager<AppUser> userManager
        )
        {
            var username = user.Identity?.Name
                ?? user.FindFirst(ClaimTypes.Name)?.Value
                ?? user.FindFirst("name")?.Value
                ?? user.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name")?.Value;

            if (!string.IsNullOrEmpty(username))
            {
                return await userManager.FindByNameAsync(username);
            }

            var userId = user.FindFirst(ClaimTypes.NameIdentifier)?.Value
                ?? user.FindFirst("sub")?.Value
                ?? user.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")?.Value;

            if (!string.IsNullOrEmpty(userId))
            {
                return await userManager.FindByIdAsync(userId);
            }

            return null;
        }
    }
}
