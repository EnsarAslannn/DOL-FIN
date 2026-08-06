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
