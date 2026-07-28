import DeletePortfolio from "../DeletePortfolio/DeletePortfolio"
import { Link } from "react-router-dom"
import type { PortfolioGet } from "../../../Models/Portfolio"
import type { SyntheticEvent } from "react"
import { companyLogos } from "../../../Components/Table/TestData"

interface Props {
  portfolioValue: PortfolioGet
  onPortfolioDelete: (e: SyntheticEvent) => void
  totalPortfolioInvested: number
}

const CardPortfolio = ({ portfolioValue, onPortfolioDelete, totalPortfolioInvested }: Props) => {
  const symbolUpper = portfolioValue.symbol.toUpperCase()

  const currentPrice = portfolioValue.purchase || 0
  const quantity = portfolioValue.quantity || 0
  const avgCost = portfolioValue.averagePrice || 0

  const totalCost = quantity * avgCost
  const currentTotalValue = quantity * currentPrice
  const pnlAmount = currentTotalValue - totalCost
  const pnlPercentage = totalCost > 0 ? (pnlAmount / totalCost) * 100 : 0
  const isProfit = pnlAmount >= 0

  const currentWeightPercent = totalPortfolioInvested > 0 ? (totalCost / totalPortfolioInvested) * 100 : 0
  const weightString = `${currentWeightPercent.toFixed(0)}%`
  const barColor = isProfit ? "bg-gain" : "bg-loss"

  return (
    <div className="group relative flex flex-col p-5 bg-depth rounded-2xl border border-white/8 transition-all duration-200 hover:border-pulse/25 hover:bg-depth-2/60">
      <div className="absolute top-3 right-3 opacity-30 group-hover:opacity-100 transition-opacity cursor-pointer z-10 text-mist">
        <DeletePortfolio
          portfolioValue={portfolioValue.symbol}
          onPortfolioDelete={onPortfolioDelete}
        />
      </div>

      <div className="flex items-center space-x-3 border-b border-white/8 pb-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-depth-2 border border-white/8 p-2 flex items-center justify-center shrink-0">
          {companyLogos[symbolUpper] ? (
            companyLogos[symbolUpper]()
          ) : (
            <div className="font-bold text-pulse text-xs tracking-wide">
              {symbolUpper.substring(0, 2)}
            </div>
          )}
        </div>
        <div className="flex flex-col text-left">
          <Link
            to={`/company/${portfolioValue.symbol}/company-profile`}
            className="text-sm font-bold text-foam hover:text-pulse transition-colors uppercase tracking-tight"
          >
            {portfolioValue.symbol}
          </Link>
          <span className="text-[10px] text-mist font-bold font-mono">
            {quantity} Shares
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-y-3 text-left mb-4">
        <div className="flex flex-col">
          <span className="text-[9px] text-mist font-bold uppercase tracking-wider">
            Invested
          </span>
          <span className="text-xs font-bold text-foam/85 font-mono">
            ${totalCost.toFixed(2)}
          </span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-[9px] text-mist font-bold uppercase tracking-wider">
            Current Value
          </span>
          <span className="text-xs font-bold text-foam font-mono">
            ${currentTotalValue.toFixed(2)}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] text-mist font-bold uppercase tracking-wider">
            Avg. Cost / Live
          </span>
          <span className="text-[10px] font-semibold text-mist font-mono">
            ${avgCost.toFixed(2)} / ${currentPrice.toFixed(2)}
          </span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-[9px] text-mist font-bold uppercase tracking-wider">
            Profit / Loss
          </span>
          <span
            className={`text-xs font-bold font-mono ${isProfit ? "text-gain" : "text-loss"}`}
          >
            {isProfit ? "+" : ""}
            {pnlAmount.toFixed(2)} ({isProfit ? "+" : ""}
            {pnlPercentage.toFixed(2)}%)
          </span>
        </div>
      </div>

      <div className="w-full pt-3 border-t border-white/6 flex flex-col space-y-1">
        <div className="flex items-center justify-between text-[9px] font-bold text-mist uppercase tracking-wider">
          <span>Portfolio Weight</span>
          <span className="text-foam/85 font-mono">{weightString}</span>
        </div>
        <div className="w-full h-1 bg-white/8 rounded-full overflow-hidden">
          <div
            className={`h-full ${barColor} rounded-full`}
            style={{ width: weightString }}
          ></div>
        </div>
      </div>
    </div>
  )
}

export default CardPortfolio
