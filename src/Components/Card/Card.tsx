import React, { type SyntheticEvent } from "react"
import "./Card.css"
import AddPortfolio from "../Portfolio/AddPortfolio/AddPortfolio"
import { Link } from "react-router-dom"
import { companyLogos } from "../../Components/Table/TestData"

interface Props {
  id: string
  searchResult: any
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
      className="flex flex-col md:flex-row items-center justify-between p-5 my-3 w-full bg-[#141a26] rounded-2xl border border-gray-800/60 shadow-xl transition-all duration-200 hover:border-gray-700"
      key={id}
      id={id}
    >
      <div className="flex items-start space-x-4 w-full md:w-auto">
        {companyLogos[symbolUpper] ? (
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gray-800 border border-gray-700/50 p-2.5 shrink-0 mt-1 shadow-2xs">
            {companyLogos[symbolUpper]()}
          </div>
        ) : (
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-400 font-bold text-base shrink-0 mt-1 border border-emerald-500/20">
            {symbolUpper}
          </div>
        )}

        <div className="flex flex-col text-left space-y-1.5">
          <div className="relative flex items-center flex-wrap gap-2 group">
            <Link
              to={`/company/${symbolUpper}/company-profile`}
              className="font-bold text-white hover:text-emerald-400 transition-colors tracking-tight text-base"
            >
              {name}
            </Link>
            <span className="px-2 py-0.5 bg-gray-800 text-gray-300 font-semibold text-xs rounded-md border border-gray-700/40 font-mono">
              {symbolUpper}
            </span>
          </div>

          <div className="flex items-center space-x-2 text-xs text-gray-500 font-medium tracking-wide">
            <span>{industry}</span>
            <span>•</span>
            <span className="font-mono text-[11px] text-gray-400">
              MCap: ${(marketCap / 1e9).toFixed(1)}B
            </span>
          </div>

          <div className="flex items-center flex-wrap gap-2 pt-1">
            <Link
              to={`/company/${symbolUpper}/company-profile`}
              className="text-[11px] font-bold text-gray-400 bg-gray-800/40 hover:bg-emerald-500/10 hover:text-emerald-400 border border-gray-700/50 px-2.5 py-1 rounded-md transition-all duration-150 flex items-center gap-1 shadow-2xs"
            >
              📊 Profile
            </Link>
            <Link
              to={`/company/${symbolUpper}/income-statement`}
              className="text-[11px] font-bold text-gray-400 bg-gray-800/40 hover:bg-emerald-500/10 hover:text-emerald-400 border border-gray-700/50 px-2.5 py-1 rounded-md transition-all duration-150 flex items-center gap-1 shadow-2xs"
            >
              📈 Income
            </Link>
            <Link
              to={`/company/${symbolUpper}/balance-sheet`}
              className="text-[11px] font-bold text-gray-400 bg-gray-800/40 hover:bg-emerald-500/10 hover:text-emerald-400 border border-gray-700/50 px-2.5 py-1 rounded-md transition-all duration-150 flex items-center gap-1 shadow-2xs"
            >
              🧾 Balance Sheet
            </Link>
            <Link
              to={`/company/${symbolUpper}/cashflow-statement`}
              className="text-[11px] font-bold text-gray-400 bg-gray-800/40 hover:bg-emerald-500/10 hover:text-emerald-400 border border-gray-700/50 px-2.5 py-1 rounded-md transition-all duration-150 flex items-center gap-1 shadow-2xs"
            >
              💸 Cash Flow
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-5 md:mt-0 w-full md:w-auto flex items-center justify-between md:justify-end space-x-6 shrink-0">
        <div className="flex flex-col text-right">
          <span className="font-bold text-white text-base tracking-tight font-mono">
            ${price.toFixed(2)}
          </span>
          <span
            className={`text-[10px] font-bold px-1.5 py-0.5 rounded text-center mt-0.5 min-w-[55px] ${isPositive
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-rose-500/10 text-rose-400"
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
