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
    <div className="group relative flex flex-col rounded-card border border-mist-gray bg-paper-white p-card transition-colors duration-200 hover:border-ash-gray">
      <div className="absolute right-3 top-3 z-10 cursor-pointer opacity-40 transition-opacity group-hover:opacity-100">
        <DeletePortfolio
          portfolioValue={portfolioValue.symbol}
          onPortfolioDelete={onPortfolioDelete}
        />
      </div>

      <div className="mb-4 flex items-center space-x-3 border-b border-mist-gray pb-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-icon border border-mist-gray bg-paper-white p-2">
          {companyLogos[symbolUpper] ? (
            companyLogos[symbolUpper]()
          ) : (
            <div className="font-mono text-caption font-bold text-carbon-black">
              {symbolUpper.substring(0, 2)}
            </div>
          )}
        </div>
        <div className="flex flex-col text-left">
          <Link
            to={`/company/${portfolioValue.symbol}/company-profile`}
            className="text-subheading font-normal uppercase text-carbon-black underline-offset-4 hover:underline"
          >
            {portfolioValue.symbol}
          </Link>
          <span className="font-mono text-caption font-normal text-zinc-gray">
            {quantity} Shares
          </span>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-y-3 text-left">
        <div className="flex flex-col">
          <span className="font-mono text-caption font-normal uppercase tracking-[0.12em] text-zinc-gray">
            Invested
          </span>
          <span className="font-mono text-body font-normal text-carbon-black">
            ${totalCost.toFixed(2)}
          </span>
        </div>
        <div className="flex flex-col text-right">
          <span className="font-mono text-caption font-normal uppercase tracking-[0.12em] text-zinc-gray">
            Current Value
          </span>
          <span className="font-mono text-body font-normal text-carbon-black">
            ${currentTotalValue.toFixed(2)}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="font-mono text-caption font-normal uppercase tracking-[0.12em] text-zinc-gray">
            Avg. Cost / Live
          </span>
          <span className="font-mono text-body font-normal text-zinc-gray">
            ${avgCost.toFixed(2)} / ${currentPrice.toFixed(2)}
          </span>
        </div>
        <div className="flex flex-col text-right">
          <span className="font-mono text-caption font-normal uppercase tracking-[0.12em] text-zinc-gray">
            Profit / Loss
          </span>
          <span
            className={`font-mono text-body font-bold ${isProfit ? "text-gain" : "text-loss"}`}
          >
            {isProfit ? "▲ +" : "▼ "}
            {pnlAmount.toFixed(2)} ({isProfit ? "+" : ""}
            {pnlPercentage.toFixed(2)}%)
          </span>
        </div>
      </div>

      <div className="flex w-full flex-col space-y-1.5 border-t border-mist-gray pt-3">
        <div className="flex items-center justify-between font-mono text-caption font-normal uppercase tracking-[0.12em] text-zinc-gray">
          <span>Portfolio Weight</span>
          <span className="text-carbon-black">{weightString}</span>
        </div>
        <div className="h-1 w-full overflow-hidden rounded-pill bg-mist-gray">
          <div
            className={`h-full ${barColor} rounded-pill`}
            style={{ width: weightString }}
          ></div>
        </div>
      </div>
    </div>
  )
}

export default CardPortfolio
