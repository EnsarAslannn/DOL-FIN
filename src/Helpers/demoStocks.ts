export const DEMO_TICKERS = ["AAPL", "MSFT", "NVDA", "TSLA", "GOOGL"] as const

export const isDemoTicker = (symbol?: string | null) =>
  DEMO_TICKERS.includes((symbol ?? "").toUpperCase().trim() as (typeof DEMO_TICKERS)[number])
