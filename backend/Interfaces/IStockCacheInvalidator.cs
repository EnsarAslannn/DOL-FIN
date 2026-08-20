namespace api.Interfaces
{
    public interface IStockCacheInvalidator
    {
        Task InvalidateStockAsync(int stockId);

        Task InvalidateTrendsAsync();
    }
}
