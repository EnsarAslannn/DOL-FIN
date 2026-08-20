using System.Net;
using System.Net.Http.Json;
using api.Dtos.Comment;
using api.Dtos.Stock;
using api.IntegrationTests.TestHelpers;
using Xunit;

namespace api.IntegrationTests
{
    [Collection("Integration")]
    public class CommentCachingTests
    {
        private readonly DolfinApiFactory _factory;

        public CommentCachingTests(DolfinApiFactory factory)
        {
            _factory = factory;
        }

        private async Task<StockDto> CreateStockAsAdminAsync()
        {
            var symbol = $"T{Guid.NewGuid():N}"[..7].ToUpperInvariant();
            var admin = await AuthHelper.CreateAuthenticatedClientAsync(_factory, asAdmin: true);

            var response = await admin.PostAsJsonAsync(
                "/api/stock",
                new CreateStockRequestDto
                {
                    Symbol = symbol,
                    CompanyName = "Comment Caching Test Corp",
                    Purchase = 42.50m,
                    LastDiv = 0.10m,
                    Industry = "Software",
                    MarketCap = 1_000_000_000,
                }
            );

            var stock = await response.Content.ReadFromJsonAsync<StockDto>();
            return stock!;
        }

        [Fact]
        public async Task CreateComment_AfterListWasCached_IsVisibleOnNextList()
        {
            var stock = await CreateStockAsAdminAsync();
            var client = await AuthHelper.CreateAuthenticatedClientAsync(_factory);

            var firstCreate = await client.PostAsJsonAsync(
                $"/api/comment/{stock.Id}",
                new CreateCommentDto { Title = "First comment", Content = "Initial thoughts on this stock." }
            );
            Assert.Equal(HttpStatusCode.Created, firstCreate.StatusCode);

            var firstList = await client.GetAsync($"/api/comment?symbol={stock.Symbol}");
            var firstComments = await firstList.Content.ReadFromJsonAsync<List<CommentDto>>();
            Assert.Single(firstComments!);

            var secondCreate = await client.PostAsJsonAsync(
                $"/api/comment/{stock.Id}",
                new CreateCommentDto { Title = "Second comment", Content = "A follow-up thought." }
            );
            Assert.Equal(HttpStatusCode.Created, secondCreate.StatusCode);

            var secondList = await client.GetAsync($"/api/comment?symbol={stock.Symbol}");
            var secondComments = await secondList.Content.ReadFromJsonAsync<List<CommentDto>>();

            Assert.Equal(2, secondComments!.Count);
        }

        [Fact]
        public async Task UpdateComment_AfterDetailWasCached_ReturnsUpdatedTitleNotStaleOne()
        {
            var stock = await CreateStockAsAdminAsync();
            var client = await AuthHelper.CreateAuthenticatedClientAsync(_factory);

            var createResponse = await client.PostAsJsonAsync(
                $"/api/comment/{stock.Id}",
                new CreateCommentDto { Title = "Original title", Content = "Original content here." }
            );
            var created = await createResponse.Content.ReadFromJsonAsync<CommentDto>();

            var beforeUpdate = await client.GetAsync($"/api/comment/{created!.Id}");
            var beforeDto = await beforeUpdate.Content.ReadFromJsonAsync<CommentDto>();
            Assert.Equal("Original title", beforeDto!.Title);

            await client.PutAsJsonAsync(
                $"/api/comment/{created.Id}",
                new UpdateCommentRequestDto { Title = "Updated title", Content = "Updated content here." }
            );

            var afterUpdate = await client.GetAsync($"/api/comment/{created.Id}");
            var afterDto = await afterUpdate.Content.ReadFromJsonAsync<CommentDto>();

            Assert.Equal("Updated title", afterDto!.Title);
        }

        [Fact]
        public async Task DeleteComment_AfterDetailWasCached_ReturnsNotFoundNotStaleValue()
        {
            var stock = await CreateStockAsAdminAsync();
            var client = await AuthHelper.CreateAuthenticatedClientAsync(_factory);

            var createResponse = await client.PostAsJsonAsync(
                $"/api/comment/{stock.Id}",
                new CreateCommentDto { Title = "Doomed comment", Content = "This will be deleted shortly." }
            );
            var created = await createResponse.Content.ReadFromJsonAsync<CommentDto>();

            await client.GetAsync($"/api/comment/{created!.Id}");

            var deleteResponse = await client.DeleteAsync($"/api/comment/{created.Id}");
            Assert.Equal(HttpStatusCode.OK, deleteResponse.StatusCode);

            var afterDelete = await client.GetAsync($"/api/comment/{created.Id}");

            Assert.Equal(HttpStatusCode.NotFound, afterDelete.StatusCode);
        }
    }
}
