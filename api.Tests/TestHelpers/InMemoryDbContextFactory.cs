using api.Data;
using Microsoft.EntityFrameworkCore;

namespace api.Tests.TestHelpers
{
    public static class InMemoryDbContextFactory
    {
        // Each caller gets its own isolated database (unique Guid name) so
        // repository tests can run in parallel without seeing each other's data.
        public static ApplicationDBContext Create()
        {
            var options = new DbContextOptionsBuilder<ApplicationDBContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            return new ApplicationDBContext(options);
        }
    }
}
