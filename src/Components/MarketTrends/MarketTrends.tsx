import { useNavigate } from "react-router-dom"
import { companyLogos } from "../Table/TestData"

export interface TrendStock {
  name: string
  symbol: string
  price: number
  changePercent: number
}

interface MarketTrendsProps {
  stocks: TrendStock[]
}

const MarketTrends = ({ stocks }: MarketTrendsProps) => {
  const navigate = useNavigate()
  const allowedEquities = ["MSFT", "AAPL", "TSLA", "NVDA", "GOOGL", "AMZN", "META", "NFLX", "AMD", "DIS", "BRK.B", "VISA", "JPM", "JNJ", "WMT"]

  const handleTrendClick = (symbol: string) => {
    if (allowedEquities.includes(symbol.toUpperCase())) {
      navigate(`/company/${symbol.toUpperCase()}/company-profile`)
    }
  }

  return (
    <div className="w-full rounded-card border border-mist-gray bg-paper-white p-card font-sans text-carbon-black">
      <div className="mb-5 flex items-center justify-between border-b border-mist-gray pb-3">
        <h3 className="flex items-center gap-2.5 text-subheading font-normal text-carbon-black">
          <span className="relative flex h-2 w-2 text-carbon-black">
            <span className="sonar-ring" />
            <span className="h-2 w-2 shrink-0 rounded-full bg-carbon-black" />
          </span>
          Market Trends
        </h3>
        <span className="font-mono text-caption font-normal uppercase tracking-[0.14em] text-zinc-gray">
          Live Equities
        </span>
      </div>

      <div className="flex w-full flex-col">
        {stocks.map((item, index) => {
          const isPositive = item.changePercent >= 0
          const symbolUpper = item.symbol.toUpperCase()

          return (
            <div
              key={index}
              onClick={() => handleTrendClick(item.symbol)}
              className="flex cursor-pointer items-center justify-between rounded-card p-2.5 transition-colors duration-150 hover:bg-fog-gray"
            >
              <div className="flex min-w-0 flex-1 items-center space-x-3 text-left">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-icon border border-mist-gray bg-paper-white p-1">
                  {companyLogos[symbolUpper] ? (
                    companyLogos[symbolUpper]()
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-smallcard font-mono text-caption font-bold text-carbon-black">
                      {item.symbol.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-body font-normal text-carbon-black">
                    {item.name}
                  </span>
                  <span className="font-mono text-caption font-normal uppercase tracking-[0.12em] text-zinc-gray">
                    {symbolUpper}
                  </span>
                </div>
              </div>

              <div className="flex shrink-0 flex-col items-end space-y-0.5 pl-3 text-right">
                <span className="whitespace-nowrap font-mono text-body font-normal text-carbon-black">
                  ${item.price.toFixed(2)}
                </span>
                <span
                  className={`whitespace-nowrap font-mono text-caption font-bold ${isPositive ? "text-gain" : "text-loss"}`}
                >
                  {isPositive ? "▲ +" : "▼ "}
                  {item.changePercent.toFixed(2)}%
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MarketTrends