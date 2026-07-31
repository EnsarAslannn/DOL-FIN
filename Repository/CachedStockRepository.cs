using api.Dtos.Stock;
using api.Helpers;
using api.Interfaces;
using api.Models;
using Microsoft.Extensions.Caching.Hybrid;

namespace api.Repository
{
    // Cache-aside decorator around StockRepository. Keeps StockRepository itself
    // free of caching concerns; StockController/CommentController depend on the
    // interfaces, so this can be swapped in via DI without touching either.
    public class CachedStockRepository : IStockRepository, IStockCacheInvalidator
    {
        private const string TrendsKey = "stock:trends";
        private const string ListTag = "stock:list";

        private static readonly HybridCacheEntryOptions ListCacheOptions = new()
        {
            Expiration = TimeSpan.FromSeconds(60),
            LocalCacheExpiration = TimeSpan.FromSeconds(30),
        };

        private static readonly HybridCacheEntryOptions DetailCacheOptions = new()
        {
            Expiration = TimeSpan.FromMinutes(5),
            LocalCacheExpiration = TimeSpan.FromSeconds(30),
        };

        private static readonly HybridCacheEntryOptions TrendsCacheOptions = new()
        {
            Expiration = TimeSpan.FromMinutes(10),
            LocalCacheExpiration = TimeSpan.FromSeconds(30),
        };

        private readonly StockRepository _inner;
        private readonly HybridCache _cache;
        private readonly ILogger<CachedStockRepository> _logger;

        public CachedStockRepository(
            StockRepository inner,
            HybridCache cache,
            ILogger<CachedStockRepository> logger
        )
        {
            _inner = inner;
            _cache = cache;
            _logger = logger;
        }

        public async Task<List<Stock>> GetAllAsync(QueryObject query)
        {
            try
            {
                var cached = await _cache.GetOrCreateAsync(
                    BuildListCacheKey(query),
                    async ct => ToCacheModels(await _inner.GetAllAsync(query)),
                    ListCacheOptions,
                    tags: [ListTag]
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
                var cached = await _cache.GetOrCreateAsync(
                    IdKey(id),
                    async ct =>
                    {
                        var stock = await _inner.GetByIdAsync(id);
                        return stock is null ? null : ToCacheModel(stock);
                    },
                    DetailCacheOptions
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
                var cached = await _cache.GetOrCreateAsync(
                    SymbolKey(symbol),
                    async ct =>
                    {
                        var stock = await _inner.GetBySymbolAsync(symbol);
                        return stock is null ? null : ToCacheModel(stock);
                    },
                    DetailCacheOptions
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
                var cached = await _cache.GetOrCreateAsync(
                    TrendsKey,
                    async ct => ToCacheModels(await _inner.GetMarketTrendsAsync()),
                    TrendsCacheOptions
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

            // The caller (StockController.Create) always does its own
            // GetBySymbolAsync duplicate check immediately before calling this,
            // which caches a "not found" result for this exact symbol key.
            // Without clearing it here, that stale negative entry outlives the
            // creation (DetailCacheOptions is a 5-minute TTL) and makes the new
            // stock invisible to GetBySymbolAsync -- both to a follow-up
            // duplicate-symbol check (which then 500s on the DB's unique
            // constraint instead of returning 409) and to BuyStockAsync looking
            // the symbol up to place a trade.
            await SafeRemoveAsync(SymbolKey(created.Symbol));
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

            await SafeRemoveAsync(IdKey(id));
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

            await SafeRemoveAsync(IdKey(id));
            await InvalidateSymbolAsync(deleted.Symbol);
            await InvalidateTrendsAsync();
            await InvalidateListAsync();

            return deleted;
        }

        public Task InvalidateStockAsync(int stockId) => SafeRemoveAsync(IdKey(stockId));

        public Task InvalidateTrendsAsync() => SafeRemoveAsync(TrendsKey);

        // Every GetAllAsync result is tagged with ListTag regardless of its
        // filter/sort/paging params (see BuildListCacheKey), so removing by
        // tag clears all cached list pages/variants in one call instead of
        // leaving stale entries behind for whichever filter combinations
        // weren't explicitly keyed here.
        private Task InvalidateListAsync() => SafeRemoveByTagAsync(ListTag);

        private Task InvalidateSymbolAsync(string? symbol) =>
            string.IsNullOrWhiteSpace(symbol) ? Task.CompletedTask : SafeRemoveAsync(SymbolKey(symbol));

        // A write to the database already succeeded by the time we get here;
        // a Redis hiccup on invalidation must not turn that into a 500 for
        // the caller (and must not block DB writes on a cache that's down) --
        // worst case a stale entry lingers until its TTL expires.
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

        private static string IdKey(int id) => $"stock:id:{id}";

        private static string SymbolKey(string symbol) =>
            $"stock:symbol:{symbol.Trim().ToUpperInvariant()}";

        private static string BuildListCacheKey(QueryObject query)
        {
            string Norm(string? value) =>
                string.IsNullOrWhiteSpace(value) ? "_" : value.Trim().ToLowerInvariant();

            return string.Join(
                '|',
                "stock:list:" + Norm(query.Symbol),
                Norm(query.CompanyName),
                Norm(query.SortBy),
                query.IsDescending,
                query.PageNumber,
                query.PageSize
            );
        }

        // Cache payload types, deliberately decoupled from the EF entities:
        // - drops AppUser fields other than Id/UserName (the only ones
        //   CommentMapper.ToCommentDto reads) so Identity secrets like
        //   PasswordHash/SecurityStamp never get written to Redis.
        // - drops Comment.Stock / Stock.Portfolios back-references so there is
        //   no cycle for the JSON serializer to trip over (EF relationship
        //   fixup would otherwise wire Comment.Stock back to the parent for
        //   tracked queries like GetAllAsync).
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
