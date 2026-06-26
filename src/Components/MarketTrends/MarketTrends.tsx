import { useNavigate } from "react-router-dom"
import { companyLogos } from "../Table/TestData"

interface TrendStock {
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
    <div className="w-full bg-[#141a26] rounded-2xl border border-gray-800/60 shadow-xl p-5 font-sans text-gray-200">
      <div className="flex items-center justify-between mb-5 border-b border-gray-800 pb-3">
        <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981] animate-pulse"></span>
          Market Trends
        </h3>
        <span className="text-[10px] text-gray-500 font-bold uppercase bg-gray-800 px-2 py-0.5 rounded">
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
              className="flex items-center justify-between p-2 rounded-xl transition-all duration-150 hover:bg-[#1c2331] cursor-pointer border border-transparent hover:border-emerald-500/20 shadow-sm active:scale-[0.99]"
            >
              <div className="flex items-center space-x-3 text-left">
                <div className="w-7 h-7 rounded-lg bg-gray-800 border border-gray-700/50 p-1 flex items-center justify-center shrink-0">
                  {companyLogos[symbolUpper] ? (
                    companyLogos[symbolUpper]()
                  ) : (
                    <div className="w-full h-full bg-cyan-500/10 text-cyan-400 text-[9px] font-black flex items-center justify-center rounded">
                      {item.symbol.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-gray-200 text-xs tracking-tight">
                    {item.name} ({symbolUpper})
                  </span>
                  <span className="text-[10px] text-gray-500 uppercase font-medium tracking-tight">
                    Equity Asset
                  </span>
                </div>
              </div>

              <div className="flex flex-col text-right space-y-0.5">
                <span className="font-semibold text-gray-100 font-mono text-xs">
                  ${item.price.toFixed(2)}
                </span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded text-center min-w-[55px] ${isPositive ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
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