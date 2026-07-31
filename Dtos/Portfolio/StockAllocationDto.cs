namespace api.Dtos.Portfolio
{
    public class StockAllocationDto
    {
        public int StockId { get; set; }
        public string Symbol { get; set; } = string.Empty;
        public string CompanyName { get; set; } = string.Empty;
        public string Industry { get; set; } = string.Empty;
        public int Quantity { get; set; }

        // The user's own weighted-average buy price for this position (see
        // Portfolio.AveragePrice / PortfolioService.BuyStockAsync) -- this app
        // has no FIFO/LIFO lot tracking, just a running average per position.
        public decimal AverageCostPerShare { get; set; }

        // There is no live market feed; Stock.Purchase is the only price this
        // app tracks, and it already doubles as "current price" everywhere
        // else (see PortfolioService.BuyStockAsync/SellStockAsync).
        public decimal CurrentPrice { get; set; }

        public decimal CurrentValue { get; set; }
        public decimal GainLossAmount { get; set; }
        public decimal GainLossPercent { get; set; }
        public decimal AllocationPercent { get; set; }
    }
}
