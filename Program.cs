using System.Security.Claims;
using System.Text;
using api.Caching;
using api.Data;
using api.Diagnostics;
using api.Interfaces;
using api.Models;
using api.Repository;
using api.Service;
using api.Validation;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.DataProtection.EntityFrameworkCore;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .MinimumLevel.Override("Microsoft", Serilog.Events.LogEventLevel.Warning)
    .MinimumLevel.Override("Microsoft.AspNetCore", Serilog.Events.LogEventLevel.Warning)
    .WriteTo.Console()
    .WriteTo.File("Logs/dolfin-log-.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();

builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "DolfinCorsPolicy",
        policy =>
        {
            policy.WithOrigins(
                    "https://www.dol-fin.com",
                    "https://dol-fin.com",
                    "https://ensaraslannn.github.io",
                    "http://localhost:5173",
                    "http://localhost:3000",
                    "https://localhost:7109",
                    "http://localhost:5002"
                )
                .WithMethods("GET", "POST", "PUT", "DELETE")
                .WithHeaders("Content-Type", "X-CSRF-TOKEN")
                .AllowCredentials();
        }
    );
});


builder
    .Services.AddControllers(options =>
    {
        options.Filters.Add<ValidationActionFilter>();
    })
    .AddNewtonsoftJson(options =>
    {
        options.SerializerSettings.ReferenceLoopHandling = Newtonsoft
            .Json
            .ReferenceLoopHandling
            .Ignore;
        // Without this, PriceAlert.Condition (and any future enum) serializes
        // as its underlying int -- fine for the app's own client, but an
        // opaque, renumbering-fragile contract for anyone else calling the API.
        options.SerializerSettings.Converters.Add(
            new Newtonsoft.Json.Converters.StringEnumConverter()
        );
    });

// ValidationActionFilter is the single validation gate now (see
// api/Validation/), so the built-in DataAnnotations-driven 400 must be
// suppressed -- it runs before any custom action filter and would otherwise
// win first with its own (differently-shaped) response, making the
// FluentValidation errors below unreachable.
builder.Services.Configure<Microsoft.AspNetCore.Mvc.ApiBehaviorOptions>(options =>
{
    options.SuppressModelStateInvalidFilter = true;
});

builder.Services.AddValidatorsFromAssemblyContaining<Program>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi(options =>
{
    options.AddDocumentTransformer(
        (document, _, _) =>
        {
            document.Info = new Microsoft.OpenApi.OpenApiInfo
            {
                Title = "DOLFIN API",
                Version = "v1",
                Description =
                    "Portfolio management API: stock catalog, user portfolios, trading, price alerts, and portfolio analytics.",
            };
            document.Servers =
            [
                new Microsoft.OpenApi.OpenApiServer
                {
                    Url = "https://api-production-a1b64.up.railway.app",
                    Description = "Production (Railway)",
                },
                new Microsoft.OpenApi.OpenApiServer
                {
                    Url = "http://localhost:5002",
                    Description = "Local development",
                },
            ];
            return Task.CompletedTask;
        }
    );
});

void ConfigureCommon(DbContextOptionsBuilder options)
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
    options.ConfigureWarnings(warnings =>
        warnings.Ignore(
            Microsoft.EntityFrameworkCore.Diagnostics.RelationalEventId.PendingModelChangesWarning
        )
    );
}

if (builder.Environment.IsDevelopment())
{
    // N+1 detection interceptor is Development-only: resolving it from DI
    // requires the (sp, options) AddDbContext overload, which rebuilds
    // DbContextOptions per scope instead of once -- a small overhead we don't
    // want leaking into Staging/Production, so those keep the plain overload.
    builder.Services.AddHttpContextAccessor();
    builder.Services.AddSingleton<NPlusOneDetectionInterceptor>();
    builder.Services.AddDbContext<ApplicationDBContext>(
        (sp, options) =>
        {
            ConfigureCommon(options);
            options.AddInterceptors(sp.GetRequiredService<NPlusOneDetectionInterceptor>());
        }
    );
}
else
{
    builder.Services.AddDbContext<ApplicationDBContext>(ConfigureCommon);
}

var redisConnectionString = builder.Configuration.GetConnectionString("Redis");

