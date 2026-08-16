import { testMarketTrendsData } from "../Table/TestData"

const MarketTicker = () => {
  // Duplicated so the -50% marquee keyframe loops seamlessly.
  const doubleData = [...testMarketTrendsData, ...testMarketTrendsData]

  return (
    // A deliberate full-bleed tape, not a hairline seam: no top border (it
    // reads as an artifact against the dark hero it butts into), a single
    // bottom rule, and enough vertical padding to carry its own weight.
    <div className="relative flex w-full select-none items-center overflow-hidden border-b border-mist-gray bg-paper-white py-5 text-carbon-black">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-paper-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-paper-white to-transparent" />
      <div className="animate-marquee gap-8">
        {doubleData.map((item, index) => (
          <div
            key={index}
            className="mx-4 flex items-center space-x-2.5 font-sans text-caption"
          >
            <img
              src={item.logoUrl}
              alt={item.name}
              className="h-4 w-4 rounded-smallcard object-contain"
            />

            <span className="font-normal uppercase tracking-[0.04em] text-zinc-gray">
              {item.name}
            </span>
            <span className="font-mono font-normal text-carbon-black">
              {item.value}
            </span>
            <span
              className={`font-mono font-bold ${item.isPositive ? "text-gain" : "text-loss"}`}
            >
              {item.isPositive ? "▲" : "▼"} {item.change}
            </span>
            <span className="pl-4 font-normal text-mist-gray">|</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MarketTicker
