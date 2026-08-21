using api.Caching;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StackExchange.Redis;

namespace api.Controllers
{
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
        /// Reports per-key cache hit/miss counters. Admin only.
        /// </summary>
        /// <remarks>
        /// Counters are held in memory by a singleton, so they cover the
        /// current process only and reset when the API restarts.
        /// </remarks>
        /// <response code="200">A snapshot of the counters, keyed by cache key.</response>
        [HttpGet("cache-metrics")]
        [ProducesResponseType(typeof(IReadOnlyDictionary<string, CacheKeyStats>), StatusCodes.Status200OK)]
        public IActionResult GetCacheMetrics()
        {
            return Ok(_cacheMetrics.GetSnapshot());
        }

        /// <summary>
        /// Reports live Redis server statistics. Admin only.
        /// </summary>
        /// <remarks>
        /// Returns <c>configured: false</c> rather than an error when the API
        /// is running without Redis, since the cache is a soft dependency.
        /// </remarks>
        /// <response code="200">Memory use, connected clients, ops/sec and the dolfin key count.</response>
        /// <response code="503">Redis is configured but could not be reached.</response>
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
