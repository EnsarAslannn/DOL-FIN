import React, { type SyntheticEvent } from "react"
import { motion } from "framer-motion"
import AddPortfolio from "../Portfolio/AddPortfolio/AddPortfolio"
import { Link } from "react-router-dom"
import { companyLogos } from "../../Components/Table/TestData"
import GlassLogo from "../Dashboard/GlassLogo"
import type { StockSearchResult } from "../../Models/StockSearchResult"
import { reveal } from "../../Helpers/motion"

interface Props {
  id: string
  searchResult: StockSearchResult
  onPortfolioCreate: (e: SyntheticEvent) => void
}

/**
 * One search result.
 *
 * A row on the canvas rather than a bordered card: a hairline separates it
 * from the next, and the only fill appears on hover. The company mark sits on
 * the frosted glass plinth, which is the one piece of visual weight the row
 * carries — everything else is type on the canvas.
 *
 * Entrance is driven by the parent list's stagger via the shared `reveal`
 * variant, so results arrive in sequence as the response lands.
 */
const Card: React.FC<Props> = ({ id, searchResult, onPortfolioCreate }: Props) => {
  const symbol = searchResult.symbol || searchResult.Symbol || ""
  const name =
    searchResult.companyName ||
    searchResult.CompanyName ||
    searchResult.name ||
    ""
  const price = searchResult.purchase || searchResult.Purchase || 0
  const industry =
    searchResult.industry || searchResult.Industry || "Equity Market"
  const marketCap = searchResult.marketCap || searchResult.MarketCap || 0

  const symbolUpper = symbol.toUpperCase()
  const isPositive = price > 150

  const statementLinks = [
    { to: "company-profile", label: "Profile" },
    { to: "income-statement", label: "Income" },
    { to: "balance-sheet", label: "Balance sheet" },
    { to: "cashflow-statement", label: "Cash flow" },
  ]

  return (
    <motion.div
      variants={reveal}
      className="group flex w-full flex-col justify-between gap-6 border-b border-band-line/8 px-4 py-6 transition-colors duration-200 last:border-b-0 hover:bg-band-surface/60 md:flex-row md:items-center md:px-6"
      key={id}
      id={id}
    >
      <div className="flex w-full items-start gap-5 md:w-auto">
        <GlassLogo className="h-12 w-12" padding="p-2.5">
          {companyLogos[symbolUpper] ? (
            companyLogos[symbolUpper]()
          ) : (
            <span className="font-mono text-caption font-bold text-band-ink">
              {symbolUpper.slice(0, 4)}
            </span>
          )}
        </GlassLogo>

        <div className="flex min-w-0 flex-col gap-2 text-left">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <Link
              to={`/company/${symbolUpper}/company-profile`}
              className="text-subheading font-medium text-band-ink underline-offset-4 hover:underline"
            >
              {name}
            </Link>
            <span className="font-mono text-caption font-normal uppercase tracking-label-sm text-band-subtle">
              {symbolUpper}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-2 text-body font-normal text-band-muted">
            <span>{industry}</span>
            <span aria-hidden="true" className="text-band-subtle">
              ·
            </span>
            <span className="font-mono">
              ${(marketCap / 1e9).toFixed(1)}B mkt cap
            </span>
          </div>

          {/* Ghost links, revealed on hover at desktop so a long result list
              stays quiet until the row is being considered. */}
          <div className="mt-1 flex flex-wrap items-center gap-x-5 gap-y-2 md:opacity-70 md:transition-opacity md:duration-200 md:group-hover:opacity-100">
            {statementLinks.map((link) => (
              <Link
                key={link.to}
                to={`/company/${symbolUpper}/${link.to}`}
                className="text-caption font-normal text-band-muted underline-offset-4 transition-colors duration-150 hover:text-band-ink hover:underline"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="flex w-full shrink-0 items-center justify-between gap-8 md:w-auto md:justify-end">
        <div className="flex flex-col items-start md:items-end">
          <span className="font-mono text-subheading font-normal text-band-ink">
            ${price.toFixed(2)}
          </span>
          <span
            className={`mt-1 font-mono text-body font-bold ${
              isPositive ? "text-band-gain" : "text-band-loss"
            }`}
          >
            {isPositive ? "▲ +1.45%" : "▼ −0.85%"}
          </span>
        </div>

        <AddPortfolio onPortfolioCreate={onPortfolioCreate} symbol={symbolUpper} />
      </div>
    </motion.div>
  )
}

export default Card
