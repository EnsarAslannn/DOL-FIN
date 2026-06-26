export type PortfolioGet = {
  id: number
  symbol: string
  companyName: string
  purchase: number
  lastDiv: number
  industry: string
  marketCap: number 
  comments: any
  quantity: number;   
  averagePrice: number
}

export type PortfolioPost = {
  symbol: string
  quantity: number 
}