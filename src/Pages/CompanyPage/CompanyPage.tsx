import { useEffect, useState } from "react"
import { useParams, Outlet } from "react-router"
import type { CompanyProfile } from "../../company"
import { getCompanyProfile } from "../../api"
import Sidebar from "../../Components/Sidebar/Sidebar"
import CompanyDashboard from "../../Components/CompanyDashboard/CompanyDashboard"
import Tile from "../../Components/Tile/Tile"
import Spinners from "../../Components/Spinners/Spinners"
import StockComment from "../../Components/StockComment/StockComment"
import { formatLargeNonMonetaryNumber } from "../../Helpers/NumberFormatting"
import { searchStocksBySymbolAPI } from "../../Services/StockService"

const allowedStocks = ["AAPL", "MSFT", "NVDA", "TSLA", "GOOGL"]

const CompanyPage = () => {
  const { ticker } = useParams()
  const [company, setCompany] = useState<CompanyProfile>()
  const [localDbId, setLocalDbId] = useState<number | null>(null)

  useEffect(() => {
    if (!allowedStocks.includes(ticker?.toUpperCase() || "")) return

    const getProfileInit = async () => {
      const result = await getCompanyProfile(ticker!)
      setCompany(result?.data[0])

      try {
        const dbResult = await searchStocksBySymbolAPI(ticker?.toUpperCase() ?? "")
        if (dbResult && dbResult.data && dbResult.data.length > 0) {
          const matchedStock = dbResult.data[0]
          setLocalDbId(matchedStock.id || matchedStock.Id || null)
        }
      } catch (err) {
        console.error("Failed to fetch stock ID from local database:", err)
      }
    }
    getProfileInit()
  }, [ticker])

  if (!allowedStocks.includes(ticker?.toUpperCase() || "")) {
    return (
      <div className="w-full relative flex ct-docs-disable-sidebar-content overflow-x-hidden bg-abyss text-foam min-h-screen">
        <Sidebar />
        <CompanyDashboard>
          <div className="w-full bg-depth border border-ridge/40 rounded-2xl p-8 shadow-2xl flex flex-col items-center justify-center text-center min-h-[450px] space-y-4 my-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 text-2xl shadow-sm">
              📊
            </div>
            <div className="flex flex-col space-y-1">
              <h3 className="text-lg font-bold text-foam tracking-tight">
                Financial Data Unavailable
              </h3>
              <p className="text-xs text-mist font-mono">
                SCOPE_LIMITATION_WARNING // LIVE_DEMO_RESTRICITON
              </p>
            </div>
            <p className="text-sm text-mist max-w-md leading-relaxed">
              Financial data for <span className="font-bold font-mono text-pulse bg-pulse/10 px-1.5 py-0.5 rounded border border-pulse/20">{ticker?.toUpperCase()}</span> is currently unavailable for this demo version.
            </p>
            <div className="pt-2">
              <p className="text-[11px] text-mist font-medium bg-abyss/40 border border-ridge/20 px-3 py-1.5 rounded-xl font-mono">
                Please audit premium corporate tiers: AAPL, MSFT, NVDA, TSLA, GOOGL
              </p>
            </div>
          </div>
        </CompanyDashboard>
      </div>
    )
  }

  const renderMarketCap = (mktCap: number) => {
    const formatted = String(formatLargeNonMonetaryNumber(mktCap) ?? mktCap)
    if (formatted.endsWith("M") || formatted.endsWith("B") || formatted.endsWith("T")) {
      return "$" + formatted
    }
    return "$" + formatted + "T"
  }

  return (
    <>
      {company ? (
        <div className="w-full relative flex ct-docs-disable-sidebar-content overflow-x-hidden bg-abyss text-foam min-h-screen">
          <Sidebar />

          <CompanyDashboard>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full mb-6">
              <Tile title="Company Name" subTitle={company.companyName} />
              <Tile title="Price" subTitle={"$" + company.price.toFixed(2)} />
              <Tile title="Sector" subTitle={company.sector} />
              <Tile
                title="Market Cap"
                subTitle={renderMarketCap(company.mktCap)}
              />
            </div>

            <div className="w-full my-4">
              <Outlet context={ticker} />
            </div>

            <div className="w-full mt-6 border-t border-ridge/40 pt-6">
              {localDbId !== null && (
                <StockComment
                  stockSymbol={ticker!}
                  stockId={localDbId}
                />
              )}
            </div>
          </CompanyDashboard>
        </div>
      ) : (
        <div className="w-full min-h-screen bg-abyss flex items-center justify-center">
          <Spinners />
        </div>
      )}
    </>
  )
}

export default CompanyPage