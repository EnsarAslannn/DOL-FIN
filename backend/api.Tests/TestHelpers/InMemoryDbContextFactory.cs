using api.Data;
using Microsoft.EntityFrameworkCore;

namespace api.Tests.TestHelpers
{
    public static class InMemoryDbContextFactory
    {
        public static ApplicationDBContext Create()
        {
            var options = new DbContextOptionsBuilder<ApplicationDBContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            return new ApplicationDBContext(options);
        }
    }
}
