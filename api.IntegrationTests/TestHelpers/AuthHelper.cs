using System.Net.Http.Json;
using api.Dtos.Account;
using api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;

namespace api.IntegrationTests.TestHelpers
{
    public static class AuthHelper
    {
        public const string DefaultPassword = "Str0ng!Passw0rd#";

        // Registers a fresh throwaway user, optionally promotes it to Admin, and
        // returns an HttpClient that is already authenticated (via the
        // access_token cookie Register sets) and carries a valid XSRF-TOKEN/
        // X-CSRF-TOKEN pair for subsequent mutating requests.
        public static async Task<HttpClient> CreateAuthenticatedClientAsync(
            DolfinApiFactory factory,
            bool asAdmin = false
        )
        {
            var username = $"user{Guid.NewGuid():N}"[..20];
            var client = TestClientFactory.CreateHttpsClient(factory, new CookieRelayHandler());

            var registerResponse = await client.PostAsJsonAsync(
                "/api/account/register",
                new RegisterDto
                {
                    Username = username,
                    Email = $"{username}@test.local",
                    Password = DefaultPassword,
                }
            );
            registerResponse.EnsureSuccessStatusCode();

            // GetUserProfile is the only endpoint that issues the XSRF-TOKEN
            // cookie (see AccountController.IssueCsrfCookie) -- this must run
            // before any mutating call below (including the re-login further
            // down), or those will 403/500 on CSRF validation for lacking a
            // token pair to check in the first place.
            var profileResponse = await client.GetAsync("/api/account/profile");
            profileResponse.EnsureSuccessStatusCode();

            if (asAdmin)
            {
                using (var scope = factory.Services.CreateScope())
                {
                    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<AppUser>>();
                    var user = await userManager.FindByNameAsync(username);
                    await userManager.AddToRoleAsync(user!, "Admin");
                }

                // The token from Register above was minted before the role was
                // granted, so it carries no "Admin" claim -- log in again to get
                // one that reflects the current roles (see TokenService.CreateToken).
                var loginResponse = await client.PostAsJsonAsync(
                    "/api/account/login",
                    new LoginDto { UserName = username, Password = DefaultPassword }
                );
                loginResponse.EnsureSuccessStatusCode();
            }

            return client;
        }
    }
}
