using api.Models;
using Microsoft.AspNetCore.Identity;
using Moq;

namespace api.Tests.TestHelpers
{
    public static class MockUserManager
    {
        public static Mock<UserManager<AppUser>> Create()
        {
            var store = new Mock<IUserStore<AppUser>>();
            return new Mock<UserManager<AppUser>>(
                store.Object,
                null!,
                null!,
                null!,
                null!,
                null!,
                null!,
                null!,
                null!
            );
        }
    }
}
