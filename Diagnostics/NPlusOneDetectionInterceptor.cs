using System.Data.Common;
using System.Text.RegularExpressions;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace api.Diagnostics
{
    // Development-only: tracks how many times each normalized SQL shape runs
    // within a single HTTP request and logs a warning once it looks like an
    // N+1 pattern (same query re-issued per row instead of via .Include()).
    public class NPlusOneDetectionInterceptor : DbCommandInterceptor
    {
        private const string CountsKey = "NPlusOne.Counts";
        private const string WarnedKey = "NPlusOne.Warned";

        private static readonly Regex WhitespaceRegex = new(@"\s+", RegexOptions.Compiled);
        private static readonly Regex StringLiteralRegex = new(@"'[^']*'", RegexOptions.Compiled);
        private static readonly Regex NumericLiteralRegex = new(
            @"(?<![\w@])\b\d+\b",
            RegexOptions.Compiled
        );

        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ILogger<NPlusOneDetectionInterceptor> _logger;
        private readonly int _threshold;

        public NPlusOneDetectionInterceptor(
            IHttpContextAccessor httpContextAccessor,
            ILogger<NPlusOneDetectionInterceptor> logger,
            IConfiguration configuration
        )
        {
            _httpContextAccessor = httpContextAccessor;
            _logger = logger;
            _threshold = configuration.GetValue("Diagnostics:NPlusOneThreshold", 3);
        }

        public override InterceptionResult<DbDataReader> ReaderExecuting(
            DbCommand command,
            CommandEventData eventData,
            InterceptionResult<DbDataReader> result
        )
        {
            Track(command);
            return base.ReaderExecuting(command, eventData, result);
        }

        public override ValueTask<InterceptionResult<DbDataReader>> ReaderExecutingAsync(
            DbCommand command,
            CommandEventData eventData,
            InterceptionResult<DbDataReader> result,
            CancellationToken cancellationToken = default
        )
        {
            Track(command);
            return base.ReaderExecutingAsync(command, eventData, result, cancellationToken);
        }

        // internal (not private) so unit tests can drive it directly without
        // having to construct a real EF Core CommandEventData.
        internal void Track(DbCommand command)
        {
            var httpContext = _httpContextAccessor.HttpContext;
            // No HttpContext during startup (e.g. db.Database.Migrate()) -- not a real request.
            if (httpContext is null)
                return;

            var normalized = NormalizeSql(command.CommandText);

            if (httpContext.Items[CountsKey] is not Dictionary<string, int> counts)
            {
                counts = new Dictionary<string, int>();
                httpContext.Items[CountsKey] = counts;
            }

            counts[normalized] = counts.GetValueOrDefault(normalized) + 1;

            if (counts[normalized] != _threshold)
                return;

            if (httpContext.Items[WarnedKey] is not HashSet<string> warned)
            {
                warned = new HashSet<string>();
                httpContext.Items[WarnedKey] = warned;
            }

            if (warned.Add(normalized))
            {
                _logger.LogWarning(
                    "Potential N+1 query pattern: same query shape executed {Threshold}+ times in one request. {Method} {Path}. SQL: {Sql}",
                    _threshold,
                    httpContext.Request.Method,
                    httpContext.Request.Path,
                    Truncate(normalized, 500)
                );
            }
        }

        internal static string NormalizeSql(string sql)
        {
            var normalized = WhitespaceRegex.Replace(sql.Trim(), " ");
            normalized = StringLiteralRegex.Replace(normalized, "'?'");
            normalized = NumericLiteralRegex.Replace(normalized, "?");
            return normalized;
        }

        private static string Truncate(string value, int maxLength) =>
            value.Length <= maxLength ? value : value[..maxLength] + "...";
    }
}