// Default StackExchange.Redis retry/timeout settings can keep a command
// retrying for 15-20+ seconds before giving up when Redis is unreachable --
// far too slow for a cache that's supposed to be an optional accelerator.
// Fail fast so CachedStockRepository's/CachedCommentRepository's/
// PortfolioService's try/catch fallback to the DB kicks in quickly instead
// of hanging the request. Shared by AddStackExchangeRedisCache and the
// IConnectionMultiplexer registered below so both talk to Redis with
// identical settings instead of two configurations quietly drifting apart.
StackExchange.Redis.ConfigurationOptions? BuildRedisConfigurationOptions()
{
    if (string.IsNullOrWhiteSpace(redisConnectionString))
        return null;

    var configurationOptions = StackExchange.Redis.ConfigurationOptions.Parse(redisConnectionString);
    configurationOptions.ConnectTimeout = 1000;
    configurationOptions.ConnectRetry = 1;
    configurationOptions.SyncTimeout = 1000;
    configurationOptions.AsyncTimeout = 1000;
    configurationOptions.AbortOnConnectFail = false;
    // StackExchange.Redis blocks INFO/KEYS (and other server-management
    // commands) by default as a safety gate against accidentally running
    // them against production -- DiagnosticsController.GetRedisInfo needs
    // both. The cache connection never issues either, so enabling this
    // process-wide is harmless for it.
    configurationOptions.AllowAdmin = true;
    return configurationOptions;
}

builder.Services.AddStackExchangeRedisCache(options =>
{
    var configurationOptions = BuildRedisConfigurationOptions();
    if (configurationOptions != null)
    {
        options.ConfigurationOptions = configurationOptions;
    }
    options.InstanceName = "dolfin:";
});

if (!string.IsNullOrWhiteSpace(redisConnectionString))
{
    // Used by DiagnosticsController's redis-info endpoint to report live
    // server stats (memory, connected clients, ops/sec) -- StackExchangeRedisCache
    // above manages its own internal connection and doesn't expose one for this.
    builder.Services.AddSingleton<StackExchange.Redis.IConnectionMultiplexer>(_ =>
        StackExchange.Redis.ConnectionMultiplexer.Connect(BuildRedisConfigurationOptions()!)
    );
}

builder.Services.AddHybridCache(options =>
{
    options.DefaultEntryOptions = new Microsoft.Extensions.Caching.Hybrid.HybridCacheEntryOptions
    {
        Expiration = TimeSpan.FromMinutes(5),
        LocalCacheExpiration = TimeSpan.FromSeconds(30),
    };
});

var healthChecksBuilder = builder
    .Services.AddHealthChecks()
    .AddNpgSql(
        builder.Configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("DefaultConnection is missing in configuration!"),
        name: "postgres"
    );

if (!string.IsNullOrWhiteSpace(redisConnectionString))
{
    // Redis is an optional accelerator here, not a hard dependency --
    // CachedStockRepository, CachedCommentRepository, and PortfolioService
    // already fall back to direct DB reads if it's unreachable (see their
    // try/catch blocks). Reporting a Redis outage as Degraded rather than
    // Unhealthy keeps Railway from restarting/routing away from an instance
    // that's still fully able to serve requests, just without the cache.
    healthChecksBuilder.AddRedis(
        redisConnectionString,
        name: "redis",
        failureStatus: Microsoft.Extensions.Diagnostics.HealthChecks.HealthStatus.Degraded
    );
}

var jwtSigningKeyBytes = Encoding.UTF8.GetBytes(
    builder.Configuration["JWT:SigningKey"]
        ?? throw new InvalidOperationException("JWT SigningKey is missing in configuration!")
);

// HS512 needs a key at least as long as its output (64 bytes) to deliver its
// full security margin -- a shorter key would still "work" but produces
// forgeable-in-practice signatures. Fail fast at startup rather than
// silently accepting a weak key.
if (jwtSigningKeyBytes.Length < 64)
{
    throw new InvalidOperationException(
        "JWT SigningKey must be at least 64 bytes (512 bits) long for HS512."
    );
}

builder
    .Services.AddIdentity<AppUser, IdentityRole>(options =>
    {
        options.Password.RequireDigit = true;
        options.Password.RequireLowercase = true;
        options.Password.RequireUppercase = true;
        options.Password.RequireNonAlphanumeric = true;
        options.Password.RequiredLength = 12;

        options.Lockout.MaxFailedAccessAttempts = 5;
        options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15);
        options.Lockout.AllowedForNewUsers = true;
    })
    .AddEntityFrameworkStores<ApplicationDBContext>();

