import type { StockSearchResult } from "../../Models/StockSearchResult"
import { isDemoTicker } from "../../Helpers/demoStocks"

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

export const postableStocks = (stocks: StockOption[]) =>
  stocks.filter((s) => isDemoTicker(s.symbol))
