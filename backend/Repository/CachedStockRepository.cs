using api.Caching;
using api.Dtos.Stock;
using api.Helpers;
using api.Interfaces;
using api.Models;
using Microsoft.Extensions.Caching.Hybrid;

namespace api.Repository
{
    public class CachedStockRepository : IStockRepository, IStockCacheInvalidator
    {
        private readonly StockRepository _inner;
        private readonly HybridCache _cache;
        private readonly ICacheMetrics _metrics;
        private readonly ILogger<CachedStockRepository> _logger;

        public CachedStockRepository(
            StockRepository inner,
            HybridCache cache,
            ICacheMetrics metrics,
            ILogger<CachedStockRepository> logger
        )
        {
            _inner = inner;
            _cache = cache;
            _metrics = metrics;
            _logger = logger;
        }

        public async Task<List<Stock>> GetAllAsync(QueryObject query)
        {
            try
            {
                var cached = await _cache.GetOrCreateWithMetricsAsync(
                    _metrics,
                    CacheKeys.StockList(query),
                    async ct => ToCacheModels(await _inner.GetAllAsync(query)),
                    CacheConfiguration.StockList,
                    tags: [CacheKeys.StockListTag]
                );

                return FromCacheModels(cached);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Redis unavailable, falling back to direct DB read for stock list");
                return await _inner.GetAllAsync(query);
            }
        }

        public async Task<Stock?> GetByIdAsync(int id)
        {
            try
            {
                var cached = await _cache.GetOrCreateWithMetricsAsync(
                    _metrics,
                    CacheKeys.StockById(id),
                    async ct =>
                    {
                        var stock = await _inner.GetByIdAsync(id);
                        return stock is null ? null : ToCacheModel(stock);
                    },
                    CacheConfiguration.StockDetail
                );

                return cached is null ? null : FromCacheModel(cached);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Redis unavailable, falling back to direct DB read for stock {Id}", id);
                return await _inner.GetByIdAsync(id);
            }
        }

        public async Task<Stock?> GetBySymbolAsync(string symbol)
        {
            try
            {
                var cached = await _cache.GetOrCreateWithMetricsAsync(
                    _metrics,
                    CacheKeys.StockBySymbol(symbol),
                    async ct =>
                    {
                        var stock = await _inner.GetBySymbolAsync(symbol);
                        return stock is null ? null : ToCacheModel(stock);
                    },
                    CacheConfiguration.StockDetail
                );

                return cached is null ? null : FromCacheModel(cached);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Redis unavailable, falling back to direct DB read for stock {Symbol}", symbol);
                return await _inner.GetBySymbolAsync(symbol);
            }
        }

        public async Task<List<Stock>> GetMarketTrendsAsync()
        {
            try
            {
                var cached = await _cache.GetOrCreateWithMetricsAsync(
                    _metrics,
                    CacheKeys.StockTrends,
                    async ct => ToCacheModels(await _inner.GetMarketTrendsAsync()),
                    CacheConfiguration.StockTrends
                );

                return FromCacheModels(cached);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Redis unavailable, falling back to direct DB read for stock trends");
                return await _inner.GetMarketTrendsAsync();
            }
        }

        public Task<bool> StockExists(int id) => _inner.StockExists(id);

        public async Task<Stock> CreateAsync(Stock stockModel)
        {
            var created = await _inner.CreateAsync(stockModel);

            await SafeRemoveAsync(CacheKeys.StockBySymbol(created.Symbol));
            await InvalidateTrendsAsync();
            await InvalidateListAsync();
            return created;
        }

        public async Task<Stock?> UpdateAsync(int id, UpdateStockRequestDto stockDto)
        {
            var oldSymbol = (await _inner.GetByIdAsync(id))?.Symbol;

            var updated = await _inner.UpdateAsync(id, stockDto);
            if (updated is null)
                return null;

            await SafeRemoveAsync(CacheKeys.StockById(id));
            await InvalidateSymbolAsync(oldSymbol);
            if (!string.Equals(oldSymbol, updated.Symbol, StringComparison.OrdinalIgnoreCase))
            {
                await InvalidateSymbolAsync(updated.Symbol);
            }
            await InvalidateTrendsAsync();
            await InvalidateListAsync();

            return updated;
        }

