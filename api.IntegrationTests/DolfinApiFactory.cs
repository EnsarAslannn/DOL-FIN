using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Testcontainers.PostgreSql;
using Testcontainers.Redis;
using Xunit;

namespace api.IntegrationTests
{
    // Shared across every integration test class via the "Integration" xUnit
    // collection (see IntegrationTestCollection) so the Postgres/Redis
    // containers and the app host are started once per test run, not once
    // per test class.
    public class DolfinApiFactory : WebApplicationFactory<Program>, IAsyncLifetime
    {
        private const string TestJwtSigningKey =
            "integration-test-signing-key-that-is-at-least-64-bytes-long-for-hs512-0000";

        private readonly PostgreSqlContainer _postgres = new PostgreSqlBuilder("postgres:17-alpine").Build();

        private readonly RedisContainer _redis = new RedisBuilder("redis:7-alpine").Build();

        public async Task InitializeAsync()
        {
            await Task.WhenAll(_postgres.StartAsync(), _redis.StartAsync());

            // Program.cs reads several of these directly off builder.Configuration
            // (e.g. the JWT signing key check) *before* WebApplicationBuilder.Build()
            // runs. WebApplicationFactory only splices ConfigureWebHost's
            // ConfigureAppConfiguration callback in at Build() time, which is too
            // late for that early read -- environment variables are the one
            // config source WebApplication.CreateBuilder(args) already loads by
            // the time Program.cs's top-level statements start executing, so they
            // have to be set here, before the host is ever created.
            Environment.SetEnvironmentVariable("ASPNETCORE_ENVIRONMENT", "Testing");
            Environment.SetEnvironmentVariable(
                "ConnectionStrings__DefaultConnection",
                _postgres.GetConnectionString()
            );
            Environment.SetEnvironmentVariable("ConnectionStrings__Redis", _redis.GetConnectionString());
            Environment.SetEnvironmentVariable("JWT__SigningKey", TestJwtSigningKey);
            Environment.SetEnvironmentVariable("JWT__Issuer", "https://dol-fin.com");
            Environment.SetEnvironmentVariable("JWT__Audience", "https://dol-fin.com");
            Environment.SetEnvironmentVariable("Admin__SeedUsername", "");
            // Several tests each register/log in their own throwaway user
            // against one shared host; the production default of 10
            // requests/minute (see Program.cs) would otherwise start
            // rejecting later tests in the run with 429s.
            Environment.SetEnvironmentVariable("RateLimiting__AuthPermitLimit", "1000");
            Environment.SetEnvironmentVariable("RateLimiting__AuthWindowSeconds", "60");
        }

        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.UseEnvironment("Testing");
        }

        async Task IAsyncLifetime.DisposeAsync()
        {
            await _postgres.DisposeAsync();
            await _redis.DisposeAsync();
            await base.DisposeAsync();
        }
    }

    [CollectionDefinition("Integration")]
    public class IntegrationTestCollection : ICollectionFixture<DolfinApiFactory> { }
}
