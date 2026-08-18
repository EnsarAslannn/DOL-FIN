import { testMarketTrendsData } from "../Table/TestData"
import GlassLogo from "../Dashboard/GlassLogo"

/**
 * The market tape.
 *
 * A single full-bleed strip that runs under the navbar on the authenticated
 * pages. It is ambient by design: nothing in it is clickable and nothing in
 * it is the reason you came to the page, so it sits on Graphite one step off
 * the Onyx canvas and stays at caption size.
 *
 * The row is duplicated because the marquee keyframe translates by exactly
 * -50%: at that offset the second copy is sitting where the first began, so
 * the loop has no seam. Both copies are hidden from assistive tech — a
 * screen reader announcing fifteen tickers twice, on every page, is noise —
 * and the strip carries no live region for the same reason.
 */
const MarketTicker = () => {
  const doubled = [...testMarketTrendsData, ...testMarketTrendsData]

  return (
    <div
      aria-hidden="true"
      className="relative flex w-full select-none items-center overflow-hidden border-y border-mist-border/6 bg-graphite-card py-3"
    >
      {/* The tape runs off both edges rather than stopping at them, so the
          strip reads as a window onto a longer feed. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-graphite-card to-transparent sm:w-32" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-graphite-card to-transparent sm:w-32" />

      <div className="animate-marquee flex w-max items-center">
        {doubled.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-2.5 px-5 font-sans text-caption"
          >
            <GlassLogo className="h-6 w-6" padding="p-1">
              <img
                src={item.logoUrl}
                alt=""
                className="h-full w-full rounded-smallcard object-contain"
              />
            </GlassLogo>
            <span className="whitespace-nowrap font-normal uppercase tracking-label-sm text-ash-text">
              {item.name}
            </span>
            <span className="whitespace-nowrap font-mono font-normal text-ivory-text">
              {item.value}
            </span>
            <span
              className={`whitespace-nowrap font-mono font-bold ${
                item.isPositive ? "text-gain" : "text-loss"
              }`}
            >
              {item.isPositive ? "▲" : "▼"} {item.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MarketTicker
