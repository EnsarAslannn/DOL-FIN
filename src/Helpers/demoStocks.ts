/**
 * The tickers this build actually supports.
 *
 * Financial statements, company profiles and the discussion board are all
 * limited to the same five names, because those are the only ones with
 * complete demo data behind them. The list was previously copy-pasted into
 * five components; keeping one copy means adding a sixth ticker is one edit
 * rather than a hunt.
 */
export const DEMO_TICKERS = ["AAPL", "MSFT", "NVDA", "TSLA", "GOOGL"] as const

export const isDemoTicker = (symbol?: string | null) =>
  DEMO_TICKERS.includes((symbol ?? "").toUpperCase().trim() as (typeof DEMO_TICKERS)[number])
