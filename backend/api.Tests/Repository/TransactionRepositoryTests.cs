using api.Models;
using api.Repository;
using api.Tests.TestHelpers;
using Xunit;

namespace api.Tests.Repository
{
    public class TransactionRepositoryTests
    {
        [Fact]
        public async Task AddAsync_PersistsTransaction()
        {
            var context = InMemoryDbContextFactory.Create();
            var repo = new TransactionRepository(context);
            var transaction = new Transaction
            {
                AppUserId = "user-1",
                Symbol = "AAPL",
                CompanyName = "Apple Inc.",
                TransactionType = "BUY",
                Quantity = 10,
                Price = 185.20m,
            };

            await repo.AddAsync(transaction);

            var stored = Assert.Single(context.Transactions);
            Assert.Equal("AAPL", stored.Symbol);
            Assert.Equal("BUY", stored.TransactionType);
            Assert.Equal(10, stored.Quantity);
        }

        [Fact]
        public async Task AddAsync_MultipleTransactions_AllPersisted()
        {
            var context = InMemoryDbContextFactory.Create();
            var repo = new TransactionRepository(context);

            await repo.AddAsync(new Transaction
            {
                AppUserId = "user-1",
                Symbol = "CASH",
                CompanyName = "Wallet Deposit",
                TransactionType = "DEPOSIT",
                Quantity = 1,
                Price = 500m,
            });
            await repo.AddAsync(new Transaction
            {
                AppUserId = "user-1",
                Symbol = "AAPL",
                CompanyName = "Apple Inc.",
                TransactionType = "BUY",
                Quantity = 2,
                Price = 185.20m,
            });

            Assert.Equal(2, context.Transactions.Count());
        }
    }
}
