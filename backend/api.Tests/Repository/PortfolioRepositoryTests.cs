using api.Data;
using api.Models;
using api.Repository;
using api.Tests.TestHelpers;
using Xunit;

namespace api.Tests.Repository
{
    public class PortfolioRepositoryTests
    {
        private static AppUser MakeUser(string id = "user-1") =>
            new() { Id = id, UserName = "trader" };

        private static Stock MakeStock(string symbol = "AAPL") =>
            new()
            {
                Symbol = symbol,
                CompanyName = "Apple Inc.",
                Purchase = 185.20m,
                LastDiv = 0.24m,
                Industry = "Consumer Electronics",
                MarketCap = 2_850_000_000_000,
            };

        private static async Task<(ApplicationDBContext Context, AppUser User, Stock Stock)> SeedUserAndStockAsync()
        {
            var context = InMemoryDbContextFactory.Create();
            var user = MakeUser();
            var stock = MakeStock();
            await context.Users.AddAsync(user);
            await context.Stock.AddAsync(stock);
            await context.SaveChangesAsync();
            return (context, user, stock);
        }

        [Fact]
        public async Task CreateAsync_PersistsPortfolio()
        {
            var (context, user, stock) = await SeedUserAndStockAsync();
            var repo = new PortfolioRepository(context);

            var created = await repo.CreateAsync(
                new Portfolio
                {
                    AppUserId = user.Id,
                    StockId = stock.Id,
                    Quantity = 10,
                    AveragePrice = 185.20m,
                }
            );

            Assert.NotEqual(0, created.Id);
            Assert.Equal(1, context.Portfolios.Count());
        }

        [Fact]
        public async Task DeletePortfolio_Found_RemovesAndReturnsPosition()
        {
            var (context, user, stock) = await SeedUserAndStockAsync();
            var position = new Portfolio
            {
                AppUserId = user.Id,
                StockId = stock.Id,
                Quantity = 5,
                AveragePrice = 100m,
            };
            await context.Portfolios.AddAsync(position);
            await context.SaveChangesAsync();
            var repo = new PortfolioRepository(context);

            var deleted = await repo.DeletePortfolio(user, stock.Symbol);

            Assert.NotNull(deleted);
            Assert.Empty(context.Portfolios);
        }

        [Fact]
        public async Task DeletePortfolio_SymbolLookupIsCaseInsensitive()
        {
            var (context, user, stock) = await SeedUserAndStockAsync();
            await context.Portfolios.AddAsync(
                new Portfolio
                {
                    AppUserId = user.Id,
                    StockId = stock.Id,
                    Quantity = 5,
                    AveragePrice = 100m,
                }
            );
            await context.SaveChangesAsync();
            var repo = new PortfolioRepository(context);

            var deleted = await repo.DeletePortfolio(user, stock.Symbol.ToLower());

            Assert.NotNull(deleted);
        }

        [Fact]
        public async Task DeletePortfolio_NoPosition_ReturnsNull()
        {
            var (context, user, stock) = await SeedUserAndStockAsync();
            var repo = new PortfolioRepository(context);

            var deleted = await repo.DeletePortfolio(user, stock.Symbol);

            Assert.Null(deleted);
        }

        [Fact]
        public async Task GetUserPortfolio_ReturnsOnlyThatUsersPositionsWithMappedFields()
        {
            var context = InMemoryDbContextFactory.Create();
            var owner = MakeUser("owner");
            var otherUser = MakeUser("other");
            var stock = MakeStock();
            await context.Users.AddRangeAsync(owner, otherUser);
            await context.Stock.AddAsync(stock);
            await context.Portfolios.AddRangeAsync(
                new Portfolio { AppUserId = owner.Id, StockId = stock.Id, Quantity = 10, AveragePrice = 150m },
                new Portfolio { AppUserId = otherUser.Id, StockId = stock.Id, Quantity = 3, AveragePrice = 120m }
            );
            await context.SaveChangesAsync();
            var repo = new PortfolioRepository(context);

            var result = await repo.GetUserPortfolio(owner);

            var position = Assert.Single(result);
            Assert.Equal(stock.Symbol, position.Symbol);
            Assert.Equal(stock.CompanyName, position.CompanyName);
            Assert.Equal(10, position.Quantity);
            Assert.Equal(150m, position.AveragePrice);
        }

        [Fact]
        public async Task GetByAppUserAndStockId_Found_ReturnsPosition()
        {
            var (context, user, stock) = await SeedUserAndStockAsync();
            await context.Portfolios.AddAsync(
                new Portfolio { AppUserId = user.Id, StockId = stock.Id, Quantity = 7, AveragePrice = 100m }
            );
            await context.SaveChangesAsync();
            var repo = new PortfolioRepository(context);

            var result = await repo.GetByAppUserAndStockId(user.Id, stock.Id);

            Assert.NotNull(result);
            Assert.Equal(7, result!.Quantity);
        }

        [Fact]
        public async Task GetByAppUserAndStockId_NotFound_ReturnsNull()
        {
            var (context, user, stock) = await SeedUserAndStockAsync();
            var repo = new PortfolioRepository(context);

            var result = await repo.GetByAppUserAndStockId(user.Id, stock.Id);

            Assert.Null(result);
        }

        [Fact]
        public async Task UpdateAsync_PersistsChanges()
        {
            var (context, user, stock) = await SeedUserAndStockAsync();
            var position = new Portfolio { AppUserId = user.Id, StockId = stock.Id, Quantity = 5, AveragePrice = 100m };
            await context.Portfolios.AddAsync(position);
            await context.SaveChangesAsync();
            var repo = new PortfolioRepository(context);

            position.Quantity = 12;
            position.AveragePrice = 110m;
            await repo.UpdateAsync(position);

            var reloaded = await context.Portfolios.FindAsync(position.Id);
            Assert.Equal(12, reloaded!.Quantity);
            Assert.Equal(110m, reloaded.AveragePrice);
        }
    }
}
