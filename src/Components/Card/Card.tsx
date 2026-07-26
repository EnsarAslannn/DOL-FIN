import React, { type SyntheticEvent } from "react"
import "./Card.css"
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

  return (
    <div
      className="flex flex-col md:flex-row items-center justify-between p-5 my-3 w-full bg-depth rounded-2xl border border-ridge/40 shadow-xl transition-all duration-200 hover:border-ridge group/card"
      key={id}
      id={id}
    >
      <div className="flex items-start space-x-4 w-full md:w-auto">
        {companyLogos[symbolUpper] ? (
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-depth-2 border border-ridge/50 p-2.5 shrink-0 mt-1 shadow-2xs">
            {companyLogos[symbolUpper]()}
            <span className="sonar-ring opacity-0 group-hover/card:opacity-100" />
          </div>
        ) : (
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-pulse/10 text-pulse font-bold text-base shrink-0 mt-1 border border-pulse/20">
            {symbolUpper}
            <span className="sonar-ring opacity-0 group-hover/card:opacity-100" />
          </div>
        )}

        <div className="flex flex-col text-left space-y-1.5">
          <div className="relative flex items-center flex-wrap gap-2 group">
            <Link
              to={`/company/${symbolUpper}/company-profile`}
              className="font-bold text-foam hover:text-pulse transition-colors tracking-tight text-base"
            >
              {name}
            </Link>
            <span className="px-2 py-0.5 bg-depth-2 text-mist font-semibold text-xs rounded-md border border-ridge/40 font-mono">
              {symbolUpper}
            </span>
          </div>

          <div className="flex items-center space-x-2 text-xs text-mist font-medium tracking-wide">
            <span>{industry}</span>
            <span>•</span>
            <span className="font-mono text-[11px] text-mist/80">
              MCap: ${(marketCap / 1e9).toFixed(1)}B
            </span>
          </div>

          <div className="flex items-center flex-wrap gap-2 pt-1">
            <Link
              to={`/company/${symbolUpper}/company-profile`}
              className="text-[11px] font-bold text-mist bg-depth-2/60 hover:bg-pulse/10 hover:text-pulse border border-ridge/40 px-2.5 py-1 rounded-md transition-all duration-150 flex items-center gap-1 shadow-2xs"
            >
              📊 Profile
            </Link>
            <Link
              to={`/company/${symbolUpper}/income-statement`}
              className="text-[11px] font-bold text-mist bg-depth-2/60 hover:bg-pulse/10 hover:text-pulse border border-ridge/40 px-2.5 py-1 rounded-md transition-all duration-150 flex items-center gap-1 shadow-2xs"
            >
              📈 Income
            </Link>
            <Link
              to={`/company/${symbolUpper}/balance-sheet`}
              className="text-[11px] font-bold text-mist bg-depth-2/60 hover:bg-pulse/10 hover:text-pulse border border-ridge/40 px-2.5 py-1 rounded-md transition-all duration-150 flex items-center gap-1 shadow-2xs"
            >
              🧾 Balance Sheet
            </Link>
            <Link
              to={`/company/${symbolUpper}/cashflow-statement`}
              className="text-[11px] font-bold text-mist bg-depth-2/60 hover:bg-pulse/10 hover:text-pulse border border-ridge/40 px-2.5 py-1 rounded-md transition-all duration-150 flex items-center gap-1 shadow-2xs"
            >
              💸 Cash Flow
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-5 md:mt-0 w-full md:w-auto flex items-center justify-between md:justify-end space-x-6 shrink-0">
        <div className="flex flex-col text-right">
          <span className="font-bold text-foam text-base tracking-tight font-mono">
            ${price.toFixed(2)}
          </span>
          <span
            className={`text-[10px] font-bold px-1.5 py-0.5 rounded text-center mt-0.5 min-w-[55px] font-mono ${isPositive
                ? "bg-gain/10 text-gain"
                : "bg-loss/10 text-loss"
              }`}
          >
            {isPositive ? "+1.45%" : "-0.85%"}
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
