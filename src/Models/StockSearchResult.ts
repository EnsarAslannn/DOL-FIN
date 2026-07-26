// The backend serializes StockDto with PascalCase property names, while
// some mock/fallback data elsewhere in the app uses camelCase — this type
// reflects both so lookups can safely fall back between the two casings.
export type StockSearchResult = {
  id?: number
  Id?: number
  symbol?: string
  Symbol?: string
  companyName?: string
  CompanyName?: string
  name?: string
  purchase?: number
  Purchase?: number
  industry?: string
  Industry?: string
  marketCap?: number
  MarketCap?: number
}
