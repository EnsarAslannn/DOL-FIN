import React, { type SyntheticEvent } from "react"
import { motion } from "framer-motion"
import AddPortfolio from "../Portfolio/AddPortfolio/AddPortfolio"
import { Link } from "react-router-dom"
import { companyLogos } from "../../Components/Table/TestData"
import GlassLogo from "../Dashboard/GlassLogo"
import type { StockSearchResult } from "../../Models/StockSearchResult"
import { formatLargeMonetaryNumber } from "../../Helpers/NumberFormatting"
import { reveal } from "../../Helpers/motion"

interface Props {
  id: string
  searchResult: StockSearchResult
  onPortfolioCreate: (e: SyntheticEvent) => void
}

/** Shared by the row and its header, so the columns cannot drift apart. */
export const resultGridClass =
  "grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-[minmax(0,2.4fr)_minmax(0,1.1fr)_minmax(0,0.9fr)_minmax(0,0.9fr)_auto] md:items-center"

/**
 * One search result.
 *
 * A ledger row, laid out on the same column grammar as the wallet's holdings
 * table: identity on the left, the figures ranged right in mono, the action
 * last. The two lists are the only places in the product that enumerate
 * positions, and reading one should teach you how to read the other.
 *
 * It was a two-cluster flex row before — everything packed left, price and
 * button packed right. That is fine at 900px and falls apart at 1700, where
 * it leaves a third of the row empty down the middle. Distributing the same
 * facts across real columns is what lets the row use the full width without
 * spreading.
 *
 * Separated by a hairline rather than boxed, with fill only on hover. The
 * mark's glass plinth is the row's one piece of visual weight.
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
      className={`group border-b border-band-line/8 px-4 py-5 transition-colors duration-200 last:border-b-0 hover:bg-band-surface/60 md:px-6 ${resultGridClass}`}
      key={id}
      id={id}
    >
      <div className="flex min-w-0 items-start gap-4">
        <GlassLogo className="h-11 w-11" padding="p-2.5">
          {companyLogos[symbolUpper] ? (
            companyLogos[symbolUpper]()
          ) : (
            <span className="font-mono text-caption font-bold text-band-ink">
              {symbolUpper.slice(0, 4)}
            </span>
          )}
        </GlassLogo>

        <div className="flex min-w-0 flex-col gap-1.5 text-left">
          <div className="flex flex-wrap items-baseline gap-x-3">
            <Link
              to={`/company/${symbolUpper}/company-profile`}
              className="text-body-lg font-medium text-band-ink underline-offset-4 hover:underline"
            >
              {name}
            </Link>
            <span className="font-mono text-caption font-normal uppercase tracking-label-sm text-band-subtle">
              {symbolUpper}
            </span>
          </div>

          {/* Ghost links, brought up on hover at desktop so a long result
              list stays quiet until a row is being considered. */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 md:opacity-70 md:transition-opacity md:duration-200 md:group-hover:opacity-100">
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

      <div className="truncate text-left text-body font-normal text-band-muted">
        {industry}
      </div>

      <div className="text-left font-mono text-body font-normal text-band-muted md:text-right">
        {/* The hand-rolled `/1e9` printed Microsoft as $3100.0B. The shared
            formatter already steps up to T, and using it keeps the figure
            spelled the same way it is on the company profile. */}
        {formatLargeMonetaryNumber(marketCap) ?? "—"}
      </div>

      <div className="flex flex-col items-start md:items-end">
        <span className="font-mono text-body-lg font-normal text-band-ink">
          ${price.toFixed(2)}
        </span>
        <span
          className={`mt-1 font-mono text-caption font-bold ${
            isPositive ? "text-band-gain" : "text-band-loss"
          }`}
        >
          {isPositive ? "▲ +1.45%" : "▼ −0.85%"}
        </span>
      </div>

      <AddPortfolio onPortfolioCreate={onPortfolioCreate} symbol={symbolUpper} />
    </motion.div>
  )
}

export default Card
