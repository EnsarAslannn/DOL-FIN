using System.Net;
using System.Text.Json;
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
            Assert.Contains("/api/account/login", body);
        }

        // GenerateDocumentationFile is on and CS1591 is suppressed in
        // api.csproj, so a controller action with no <summary> still compiles
        // clean -- the endpoint just silently shows up in Scalar with no
        // description. This asserts the prose actually reaches the document,
        // which is what the READMEs promise the /scalar page delivers.
        [Fact]
        public async Task OpenApiJson_CarriesXmlDocCommentsAsOperationDescriptions()
        {
            var client = TestClientFactory.CreateHttpsClient(_factory);

            var response = await client.GetAsync("/openapi.json");

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            var body = await response.Content.ReadAsStringAsync();

            using var document = JsonDocument.Parse(body);
            var paths = document.RootElement.GetProperty("paths");

            // A path item can also hold non-operation keys ("parameters",
            // "summary", "servers"), so match on HTTP verbs rather than
            // walking every property.
            string[] httpMethods =
            [
                "get",
                "put",
                "post",
                "delete",
                "options",
                "head",
                "patch",
                "trace",
            ];

            var undocumented = new List<string>();
            var documentedCount = 0;

            foreach (var path in paths.EnumerateObject())
            {
                foreach (var method in httpMethods)
                {
                    if (!path.Value.TryGetProperty(method, out var operation))
                        continue;

                    var hasSummary =
                        operation.TryGetProperty("summary", out var summary)
                        && !string.IsNullOrWhiteSpace(summary.GetString());

                    if (hasSummary)
                        documentedCount++;
                    else
                        undocumented.Add($"{method.ToUpperInvariant()} {path.Name}");
                }
            }

            Assert.True(
                undocumented.Count == 0,
                "Every endpoint needs an XML <summary>. Missing: "
                    + string.Join(", ", undocumented)
            );

            // Guards the assertion above against passing vacuously if the
            // document ever comes back with no operations at all.
            Assert.True(
                documentedCount >= 20,
                $"Expected the full endpoint surface to be documented, found only {documentedCount}."
            );
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
