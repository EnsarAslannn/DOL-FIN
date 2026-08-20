using System.Net;
using api.IntegrationTests.TestHelpers;
using Xunit;

namespace api.IntegrationTests
{
    [Collection("Integration")]
    public class HealthCheckTests
    {
        private readonly DolfinApiFactory _factory;

        public HealthCheckTests(DolfinApiFactory factory)
        {
            _factory = factory;
        }

        [Fact]
        public async Task Health_WithRealPostgresAndRedis_ReturnsHealthy()
        {
            var client = TestClientFactory.CreateHttpsClient(_factory);

            var response = await client.GetAsync("/health");

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            Assert.Equal("Healthy", await response.Content.ReadAsStringAsync());
        }

        [Fact]
        public async Task Health_IsReachableWithoutAuthentication()
        {
            var client = TestClientFactory.CreateHttpsClient(_factory);

            var response = await client.GetAsync("/health");

            Assert.NotEqual(HttpStatusCode.Unauthorized, response.StatusCode);
            Assert.NotEqual(HttpStatusCode.Forbidden, response.StatusCode);
        }
    }
}
