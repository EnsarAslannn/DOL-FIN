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
    <div className="glass-panel w-full rounded-2xl p-5 font-sans text-foam">
      <div className="flex items-center justify-between mb-5 border-b border-white/10 pb-3">
        <h3 className="text-xs font-bold text-pulse uppercase tracking-[0.14em] flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-pulse shadow-[0_0_10px_#ff571a] animate-pulse"></span>
          Market Trends
        </h3>
        <span className="text-[10px] text-mist font-bold uppercase tracking-[0.1em] bg-white/5 border border-white/8 px-2 py-0.5 rounded">
          Live Equities
        </span>
      </div>

      <div className="flex flex-col space-y-4 w-full">
        {stocks.map((item, index) => {
          const isPositive = item.changePercent >= 0
          const symbolUpper = item.symbol.toUpperCase()

          return (
            <div
              key={index}
              onClick={() => handleTrendClick(item.symbol)}
              className="flex items-center justify-between p-2.5 rounded-xl transition-all duration-150 hover:bg-white/5 cursor-pointer border border-transparent hover:border-pulse/25 active:scale-[0.99]"
            >
              <div className="flex items-center space-x-3 text-left">
                <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/8 p-1 flex items-center justify-center shrink-0">
                  {companyLogos[symbolUpper] ? (
                    companyLogos[symbolUpper]()
                  ) : (
                    <div className="w-full h-full bg-pulse-dim/10 text-pulse-dim text-[9px] font-bold flex items-center justify-center rounded">
                      {item.symbol.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-foam text-xs tracking-tight">
                    {item.name} ({symbolUpper})
                  </span>
                  <span className="text-[10px] text-mist uppercase font-medium tracking-tight">
                    Equity Asset
                  </span>
                </div>
              </div>

              <div className="flex flex-col text-right space-y-0.5">
                <span className="font-semibold text-foam font-mono text-xs">
                  ${item.price.toFixed(2)}
                </span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded text-center min-w-[55px] font-mono ${isPositive ? "bg-gain/10 text-gain" : "bg-loss/10 text-loss"
                    }`}
                >
                  {isPositive ? "+" : ""}{item.changePercent.toFixed(2)}%
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