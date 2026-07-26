using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using api.Models;
using api.Service;
using api.Tests.TestHelpers;
using Microsoft.Extensions.Configuration;
using Moq;
using Xunit;

namespace api.Tests.Service
{
    public class TokenServiceTests
    {
        private static IConfiguration BuildConfig()
        {
            var settings = new Dictionary<string, string?>
            {
                ["JWT:SigningKey"] =
                    "test-signing-key-at-least-64-bytes-loooooooooooooooooooooooooooooooooooong",
                ["JWT:Issuer"] = "https://dol-fin.com",
                ["JWT:Audience"] = "https://dol-fin.com",
            };
            return new ConfigurationBuilder().AddInMemoryCollection(settings).Build();
        }

        [Fact]
        public async Task CreateToken_IncludesAllUserRoles()
        {
            var user = new AppUser { Id = "u1", UserName = "admin1", Email = "admin1@test.com" };
            var userManager = MockUserManager.Create();
            userManager
                .Setup(u => u.GetRolesAsync(It.IsAny<AppUser>()))
                .ReturnsAsync(new List<string> { "User", "Admin" });

            var tokenService = new TokenService(BuildConfig(), userManager.Object);

            var jwt = await tokenService.CreateToken(user);

            var roleClaims = ReadRoleClaims(jwt);
            Assert.Contains("User", roleClaims);
            Assert.Contains("Admin", roleClaims);
        }

        [Fact]
        public async Task CreateToken_WithNoRoles_HasNoRoleClaims()
        {
            var user = new AppUser { Id = "u2", UserName = "plain", Email = "plain@test.com" };
            var userManager = MockUserManager.Create();
            userManager.Setup(u => u.GetRolesAsync(user)).ReturnsAsync(new List<string>());

            var tokenService = new TokenService(BuildConfig(), userManager.Object);

            var jwt = await tokenService.CreateToken(user);

            Assert.Empty(ReadRoleClaims(jwt));
        }

        private static List<string> ReadRoleClaims(string jwt)
        {
            // JwtSecurityTokenHandler writes ClaimTypes.Role using the short
            // outbound JWT claim name "role"; ReadJwtToken returns raw (unmapped)
            // claim types, so we must match on "role" here, not ClaimTypes.Role.
            var token = new JwtSecurityTokenHandler().ReadJwtToken(jwt);
            return token
                .Claims.Where(c => c.Type == "role")
                .Select(c => c.Value)
                .ToList();
        }
    }
}
