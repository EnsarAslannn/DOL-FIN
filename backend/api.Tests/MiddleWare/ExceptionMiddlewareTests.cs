using System.Text.Json;
using api.Middleware;
using api.Models;
using FluentValidation;
using FluentValidation.Results;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace api.Tests.MiddleWare
{
    public class ExceptionMiddlewareTests
    {
        private static readonly JsonSerializerOptions JsonOptions =
            new() { PropertyNameCaseInsensitive = true };

        private static (ExceptionMiddleware middleware, DefaultHttpContext context) Build(
            RequestDelegate next,
            string environmentName
        )
        {
            var env = new Mock<IHostEnvironment>();
            env.Setup(e => e.EnvironmentName).Returns(environmentName);

            var middleware = new ExceptionMiddleware(
                next,
                new Mock<ILogger<ExceptionMiddleware>>().Object,
                env.Object
            );

            var context = new DefaultHttpContext { Response = { Body = new MemoryStream() } };
            return (middleware, context);
        }

        private static async Task<string> ReadBodyAsync(DefaultHttpContext context)
        {
            context.Response.Body.Seek(0, SeekOrigin.Begin);
            using var reader = new StreamReader(context.Response.Body);
            return await reader.ReadToEndAsync();
        }

        [Fact]
        public async Task InvokeAsync_NoException_PassesThroughUntouched()
        {
            var (middleware, context) = Build(_ => Task.CompletedTask, Environments.Production);

            await middleware.InvokeAsync(context);

            Assert.Equal(StatusCodes.Status200OK, context.Response.StatusCode);
        }

        [Fact]
        public async Task InvokeAsync_UnhandledExceptionInProduction_HidesExceptionDetails()
        {
            RequestDelegate next = _ => throw new InvalidOperationException(
                "connection string contains a password"
            );
            var (middleware, context) = Build(next, Environments.Production);

            await middleware.InvokeAsync(context);

            Assert.Equal(StatusCodes.Status500InternalServerError, context.Response.StatusCode);
            var body = await ReadBodyAsync(context);
            var response = JsonSerializer.Deserialize<ExceptionResponse>(body, JsonOptions);

            Assert.Equal("An internal server error occurred.", response!.Message);
            Assert.DoesNotContain("password", body);
        }

        [Fact]
        public async Task InvokeAsync_UnhandledExceptionInDevelopment_IncludesExceptionMessage()
        {
            RequestDelegate next = _ => throw new InvalidOperationException("boom, exact cause");
            var (middleware, context) = Build(next, Environments.Development);

            await middleware.InvokeAsync(context);

            Assert.Equal(StatusCodes.Status500InternalServerError, context.Response.StatusCode);
            var body = await ReadBodyAsync(context);
            var response = JsonSerializer.Deserialize<ExceptionResponse>(body, JsonOptions);

            Assert.Equal("boom, exact cause", response!.Message);
        }

        [Fact]
        public async Task InvokeAsync_ValidationException_ReturnsBadRequestWithFieldErrors()
        {
            var failures = new[] { new ValidationFailure("Email", "Email is required") };
            RequestDelegate next = _ => throw new ValidationException(failures);
            var (middleware, context) = Build(next, Environments.Production);

            await middleware.InvokeAsync(context);

            Assert.Equal(StatusCodes.Status400BadRequest, context.Response.StatusCode);
            var body = await ReadBodyAsync(context);
            var problem = JsonSerializer.Deserialize<ValidationProblemDetails>(body, JsonOptions);

            Assert.Equal(StatusCodes.Status400BadRequest, problem!.Status);
            Assert.Contains("Email", problem.Errors.Keys);
            Assert.Contains("Email is required", problem.Errors["Email"]);
        }
    }
}
