import type { SyntheticEvent } from "react"
import { motion } from "framer-motion"
import CardPortfolio from "../CardPortfolio/CardPortfolio"
import EmptyState from "../../Dashboard/EmptyState"
import { PanelHeader } from "../../Dashboard/Panel"
import Reveal from "../../Dashboard/Reveal"
import { usePrefersReducedMotion } from "../../../Helpers/usePrefersReducedMotion"
import { revealGroup, revealProps } from "../../../Helpers/motion"
import type { PortfolioGet } from "../../../Models/Portfolio"

type Props = {
  portfolioValues: PortfolioGet[]
  onPortfolioDelete: (e: SyntheticEvent) => void
}

const ListPortfolio = ({ portfolioValues, onPortfolioDelete }: Props) => {
  const prefersReducedMotion = usePrefersReducedMotion()

  const holdings = portfolioValues ?? []
  const totalPortfolioInvested = holdings.reduce((sum, item) => {
    const qty = item.quantity || 0
    const avg = item.averagePrice || 0
    return sum + qty * avg
  }, 0)

  return (
    <div className="flex flex-col gap-8">
      <Reveal>
        <PanelHeader
          eyebrow="Holdings"
          title="My portfolio"
          lead={
            holdings.length > 0
              ? `${holdings.length} position${holdings.length === 1 ? "" : "s"} · ${totalPortfolioInvested.toFixed(2)} invested`
              : undefined
          }
        />
      </Reveal>

      {holdings.length > 0 ? (
        <motion.div
          variants={revealGroup}
          {...revealProps(prefersReducedMotion)}
          className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
        >
          {holdings.map((portfolioValue, index) => (
            <CardPortfolio
              key={portfolioValue.symbol ?? index}
              portfolioValue={portfolioValue}
              onPortfolioDelete={onPortfolioDelete}
              totalPortfolioInvested={totalPortfolioInvested}
            />
          ))}
        </motion.div>
      ) : (
        <EmptyState
          variant="wallet"
          title="No positions yet"
          description="Search for a ticker above and add it to start tracking cost basis, current value and weight."
        />
      )}
    </div>
  )
}

export default ListPortfolio
