import type { SyntheticEvent } from "react"
import CardPortfolio from "../CardPortfolio/CardPortfolio"
import type { PortfolioGet } from "../../../Models/Portfolio"

type Props = {
  portfolioValues: PortfolioGet[]
  onPortfolioDelete: (e: SyntheticEvent) => void
}

const ListPortfolio = ({ portfolioValues, onPortfolioDelete }: Props) => {
  const totalPortfolioInvested = portfolioValues
    ? portfolioValues.reduce((sum, item) => {
      const qty = item.quantity || 0
      const avg = item.averagePrice || 0
      return sum + qty * avg
    }, 0)
    : 0

  return (
    <div className="flex flex-col space-y-4">
      <h3 className="text-2xl font-bold text-foam tracking-[-0.02em] font-display border-b border-white/8 pb-3 text-left">
        My Portfolio
      </h3>

      {portfolioValues && portfolioValues.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
          {portfolioValues.map((portfolioValue, index) => {
            return (
              <CardPortfolio
                key={index}
                portfolioValue={portfolioValue}
                onPortfolioDelete={onPortfolioDelete}
                totalPortfolioInvested={totalPortfolioInvested}
              />
            )
          })}
        </div>
      ) : (
        <div className="py-16 text-center glass-panel rounded-2xl">
          <span className="text-sm font-medium text-mist">
            Your portfolio is currently empty.
          </span>
        </div>
      )}
    </div>
  )
}

export default ListPortfolio
