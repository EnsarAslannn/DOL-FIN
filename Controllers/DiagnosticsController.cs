using api.Caching;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StackExchange.Redis;

namespace api.Controllers
{
    /// <summary>
    /// Cache and Redis observability. Admin only -- this exposes internal
    /// operational state (hit rates, server memory/connections), not
    /// anything a regular user needs or should see.
    /// </summary>
    [Route("api/diagnostics")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public class DiagnosticsController : ControllerBase
    {
        private readonly ICacheMetrics _cacheMetrics;
        private readonly IConnectionMultiplexer? _redis;
        private readonly ILogger<DiagnosticsController> _logger;

        public DiagnosticsController(
            ICacheMetrics cacheMetrics,
            ILogger<DiagnosticsController> logger,
            IConnectionMultiplexer? redis = null
        )
        {
            _cacheMetrics = cacheMetrics;
            _redis = redis;
            _logger = logger;
        }

        /// <summary>
        /// Per-key cache hit/miss counts and hit rate since process start.
        /// </summary>
        /// <remarks>
        /// In-memory only (see CacheMetrics) -- these counters reset on every
        /// deploy/restart and aren't shared across instances if this ever runs
        /// on more than one.
        /// </remarks>
        /// <response code="200">A map of cache key to { hits, misses, hitRate }.</response>
        [HttpGet("cache-metrics")]
        [ProducesResponseType(typeof(IReadOnlyDictionary<string, CacheKeyStats>), StatusCodes.Status200OK)]
        public IActionResult GetCacheMetrics()
        {
            return Ok(_cacheMetrics.GetSnapshot());
        }

        /// <summary>
        /// Live Redis server stats: memory usage, connected clients, ops/sec, key count.
        /// </summary>
        /// <remarks>
        /// Returns <c>{ "configured": false }</c> if no Redis connection
        /// string is set for this environment (caching then runs DB-only --
        /// see CachedStockRepository/CachedCommentRepository/PortfolioService's
        /// fallback behavior), rather than treating that as an error.
        /// </remarks>
        /// <response code="200">Redis stats, or `{ "configured": false }`.</response>
        /// <response code="503">Redis is configured but unreachable.</response>
        [HttpGet("redis-info")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status503ServiceUnavailable)]
        public async Task<IActionResult> GetRedisInfo()
        {
            if (_redis is null)
            {
                return Ok(new { configured = false });
            }

            try
            {
                var server = _redis.GetServer(_redis.GetEndPoints().First());
                var info = await server.InfoAsync();

                string? Find(string section, string key) =>
                    info.FirstOrDefault(g => g.Key.Equals(section, StringComparison.OrdinalIgnoreCase))
                        ?.FirstOrDefault(i => i.Key.Equals(key, StringComparison.OrdinalIgnoreCase))
                        .Value;

                return Ok(
                    new
                    {
                        configured = true,
                        usedMemory = Find("Memory", "used_memory_human"),
                        connectedClients = Find("Clients", "connected_clients"),
                        commandsPerSec = Find("Stats", "instantaneous_ops_per_sec"),
                        keyCount = server.Keys(pattern: "dolfin:*").Count(),
                    }
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get Redis info");
                return StatusCode(StatusCodes.Status503ServiceUnavailable, new { error = "Redis unreachable" });
            }
        }
    }
}
