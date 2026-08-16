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
      <h3 className="border-b border-mist-gray pb-3 text-left text-heading font-normal text-carbon-black">
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
        <div className="rounded-card border border-mist-gray bg-fog-gray py-16 text-center">
          <span className="text-body font-normal text-zinc-gray">
            Your portfolio is currently empty.
          </span>
        </div>
      )}
    </div>
  )
}

export default ListPortfolio
