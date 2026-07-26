using api.Dtos;
using api.Models;

namespace api.Mappers
{
    public static class PortfolioMappers
    {
        public static PortfolioDto ToPortfolioDto(this Portfolio portfolioModel)
        {
            return new PortfolioDto
            {
                Id = portfolioModel.StockId,
                Symbol = portfolioModel.Stock.Symbol,
                CompanyName = portfolioModel.Stock.CompanyName,
                Purchase = portfolioModel.Stock.Purchase,
                LastDiv = portfolioModel.Stock.LastDiv,
                Industry = portfolioModel.Stock.Industry,
                MarketCap = portfolioModel.Stock.MarketCap,
                Quantity = portfolioModel.Quantity,
                AveragePrice = portfolioModel.AveragePrice
            };
        }
    }
}