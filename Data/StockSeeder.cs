using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Data
{
    /// <summary>
    /// Fills the Stocks table with the demo universe the client is built
    /// around. Search, the market-trends rail and the portfolio flows all key
    /// off these exact symbols, so an empty table leaves the whole app looking
    /// broken (`/stock/trends` answers 404 and search returns nothing).
    /// </summary>
    public static class StockSeeder
    {
        // Prices and names mirror the client's demo tape so a ticker shows the
        // same figure wherever it appears. Industry strings matter beyond
        // display: the portfolio sector breakdown buckets on "software",
        // "semiconductors" and "technology".
        private static readonly Stock[] DemoStocks =
        {
            new() { Symbol = "MSFT",  CompanyName = "Microsoft Corporation",   Purchase = 425.50m, LastDiv = 0.75m, Industry = "Software - Infrastructure",        MarketCap = 3_160_000_000_000 },
            new() { Symbol = "AAPL",  CompanyName = "Apple Inc.",              Purchase = 185.20m, LastDiv = 0.24m, Industry = "Consumer Electronics",            MarketCap = 2_850_000_000_000 },
            new() { Symbol = "NVDA",  CompanyName = "NVIDIA Corporation",      Purchase = 910.00m, LastDiv = 0.01m, Industry = "Semiconductors",                  MarketCap = 2_240_000_000_000 },
            new() { Symbol = "GOOGL", CompanyName = "Alphabet Inc.",           Purchase = 165.30m, LastDiv = 0.20m, Industry = "Internet Content & Information",  MarketCap = 2_050_000_000_000 },
            new() { Symbol = "AMZN",  CompanyName = "Amazon.com, Inc.",        Purchase = 185.40m, LastDiv = 0.00m, Industry = "Internet Retail",                 MarketCap = 1_930_000_000_000 },
            new() { Symbol = "META",  CompanyName = "Meta Platforms, Inc.",    Purchase = 495.10m, LastDiv = 0.50m, Industry = "Internet Content & Information",  MarketCap = 1_260_000_000_000 },
            new() { Symbol = "BRK.B", CompanyName = "Berkshire Hathaway Inc.", Purchase = 415.80m, LastDiv = 0.00m, Industry = "Insurance - Diversified",         MarketCap =   897_000_000_000 },
            new() { Symbol = "TSLA",  CompanyName = "Tesla, Inc.",             Purchase = 172.50m, LastDiv = 0.00m, Industry = "Auto Manufacturers",              MarketCap =   560_000_000_000 },
            new() { Symbol = "VISA",  CompanyName = "Visa Inc.",               Purchase = 280.10m, LastDiv = 0.52m, Industry = "Credit Services",                 MarketCap =   572_000_000_000 },
            new() { Symbol = "JPM",   CompanyName = "JPMorgan Chase & Co.",    Purchase = 198.50m, LastDiv = 1.15m, Industry = "Banks - Diversified",             MarketCap =   570_000_000_000 },
            new() { Symbol = "WMT",   CompanyName = "Walmart Inc.",            Purchase =  62.70m, LastDiv = 0.21m, Industry = "Discount Stores",                 MarketCap =   505_000_000_000 },
            new() { Symbol = "JNJ",   CompanyName = "Johnson & Johnson",       Purchase = 152.30m, LastDiv = 1.19m, Industry = "Drug Manufacturers - General",    MarketCap =   366_000_000_000 },
            new() { Symbol = "AMD",   CompanyName = "Advanced Micro Devices",  Purchase = 170.20m, LastDiv = 0.00m, Industry = "Semiconductors",                  MarketCap =   275_000_000_000 },
            new() { Symbol = "NFLX",  CompanyName = "Netflix, Inc.",           Purchase = 625.00m, LastDiv = 0.00m, Industry = "Entertainment",                   MarketCap =   269_000_000_000 },
            new() { Symbol = "DIS",   CompanyName = "The Walt Disney Company", Purchase = 112.50m, LastDiv = 0.45m, Industry = "Entertainment",                   MarketCap =   205_000_000_000 },
        };

        public static async Task SeedAsync(ApplicationDBContext db)
        {
            // Seeded at runtime rather than through HasData: fixed primary keys
            // in a migration would leave Postgres' identity sequence pointing at
            // 1, so the next stock inserted through the API would collide with a
            // seeded row. Letting the database assign the keys avoids that.
            var existing = await db
                .Stock.Select(s => s.Symbol.ToUpper())
                .ToListAsync();

            var missing = DemoStocks
                .Where(s => !existing.Contains(s.Symbol.ToUpper()))
                .ToList();

            if (missing.Count == 0)
            {
                return;
            }

            // Prices on rows that already exist are left alone -- users may hold
            // positions bought against them, and rewriting the price on every
            // restart would silently restate their profit and loss.
            await db.Stock.AddRangeAsync(missing);
            await db.SaveChangesAsync();
        }
    }
}
