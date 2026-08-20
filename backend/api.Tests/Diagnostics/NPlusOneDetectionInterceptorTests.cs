using api.Diagnostics;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;
using Npgsql;
using Xunit;

namespace api.Tests.Diagnostics
{
    public class NPlusOneDetectionInterceptorTests
    {
        private static NPlusOneDetectionInterceptor CreateInterceptor(
            Mock<ILogger<NPlusOneDetectionInterceptor>> logger,
            DefaultHttpContext? httpContext,
            int threshold = 3
        )
        {
            var httpContextAccessor = new Mock<IHttpContextAccessor>();
            httpContextAccessor.Setup(a => a.HttpContext).Returns(httpContext);

            var configuration = new ConfigurationBuilder()
                .AddInMemoryCollection(
                    new Dictionary<string, string?>
                    {
                        ["Diagnostics:NPlusOneThreshold"] = threshold.ToString(),
                    }
                )
                .Build();

            return new NPlusOneDetectionInterceptor(
                httpContextAccessor.Object,
                logger.Object,
                configuration
            );
        }

        private static NpgsqlCommand MakeCommand(string sql) => new(sql);

        [Fact]
        public void NormalizeSql_TreatsDifferentLiteralsAsSameShape()
        {
            var a = NPlusOneDetectionInterceptor.NormalizeSql(
                "SELECT * FROM \"Comments\" WHERE \"StockId\" = 1"
            );
            var b = NPlusOneDetectionInterceptor.NormalizeSql(
                "SELECT * FROM \"Comments\" WHERE \"StockId\" = 42"
            );

            Assert.Equal(a, b);
        }

        [Fact]
        public void NormalizeSql_TreatsDifferentStringLiteralsAsSameShape()
        {
            var a = NPlusOneDetectionInterceptor.NormalizeSql(
                "SELECT * FROM \"Stocks\" WHERE \"Symbol\" = 'AAPL'"
            );
            var b = NPlusOneDetectionInterceptor.NormalizeSql(
                "SELECT * FROM \"Stocks\" WHERE \"Symbol\" = 'MSFT'"
            );

            Assert.Equal(a, b);
        }

        [Fact]
        public void Track_LogsWarningExactlyOnceWhenThresholdReached()
        {
            var logger = new Mock<ILogger<NPlusOneDetectionInterceptor>>();
            var httpContext = new DefaultHttpContext();
            var interceptor = CreateInterceptor(logger, httpContext, threshold: 3);

            for (var i = 0; i < 5; i++)
            {
                interceptor.Track(MakeCommand("SELECT * FROM \"Comments\" WHERE \"StockId\" = 1"));
            }

            logger.Verify(
                l =>
                    l.Log(
                        LogLevel.Warning,
                        It.IsAny<EventId>(),
                        It.IsAny<It.IsAnyType>(),
                        null,
                        It.IsAny<Func<It.IsAnyType, Exception?, string>>()
                    ),
                Times.Once
            );
        }

        [Fact]
        public void Track_DoesNotWarnBelowThreshold()
        {
            var logger = new Mock<ILogger<NPlusOneDetectionInterceptor>>();
            var httpContext = new DefaultHttpContext();
            var interceptor = CreateInterceptor(logger, httpContext, threshold: 3);

            interceptor.Track(MakeCommand("SELECT * FROM \"Comments\" WHERE \"StockId\" = 1"));
            interceptor.Track(MakeCommand("SELECT * FROM \"Comments\" WHERE \"StockId\" = 2"));

            logger.Verify(
                l =>
                    l.Log(
                        LogLevel.Warning,
                        It.IsAny<EventId>(),
                        It.IsAny<It.IsAnyType>(),
                        null,
                        It.IsAny<Func<It.IsAnyType, Exception?, string>>()
                    ),
                Times.Never
            );
        }

        [Fact]
        public void Track_NoOpsWhenNoHttpContext()
        {
            var logger = new Mock<ILogger<NPlusOneDetectionInterceptor>>();
            var interceptor = CreateInterceptor(logger, httpContext: null, threshold: 1);

            var exception = Record.Exception(() =>
                interceptor.Track(MakeCommand("SELECT 1"))
            );

            Assert.Null(exception);
            logger.Verify(
                l =>
                    l.Log(
                        LogLevel.Warning,
                        It.IsAny<EventId>(),
                        It.IsAny<It.IsAnyType>(),
                        null,
                        It.IsAny<Func<It.IsAnyType, Exception?, string>>()
                    ),
                Times.Never
            );
        }
    }
}
