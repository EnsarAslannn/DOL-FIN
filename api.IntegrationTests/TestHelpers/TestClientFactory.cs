using Microsoft.AspNetCore.Mvc.Testing;

namespace api.IntegrationTests.TestHelpers
{
    public static class TestClientFactory
    {
        public static HttpClient CreateHttpsClient(DolfinApiFactory factory, params DelegatingHandler[] handlers) =>
            factory.CreateDefaultClient(new Uri("https://localhost"), handlers);
    }
}
