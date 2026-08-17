import { useNavigate } from "react-router-dom"
import { companyLogos } from "../Table/TestData"
import GlassLogo from "../Dashboard/GlassLogo"

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
    <div className="w-full rounded-card bg-graphite-card ring-1 ring-inset ring-mist-border/6 p-card font-sans text-ivory-text">
      <div className="mb-5 flex items-center justify-between border-b border-mist-border/8 pb-3">
        <h3 className="flex items-center gap-3 text-subheading font-normal text-ivory-text">
          <span className="relative flex h-2 w-2 text-ivory-text">
            <span className="sonar-ring" />
            <span className="h-2 w-2 shrink-0 rounded-full bg-graphite-card" />
          </span>
          Market Trends
        </h3>
        <span className="font-mono text-caption font-normal uppercase tracking-label text-ash-text">
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
              className="flex cursor-pointer items-center justify-between rounded-card p-3 transition-colors duration-150 hover:bg-obsidian-button"
            >
              <div className="flex min-w-0 flex-1 items-center space-x-3 text-left">
                <GlassLogo className="h-8 w-8" padding="p-1.5">
                  {companyLogos[symbolUpper] ? (
                    companyLogos[symbolUpper]()
                  ) : (
                    <span className="font-mono text-caption font-bold text-ivory-text">
                      {item.symbol.substring(0, 2).toUpperCase()}
                    </span>
                  )}
                </GlassLogo>
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-body font-normal text-ivory-text">
                    {item.name}
                  </span>
                  <span className="font-mono text-caption font-normal uppercase tracking-label-sm text-ash-text">
                    {symbolUpper}
                  </span>
                </div>
              </div>

              <div className="flex shrink-0 flex-col items-end space-y-1 pl-3 text-right">
                <span className="whitespace-nowrap font-mono text-body font-normal text-ivory-text">
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