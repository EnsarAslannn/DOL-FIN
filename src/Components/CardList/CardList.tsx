import React, { type SyntheticEvent } from "react"
import { motion } from "framer-motion"
import Card, { resultGridClass } from "../Card/Card"
import SearchEmptyState from "../Dashboard/SearchEmptyState"
import { usePrefersReducedMotion } from "../../Helpers/usePrefersReducedMotion"
import { revealGroup } from "../../Helpers/motion"
import type { StockSearchResult } from "../../Models/StockSearchResult"

interface Props {
  searchResults: StockSearchResult[]
  onPortfolioCreate: (e: SyntheticEvent) => void
  /**
   * Distinguishes "nothing matched" from "no query yet". Both are empty, but
   * only one of them is a dead end worth illustrating.
   */
  hasSearched?: boolean
}

/**
 * The search result list.
 *
 * Acts as the stagger container: each Card carries the `reveal` variant, so
 * results cascade in rather than appearing as one block. The `key` on the
 * motion list is the result count, which re-runs the entrance on every new
 * response instead of leaving later results static.
 */
const CardList: React.FC<Props> = ({
  searchResults,
  onPortfolioCreate,
  hasSearched = false,
}: Props) => {
  const prefersReducedMotion = usePrefersReducedMotion()

  if (searchResults.length === 0) {
    return hasSearched ? (
      <SearchEmptyState
        title="Nothing matched that search"
        description="Check the spelling, or try a ticker instead of a company name — try AAPL, TSLA or MSFT."
      />
    ) : (
      <SearchEmptyState />
    )
  }

  return (
    <div className="w-full">
      {/* Column labels, on the same grid the rows use. The wallet's holdings
          table is headed the same way; these are the product's two lists of
          positions and they should be read the same way. Hidden below md,
          where the rows stack and a header would label nothing. */}
      <div
        aria-hidden="true"
        className={`hidden border-b border-band-line/10 px-4 pb-3 font-mono text-caption font-normal uppercase tracking-label text-band-subtle md:grid md:px-6 ${resultGridClass}`}
      >
        <span>Company</span>
        <span>Industry</span>
        <span className="md:text-right">Market cap</span>
        <span className="md:text-right">Price</span>
        <span className="w-[72px]" />
      </div>

    <motion.div
      key={searchResults.length}
      variants={revealGroup}
      {...(prefersReducedMotion
        ? {}
        : { initial: "hidden" as const, animate: "visible" as const })}
      className="flex flex-col"
    >
      {searchResults.map((result, index) => {
        const currentSymbol = result.symbol || result.Symbol || `stock-${index}`

        return (
          <Card
            id={currentSymbol}
            key={currentSymbol}
            searchResult={result}
            onPortfolioCreate={onPortfolioCreate}
          />
        )
      })}
    </motion.div>
    </div>
  )
}

export default CardList
