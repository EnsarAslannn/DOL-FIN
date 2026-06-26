import { testMarketTrendsData } from "../Table/TestData"

const MarketTicker = () => {
  const doubleData = [...testMarketTrendsData, ...testMarketTrendsData]

  return (
    <div className="w-full bg-gray-900 text-white py-2.5 border-b border-gray-800 overflow-hidden flex items-center select-none shadow-inner">
      <div className="animate-marquee gap-8">
        {doubleData.map((item, index) => (
          <div
            key={index}
            className="flex items-center space-x-2.5 mx-4 font-sans text-xs"
          >
            <img
              src={item.logoUrl}
              alt={item.name}
              className="w-4 h-4 object-contain rounded bg-white/10 p-0.5"
            />

            <span className="font-bold tracking-tight text-gray-200 uppercase">
              {item.name}
            </span>
            <span className="font-semibold text-gray-100 font-mono">
              {item.value}
            </span>
            <span
              className={`font-black text-[11px] ${item.isPositive ? "text-green-400" : "text-red-400"}`}
            >
              {item.isPositive ? "▲" : "▼"} {item.change}
            </span>
            <span className="text-gray-600 pl-4 font-light">|</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MarketTicker
