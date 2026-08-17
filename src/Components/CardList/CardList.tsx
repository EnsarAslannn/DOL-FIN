import React, { type SyntheticEvent } from "react"
import { motion } from "framer-motion"
import Card from "../Card/Card"
import EmptyState from "../Dashboard/EmptyState"
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
      <EmptyState
        variant="search"
        title="Nothing matched that search"
        description="Check the spelling, or try a ticker instead of a company name — try AAPL, TSLA or MSFT."
      />
    ) : (
      <EmptyState
        variant="search"
        title="Search for a company to begin"
        description="Look up any listed ticker to read its fundamentals and add it to your portfolio."
      />
    )
  }

  return (
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
  )
}

export default CardList
