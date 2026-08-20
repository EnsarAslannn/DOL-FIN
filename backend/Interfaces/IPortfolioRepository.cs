using api.Dtos;
using api.Models;

namespace api.Interfaces
{
    public interface IPortfolioRepository
    {
        Task<List<PortfolioDto>> GetUserPortfolio(AppUser user);
        Task<Portfolio> CreateAsync(Portfolio portfolio);
        Task<Portfolio?> DeletePortfolio(AppUser user, string symbol);
        Task<Portfolio?> GetByAppUserAndStockId(string appUserId, int stockId);
        Task<Portfolio> UpdateAsync(Portfolio portfolio);
    }
}
