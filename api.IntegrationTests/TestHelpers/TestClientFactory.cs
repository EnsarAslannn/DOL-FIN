using Microsoft.AspNetCore.Mvc.Testing;

namespace api.IntegrationTests.TestHelpers
{
    public static class TestClientFactory
    {
        // Program.cs's antiforgery options set Cookie.SecurePolicy = Always, and
        // the CSRF middleware's ValidateRequestAsync hard-throws (not just
        // fails validation) if the request scheme isn't SSL. The default
        // WebApplicationFactory client base address is http://localhost, which
        // trips that check on the very first authenticated mutating request --
        // every integration test client needs the https base address instead,
        // even ones that never touch CSRF, to keep this consistent everywhere.
        public static HttpClient CreateHttpsClient(DolfinApiFactory factory, params DelegatingHandler[] handlers) =>
            factory.CreateDefaultClient(new Uri("https://localhost"), handlers);
    }
}
