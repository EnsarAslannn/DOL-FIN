using api.Caching;
using api.Helpers;
using api.Interfaces;
using api.Models;
using Microsoft.Extensions.Caching.Hybrid;

namespace api.Repository
{
    // Cache-aside decorator around CommentRepository, mirroring
    // CachedStockRepository's pattern: CommentController depends on
    // ICommentRepository, so this swaps in via DI without touching it.
    // GetById is [AllowAnonymous] on CommentController (permalink views) and
    // GettAllAsync backs the paginated per-stock comment thread -- both are
    // read-heavy, user-generated-but-not-real-time data, which is exactly
    // what was previously left uncached here despite Stock already having
    // this treatment.
    public class CachedCommentRepository : ICommentRepository
    {
        private readonly CommentRepository _inner;
        private readonly HybridCache _cache;
        private readonly ICacheMetrics _metrics;
        private readonly ILogger<CachedCommentRepository> _logger;

        public CachedCommentRepository(
            CommentRepository inner,
            HybridCache cache,
            ICacheMetrics metrics,
            ILogger<CachedCommentRepository> logger
        )
        {
            _inner = inner;
            _cache = cache;
            _metrics = metrics;
            _logger = logger;
        }

        public async Task<List<Comment>> GettAllAsync(CommentQueryObject queryObject)
        {
            try
            {
                var cached = await _cache.GetOrCreateWithMetricsAsync(
                    _metrics,
                    CacheKeys.CommentList(queryObject),
                    async ct => ToCacheModels(await _inner.GettAllAsync(queryObject)),
                    CacheConfiguration.CommentList,
                    tags: [CacheKeys.CommentListTag]
                );

                return FromCacheModels(cached);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Redis unavailable, falling back to direct DB read for comment list");
                return await _inner.GettAllAsync(queryObject);
            }
        }

        public async Task<Comment?> GetByIdAsync(int id)
        {
            try
            {
                var cached = await _cache.GetOrCreateWithMetricsAsync(
                    _metrics,
                    CacheKeys.CommentById(id),
                    async ct =>
                    {
                        var comment = await _inner.GetByIdAsync(id);
                        return comment is null ? null : ToCacheModel(comment);
                    },
                    CacheConfiguration.CommentDetail
                );

                return cached is null ? null : FromCacheModel(cached);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Redis unavailable, falling back to direct DB read for comment {Id}", id);
                return await _inner.GetByIdAsync(id);
            }
        }

        public async Task<Comment> CreateAsync(Comment commentModel)
        {
            var created = await _inner.CreateAsync(commentModel);
            await InvalidateListAsync();
            return created;
        }

        public async Task<Comment?> UpdateAsync(int id, Comment commentModel)
        {
            var updated = await _inner.UpdateAsync(id, commentModel);
            if (updated is null)
                return null;

            await SafeRemoveAsync(CacheKeys.CommentById(id));
            await InvalidateListAsync();
            return updated;
        }

        public async Task<Comment?> DeleteAsync(int id)
        {
            var deleted = await _inner.DeleteAsync(id);
            if (deleted is null)
                return null;

            await SafeRemoveAsync(CacheKeys.CommentById(id));
            await InvalidateListAsync();
            return deleted;
        }

        // Every GettAllAsync result is tagged with CommentListTag regardless
        // of its filter/paging params, so removing by tag clears every
        // cached page/variant in one call.
        private Task InvalidateListAsync() => SafeRemoveByTagAsync(CacheKeys.CommentListTag);

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

        // Decoupled from the EF entity for the same reason as
        // CachedStockRepository's CachedStock: drops AppUser fields other
        // than Id/UserName so Identity secrets never get written to Redis,
        // and drops Comment.Stock so there's no cycle for the serializer.
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

        private static CachedComment ToCacheModel(Comment comment) =>
            new()
            {
                Id = comment.Id,
                Title = comment.Title,
                Content = comment.Content,
                CreatedOn = comment.CreatedOn,
                StockId = comment.StockId,
                AppUserId = comment.AppUserId,
                AppUserUserName = comment.AppUser?.UserName,
            };

        private static List<CachedComment> ToCacheModels(IEnumerable<Comment> comments) =>
            comments.Select(ToCacheModel).ToList();

        private static Comment FromCacheModel(CachedComment cached) =>
            new()
            {
                Id = cached.Id,
                Title = cached.Title,
                Content = cached.Content,
                CreatedOn = cached.CreatedOn,
                StockId = cached.StockId,
                AppUserId = cached.AppUserId,
                AppUser = new AppUser { Id = cached.AppUserId, UserName = cached.AppUserUserName },
            };

        private static List<Comment> FromCacheModels(IEnumerable<CachedComment> cached) =>
            cached.Select(FromCacheModel).ToList();
    }
}
