namespace api.IntegrationTests.TestHelpers
{
    public sealed class CookieRelayHandler : DelegatingHandler
    {
        private readonly Dictionary<string, string> _cookies = new(StringComparer.OrdinalIgnoreCase);

        protected override async Task<HttpResponseMessage> SendAsync(
            HttpRequestMessage request,
            CancellationToken cancellationToken
        )
        {
            if (_cookies.Count > 0)
            {
                request.Headers.Remove("Cookie");
                request.Headers.Add(
                    "Cookie",
                    string.Join("; ", _cookies.Select(kv => $"{kv.Key}={kv.Value}"))
                );

                if (_cookies.TryGetValue("XSRF-TOKEN", out var xsrfToken))
                {
                    request.Headers.Remove("X-CSRF-TOKEN");
                    request.Headers.Add("X-CSRF-TOKEN", Uri.UnescapeDataString(xsrfToken));
                }
            }

            var response = await base.SendAsync(request, cancellationToken);

            if (response.Headers.TryGetValues("Set-Cookie", out var setCookieHeaders))
            {
                foreach (var header in setCookieHeaders)
                {
                    var nameValue = header.Split(';', 2)[0];
                    var parts = nameValue.Split('=', 2);
                    if (parts.Length == 2)
                    {
                        _cookies[parts[0].Trim()] = parts[1].Trim();
                    }
                }
            }

            return response;
        }
    }
}
