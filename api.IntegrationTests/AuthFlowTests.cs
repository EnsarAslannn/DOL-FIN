using System.Net;
using System.Net.Http.Json;
using api.Dtos.Account;
using api.IntegrationTests.TestHelpers;
using Xunit;

namespace api.IntegrationTests
{
    [Collection("Integration")]
    public class AuthFlowTests
    {
        private readonly DolfinApiFactory _factory;

        public AuthFlowTests(DolfinApiFactory factory)
        {
            _factory = factory;
        }

        [Fact]
        public async Task Register_NewUser_ReturnsOkWithZeroBalance()
        {
            var username = $"newuser{Guid.NewGuid():N}"[..20];
            var client = TestClientFactory.CreateHttpsClient(_factory);

            var response = await client.PostAsJsonAsync(
                "/api/account/register",
                new RegisterDto
                {
                    Username = username,
                    Email = $"{username}@test.local",
                    Password = AuthHelper.DefaultPassword,
                }
            );

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            var body = await response.Content.ReadFromJsonAsync<NewUserDto>();
            Assert.NotNull(body);
            Assert.Equal(username, body!.UserName);
            Assert.Equal(0, body.WalletBalance);
        }

        [Fact]
        public async Task Login_WrongPassword_ReturnsUnauthorized()
        {
            var username = $"loginuser{Guid.NewGuid():N}"[..20];
            var registerClient = TestClientFactory.CreateHttpsClient(_factory);
            await registerClient.PostAsJsonAsync(
                "/api/account/register",
                new RegisterDto
                {
                    Username = username,
                    Email = $"{username}@test.local",
                    Password = AuthHelper.DefaultPassword,
                }
            );

            var client = TestClientFactory.CreateHttpsClient(_factory);
            var response = await client.PostAsJsonAsync(
                "/api/account/login",
                new LoginDto { UserName = username, Password = "WrongPassword123!" }
            );

            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public async Task UnauthenticatedRequest_ToProtectedEndpoint_ReturnsUnauthorized()
        {
            var client = TestClientFactory.CreateHttpsClient(_factory);

            var response = await client.GetAsync("/api/portfolio");

            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }
    }
}