        public async Task<Stock?> DeleteAsync(int id)
        {
            var deleted = await _inner.DeleteAsync(id);
            if (deleted is null)
                return null;

            await SafeRemoveAsync(CacheKeys.StockById(id));
            await InvalidateSymbolAsync(deleted.Symbol);
            await InvalidateTrendsAsync();
            await InvalidateListAsync();

            return deleted;
        }

        public Task InvalidateStockAsync(int stockId) => SafeRemoveAsync(CacheKeys.StockById(stockId));

        public Task InvalidateTrendsAsync() => SafeRemoveAsync(CacheKeys.StockTrends);

        private Task InvalidateListAsync() => SafeRemoveByTagAsync(CacheKeys.StockListTag);

        private Task InvalidateSymbolAsync(string? symbol) =>
            string.IsNullOrWhiteSpace(symbol) ? Task.CompletedTask : SafeRemoveAsync(CacheKeys.StockBySymbol(symbol));

        private async Task SafeRemoveAsync(string key)
        {
            try
            {
                await _cache.RemoveAsync(key);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Redis unavailable, could not invalidate cache key {Key}", key);
            }
        }

        private async Task SafeRemoveByTagAsync(string tag)
        {
            try
            {
                await _cache.RemoveByTagAsync(tag);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Redis unavailable, could not invalidate cache tag {Tag}", tag);
            }
        }

        private sealed class CachedComment
        {
            public int Id { get; set; }
            public string Title { get; set; } = string.Empty;
            public string Content { get; set; } = string.Empty;
            public DateTime CreatedOn { get; set; }
            public int? StockId { get; set; }
            public string AppUserId { get; set; } = string.Empty;
            public string? AppUserUserName { get; set; }
        }

        private sealed class CachedStock
        {
            public int Id { get; set; }
            public string Symbol { get; set; } = string.Empty;
            public string CompanyName { get; set; } = string.Empty;
            public decimal Purchase { get; set; }
            public decimal LastDiv { get; set; }
            public string Industry { get; set; } = string.Empty;
            public long MarketCap { get; set; }
            public List<CachedComment> Comments { get; set; } = new();
        }

        private static CachedStock ToCacheModel(Stock stock) =>
            new()
            {
                Id = stock.Id,
                Symbol = stock.Symbol,
                CompanyName = stock.CompanyName,
                Purchase = stock.Purchase,
                LastDiv = stock.LastDiv,
                Industry = stock.Industry,
                MarketCap = stock.MarketCap,
                Comments = stock
                    .Comments.Select(c => new CachedComment
                    {
                        Id = c.Id,
                        Title = c.Title,
                        Content = c.Content,
                        CreatedOn = c.CreatedOn,
                        StockId = c.StockId,
                        AppUserId = c.AppUserId,
                        AppUserUserName = c.AppUser?.UserName,
                    })
                    .ToList(),
            };

        private static List<CachedStock> ToCacheModels(IEnumerable<Stock> stocks) =>
            stocks.Select(ToCacheModel).ToList();

        private static Stock FromCacheModel(CachedStock cached) =>
            new()
            {
                Id = cached.Id,
                Symbol = cached.Symbol,
                CompanyName = cached.CompanyName,
                Purchase = cached.Purchase,
                LastDiv = cached.LastDiv,
                Industry = cached.Industry,
                MarketCap = cached.MarketCap,
                Comments = cached
                    .Comments.Select(c => new Comment
                    {
                        Id = c.Id,
                        Title = c.Title,
                        Content = c.Content,
                        CreatedOn = c.CreatedOn,
                        StockId = c.StockId,
                        AppUserId = c.AppUserId,
                        AppUser = new AppUser { Id = c.AppUserId, UserName = c.AppUserUserName },
                    })
                    .ToList(),
            };

        private static List<Stock> FromCacheModels(IEnumerable<CachedStock> cached) =>
            cached.Select(FromCacheModel).ToList();
    }
}
