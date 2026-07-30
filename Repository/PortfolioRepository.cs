using api.Data;
using api.Dtos;
using api.Interfaces;
using api.Mappers;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Repository
{
    public class PortfolioRepository : IPortfolioRepository
    {
        private readonly ApplicationDBContext _context;

        public PortfolioRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<Portfolio> CreateAsync(Portfolio portfolio)
        {
            await _context.Portfolios.AddAsync(portfolio);
            await _context.SaveChangesAsync();
            return portfolio;
        }

        public async Task<Portfolio?> DeletePortfolio(AppUser appUser, string symbol)
        {
            var portfolioModel = await _context.Portfolios.FirstOrDefaultAsync(x =>
                x.AppUserId == appUser.Id && x.Stock.Symbol.ToLower() == symbol.ToLower()
            );

            if (portfolioModel == null)
                return null;

            _context.Portfolios.Remove(portfolioModel);
            await _context.SaveChangesAsync();
            return portfolioModel;
        }

        public async Task<List<PortfolioDto>> GetUserPortfolio(AppUser user)
        {
            var userPortfolios = await _context.Portfolios
                .AsNoTracking()
                .Where(u => u.AppUserId == user.Id)
                .Include(p => p.Stock)
                .ToListAsync();

            return userPortfolios.Select(p => p.ToPortfolioDto()).ToList();
        }

        public async Task<Portfolio?> GetByAppUserAndStockId(string appUserId, int stockId)
        {
            // Must stay tracked: the entity's shadow `xmin` concurrency token (see
            // ApplicationDBContext) is only populated on tracked reads. With
            // AsNoTracking() the token defaults to 0 when this entity is later
            // attached via UpdateAsync, so the WHERE xmin=@p clause never matches
            // and every buy/sell of an existing position spuriously throws
            // DbUpdateConcurrencyException.
            return await _context.Portfolios
                .FirstOrDefaultAsync(x => x.AppUserId == appUserId && x.StockId == stockId);
        }

        public async Task<Portfolio> UpdateAsync(Portfolio portfolio)
        {
            _context.Portfolios.Update(portfolio);
            await _context.SaveChangesAsync();
            return portfolio;
        }
    }
}