builder
    .Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme =
            options.DefaultChallengeScheme =
            options.DefaultForbidScheme =
            options.DefaultScheme =
            options.DefaultSignInScheme =
            options.DefaultSignOutScheme =
                JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["JWT:Issuer"],
            ValidateAudience = true,
            ValidAudience = builder.Configuration["JWT:Audience"],
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(jwtSigningKeyBytes),
            ClockSkew = TimeSpan.Zero
        };
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                if (string.IsNullOrEmpty(context.Token) &&
                    context.Request.Cookies.TryGetValue("access_token", out var cookieToken))
                {
                    context.Token = cookieToken;
                }
                return Task.CompletedTask;
            },
            // Tokens carry the user's SecurityStamp as it was at issuance time.
            // Comparing it against the current DB value lets Logout/password
            // changes actually revoke outstanding tokens instead of just
            // deleting the client's cookie -- without needing a full
            // refresh-token/blacklist system.
            OnTokenValidated = async context =>
            {
                var stampClaim = context.Principal?.FindFirst("SecurityStamp")?.Value;
                var userId = context.Principal?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(stampClaim) || string.IsNullOrEmpty(userId))
                {
                    context.Fail("Token is missing required security stamp claims.");
                    return;
                }

                var userManager = context.HttpContext.RequestServices
                    .GetRequiredService<UserManager<AppUser>>();
                var user = await userManager.FindByIdAsync(userId);
                var currentStamp = user == null ? null : await userManager.GetSecurityStampAsync(user);

                if (user == null || currentStamp != stampClaim)
                {
                    context.Fail("Token has been revoked.");
                }
            }
        };
    });

builder.Services.AddSingleton<ICacheMetrics, CacheMetrics>();

builder.Services.AddScoped<StockRepository>();
builder.Services.AddScoped<CachedStockRepository>();
builder.Services.AddScoped<IStockRepository>(sp => sp.GetRequiredService<CachedStockRepository>());
builder.Services.AddScoped<IStockCacheInvalidator>(sp =>
    sp.GetRequiredService<CachedStockRepository>()
);
builder.Services.AddScoped<CommentRepository>();
builder.Services.AddScoped<CachedCommentRepository>();
builder.Services.AddScoped<ICommentRepository>(sp => sp.GetRequiredService<CachedCommentRepository>());
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IPortfolioRepository, PortfolioRepository>();
builder.Services.AddScoped<IPortfolioService, PortfolioService>();
builder.Services.AddScoped<IPortfolioAnalyticsService, PortfolioAnalyticsService>();
builder.Services.AddScoped<IRebalancingService, RebalancingService>();
builder.Services.AddScoped<ITransactionRepository, TransactionRepository>();
builder.Services.AddScoped<IPriceAlertRepository, PriceAlertRepository>();
builder.Services.AddScoped<IPriceAlertService, PriceAlertService>();
builder.Services.AddHostedService<PriceAlertBackgroundService>();
builder.Services.AddScoped<ICacheWarmingService, CacheWarmingService>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

// Without this, DataProtection keys live only in the container's ephemeral
// filesystem: every redeploy generates a fresh key ring, silently
// invalidating every previously-issued CSRF token (and anything else that
// depends on DataProtection) until each client's next page load re-issues one.
builder.Services.AddDataProtection().PersistKeysToDbContext<ApplicationDBContext>();

builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    // Railway terminates TLS at its edge proxy and forwards plain HTTP to
    // the container, so Request.IsHttps is false unless we trust its
    // X-Forwarded-Proto header -- the antiforgery system in particular
    // refuses to issue a Secure cookie without this.
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
    options.KnownIPNetworks.Clear();
    options.KnownProxies.Clear();
    // Railway's X-Forwarded-For has two hops: "<real client ip>, <railway
    // edge ip>". The default ForwardLimit of 1 only unwraps the nearest
    // hop, which is Railway's own (rotating) edge IP -- not the real
    // client -- silently breaking anything keyed on RemoteIpAddress (e.g.
    // the login/register rate limiter below).
    options.ForwardLimit = 2;
});

builder.Services.AddAntiforgery(options =>
{
    options.HeaderName = "X-CSRF-TOKEN";
    // This is the antiforgery system's own internal cookie token -- it is
    // never read by JS. The value the frontend actually echoes back as the
    // X-CSRF-TOKEN header is a *different*, paired value (the "request
    // token") that AccountController issues in a separate XSRF-TOKEN
    // cookie; see AccountController.IssueCsrfCookie.
    options.Cookie.Name = "af-token";
    options.Cookie.HttpOnly = true;
    options.Cookie.SameSite = SameSiteMode.None;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
});

builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

    // Login/register have no auth to gate them, so they're the natural
    // target for credential-stuffing/brute-force attempts. Partitioned by
    // client IP (via the trusted X-Forwarded-For set up above) rather than
    // a single global bucket, so one abusive client can't lock everyone out.
    // Configurable (rather than hardcoded) so integration tests can raise
    // the ceiling instead of tripping it just by exercising several
    // register/login flows back-to-back against one shared test host.
    var authRateLimitPermits = builder.Configuration.GetValue<int?>("RateLimiting:AuthPermitLimit") ?? 10;
    var authRateLimitWindow = TimeSpan.FromSeconds(
        builder.Configuration.GetValue<int?>("RateLimiting:AuthWindowSeconds") ?? 60
    );
    options.AddPolicy(
        "auth",
        httpContext =>
            System.Threading.RateLimiting.RateLimitPartition.GetFixedWindowLimiter(
                partitionKey: httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown",
                factory: _ => new System.Threading.RateLimiting.FixedWindowRateLimiterOptions
                {
                    PermitLimit = authRateLimitPermits,
                    Window = authRateLimitWindow,
                    QueueLimit = 0,
                }
            )
    );
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDBContext>();
    db.Database.Migrate();

    await StockSeeder.SeedAsync(db);

    var adminUsername = app.Configuration["Admin:SeedUsername"];
    if (!string.IsNullOrWhiteSpace(adminUsername))
    {
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<AppUser>>();

        // Only ever auto-promote while the system has no Admin yet. Without
        // this guard, anyone who registers the configured seed username
        // before the real owner does would be silently promoted to Admin on
        // the next restart/deploy -- registration is public and unauthenticated.
        // Once a real Admin exists, this block becomes a no-op.
        var existingAdmins = await userManager.GetUsersInRoleAsync("Admin");
        if (existingAdmins.Count == 0)
        {
            var adminUser = await userManager.FindByNameAsync(adminUsername);
            if (adminUser != null)
            {
                await userManager.AddToRoleAsync(adminUser, "Admin");
            }
        }
    }

    var cacheWarmingService = scope.ServiceProvider.GetRequiredService<ICacheWarmingService>();
    await cacheWarmingService.WarmAsync();
}

app.UseForwardedHeaders();

app.UseSerilogRequestLogging();

app.UseMiddleware<api.Middleware.ExceptionMiddleware>();

app.UseRouting();
app.UseCors("DolfinCorsPolicy");
app.UseRateLimiter();
app.UseStaticFiles();
app.UseAuthentication();
app.UseAuthorization();

app.Use(
    async (context, next) =>
    {
        var method = context.Request.Method;
        var isMutatingRequest =
            !HttpMethods.IsGet(method)
            && !HttpMethods.IsHead(method)
            && !HttpMethods.IsOptions(method)
            && !HttpMethods.IsTrace(method);

        if (context.User.Identity?.IsAuthenticated == true && isMutatingRequest)
        {
            var antiforgery = context.RequestServices.GetRequiredService<Microsoft.AspNetCore.Antiforgery.IAntiforgery>();
            try
            {
                await antiforgery.ValidateRequestAsync(context);
            }
            catch (Microsoft.AspNetCore.Antiforgery.AntiforgeryValidationException ex)
            {
                Log.Warning(ex, "CSRF validation failed for {Method} {Path}", method, context.Request.Path);
                context.Response.StatusCode = StatusCodes.Status403Forbidden;
                await context.Response.WriteAsync("CSRF token missing or invalid.");
                return;
            }
        }

        await next();
    }
);

// Unauthenticated by design -- Railway's deploy healthcheck (see
// railway.json) and the Dockerfile's own HEALTHCHECK both need to reach this
// with no token. Checks Postgres (hard dependency) and Redis (soft
// dependency, reported as Degraded rather than Unhealthy -- see the
// AddRedis() call above).
app.MapHealthChecks("/health");

// Live-generated from the controllers' XML doc comments and
// [ProducesResponseType] attributes via AddOpenApi() above -- this used to
// serve a hand-maintained wwwroot/openapi.json that had already drifted from
// the real routes (stale server URL, missing half the controllers). Fixed at
// the source instead of re-editing that file by hand again.
app.MapOpenApi("/openapi.json");

app.MapControllers();

// Available in every environment, not just Development: this is read-only
// API documentation with no privileged access of its own, and the whole
// point of asking for "production-ready" docs is that they're reachable in
// production.
app.MapScalarApiReference(options =>
{
    options
        .WithTitle("DOLFIN API")
        .WithTheme(ScalarTheme.DeepSpace)
        .WithDefaultHttpClient(ScalarTarget.CSharp, ScalarClient.HttpClient);

    options.OpenApiRoutePattern = "/openapi.json";
});

try
{
    Log.Information("API started successfully...");
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "API error");
}
finally
{
    Log.CloseAndFlush();
}