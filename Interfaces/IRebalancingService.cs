using api.Dtos.Portfolio;
using api.Models;

namespace api.Interfaces
{
    public interface IRebalancingService
    {
        Task<RebalancingRecommendationDto> GetRecommendationAsync(AppUser user);
    }
}
