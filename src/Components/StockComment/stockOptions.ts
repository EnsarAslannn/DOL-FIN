import type { StockSearchResult } from "../../Models/StockSearchResult"
import { isDemoTicker } from "../../Helpers/demoStocks"

/**
 * A stock as the discussion board needs it: an id to post against and a
 * symbol to label and filter by.
 *
 * The API is inconsistent about casing across endpoints — `StockDto` returns
 * PascalCase over the wire in some responses and camelCase in others — so
 * every read of these fields goes through `toStockOption` rather than being
 * respelled at each call site.
 */
export interface StockOption {
  id: number
  symbol: string
  companyName: string
}

export const toStockOption = (raw: StockSearchResult): StockOption | null => {
  const id = raw.id ?? raw.Id
  const symbol = (raw.symbol ?? raw.Symbol ?? "").toUpperCase().trim()
  if (id === undefined || id === null || !symbol) return null
  return { id, symbol, companyName: raw.companyName ?? raw.CompanyName ?? "" }
}

/**
 * The stocks a comment may be posted against.
 *
 * The seed table carries fifteen tickers but only five have the demo data
 * behind them that makes a comment worth reading, and those five are the
 * only ones whose company pages resolve. Offering the other ten would invite
 * a comment on a name the reader cannot then go and look at.
 */
export const postableStocks = (stocks: StockOption[]) =>
  stocks.filter((s) => isDemoTicker(s.symbol))
