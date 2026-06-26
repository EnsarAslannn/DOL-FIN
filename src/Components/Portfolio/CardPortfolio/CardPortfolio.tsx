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
  const barColor = isProfit ? "bg-emerald-400" : "bg-rose-400"

  return (
    <div className="group relative flex flex-col p-5 bg-[#141a26] rounded-2xl border border-gray-800/60 shadow-lg transition-all duration-200 hover:border-gray-700 hover:bg-[#1a2130]">
      <div className="absolute top-3 right-3 opacity-30 group-hover:opacity-100 transition-opacity cursor-pointer z-10 text-gray-400">
        <DeletePortfolio
          portfolioValue={portfolioValue.symbol}
          onPortfolioDelete={onPortfolioDelete}
        />
      </div>

      <div className="flex items-center space-x-3 border-b border-gray-800/50 pb-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gray-800 border border-gray-700/50 p-2 flex items-center justify-center shrink-0">
          {companyLogos[symbolUpper] ? (
            companyLogos[symbolUpper]()
          ) : (
            <div className="font-bold text-emerald-400 text-xs tracking-wide">
              {symbolUpper.substring(0, 2)}
            </div>
          )}
        </div>
        <div className="flex flex-col text-left">
          <Link
            to={`/company/${portfolioValue.symbol}/company-profile`}
            className="text-sm font-black text-white hover:text-emerald-400 transition-colors uppercase tracking-tight"
          >
            {portfolioValue.symbol}
          </Link>
          <span className="text-[10px] text-gray-500 font-bold font-mono">
            {quantity} Shares
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-y-3 text-left mb-4">
        <div className="flex flex-col">
          <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">
            Invested
          </span>
          <span className="text-xs font-bold text-gray-300 font-mono">
            ${totalCost.toFixed(2)}
          </span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">
            Current Value
          </span>
          <span className="text-xs font-black text-white font-mono">
            ${currentTotalValue.toFixed(2)}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">
            Avg. Cost / Live
          </span>
          <span className="text-[10px] font-semibold text-gray-400 font-mono">
            ${avgCost.toFixed(2)} / ${currentPrice.toFixed(2)}
          </span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">
            Profit / Loss
          </span>
          <span
            className={`text-xs font-black font-mono ${isProfit ? "text-emerald-400" : "text-rose-400"}`}
          >
            {isProfit ? "+" : ""}
            {pnlAmount.toFixed(2)} ({isProfit ? "+" : ""}
            {pnlPercentage.toFixed(2)}%)
          </span>
        </div>
      </div>

      <div className="w-full pt-3 border-t border-gray-800/40 flex flex-col space-y-1">
        <div className="flex items-center justify-between text-[9px] font-bold text-gray-500 uppercase tracking-wider">
          <span>Portfolio Weight</span>
          <span className="text-gray-300 font-mono">{weightString}</span>
        </div>
        <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
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
