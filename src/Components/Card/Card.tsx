import React, { type SyntheticEvent } from "react"
import AddPortfolio from "../Portfolio/AddPortfolio/AddPortfolio"
import { Link } from "react-router-dom"
import { companyLogos } from "../../Components/Table/TestData"
import type { StockSearchResult } from "../../Models/StockSearchResult"

interface Props {
  id: string
  searchResult: StockSearchResult
  onPortfolioCreate: (e: SyntheticEvent) => void
}

const Card: React.FC<Props> = ({
  id,
  searchResult,
  onPortfolioCreate,
}: Props) => {
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
    { to: "balance-sheet", label: "Balance Sheet" },
    { to: "cashflow-statement", label: "Cash Flow" },
  ]

  return (
    <div
      className="my-3 flex w-full flex-col items-center justify-between rounded-card border border-slate-border/45 bg-graphite-card p-card transition-colors duration-200 hover:border-slate-border md:flex-row"
      key={id}
      id={id}
    >
      <div className="flex w-full items-start space-x-4 md:w-auto">
        {companyLogos[symbolUpper] ? (
          <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-icon border border-slate-border/45 bg-graphite-card p-2">
            {companyLogos[symbolUpper]()}
          </div>
        ) : (
          <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-icon border border-slate-border/45 bg-obsidian-button font-mono text-caption font-bold text-ivory-text">
            {symbolUpper}
          </div>
        )}

        <div className="flex flex-col space-y-2 text-left">
          <div className="relative flex flex-wrap items-center gap-2">
            <Link
              to={`/company/${symbolUpper}/company-profile`}
              className="text-subheading font-normal text-ivory-text underline-offset-4 hover:underline"
            >
              {name}
            </Link>
            <span className="rounded-smallcard border border-slate-border/45 bg-obsidian-button px-2 py-1 font-mono text-caption font-normal text-ash-text">
              {symbolUpper}
            </span>
          </div>

          <div className="flex items-center space-x-2 text-body font-normal text-ash-text">
            <span>{industry}</span>
            <span>•</span>
            <span className="font-mono">
              MCap: ${(marketCap / 1e9).toFixed(1)}B
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            {statementLinks.map((link) => (
              <Link
                key={link.to}
                to={`/company/${symbolUpper}/${link.to}`}
                className="rounded-smallcard border border-slate-border/45 px-3 py-1 text-caption font-normal text-ash-text transition-colors duration-150 hover:border-slate-border hover:text-ivory-text"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 flex w-full shrink-0 items-center justify-between space-x-6 md:mt-0 md:w-auto md:justify-end">
        <div className="flex flex-col items-end">
          <span className="font-mono text-subheading font-normal text-ivory-text">
            ${price.toFixed(2)}
          </span>
          <span
            className={`mt-1 font-mono text-body font-bold ${
              isPositive ? "text-gain" : "text-loss"
            }`}
          >
            {isPositive ? "▲ +1.45%" : "▼ -0.85%"}
          </span>
        </div>

        <AddPortfolio
          onPortfolioCreate={onPortfolioCreate}
          symbol={symbolUpper}
        />
      </div>
    </div>
  )
}

export default Card
