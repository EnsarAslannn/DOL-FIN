import { testMarketTrendsData } from "../Table/TestData"

const MarketTicker = () => {
  const doubleData = [...testMarketTrendsData, ...testMarketTrendsData]

  return (
    <div className="relative w-full bg-black/40 backdrop-blur-md text-foam py-2.5 border-b border-white/8 overflow-hidden flex items-center select-none">
      {}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-abyss to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-abyss to-transparent" />
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

            <span className="font-bold tracking-tight text-foam/80 uppercase">
              {item.name}
            </span>
            <span className="font-semibold text-foam font-mono">
              {item.value}
            </span>
            <span
              className={`font-bold text-[11px] font-mono ${item.isPositive ? "text-gain" : "text-loss"}`}
            >
              {item.isPositive ? "▲" : "▼"} {item.change}
            </span>
            <span className="text-white/15 pl-4 font-light">|</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MarketTicker
