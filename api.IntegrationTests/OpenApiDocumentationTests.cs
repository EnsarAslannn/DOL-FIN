using System.Net;
using api.IntegrationTests.TestHelpers;
using Xunit;

namespace api.IntegrationTests
{
    [Collection("Integration")]
    public class OpenApiDocumentationTests
    {
        private readonly DolfinApiFactory _factory;

        public OpenApiDocumentationTests(DolfinApiFactory factory)
        {
            _factory = factory;
        }

        [Fact]
        public async Task OpenApiJson_IsLiveGeneratedAndDescribesRealRoutes()
        {
            var client = TestClientFactory.CreateHttpsClient(_factory);

            var response = await client.GetAsync("/openapi.json");

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            var body = await response.Content.ReadAsStringAsync();

            Assert.Contains("/api/alerts", body);
            Assert.Contains("/api/portfolio/metrics", body);
            Assert.Contains("Log in with a username and password", body);
        }

        [Fact]
        public async Task ScalarUi_LoadsSuccessfully()
        {
            var client = TestClientFactory.CreateHttpsClient(_factory);

            var response = await client.GetAsync("/scalar/v1");

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            var body = await response.Content.ReadAsStringAsync();
            Assert.Contains("DOLFIN API", body);
        }
    }
}
