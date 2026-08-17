import { useEffect, useState } from "react"
import { useParams, Outlet } from "react-router"
import type { CompanyProfile } from "../../company"
import { getCompanyProfile } from "../../api"
import Sidebar from "../../Components/Sidebar/Sidebar"
import CompanyDashboard from "../../Components/CompanyDashboard/CompanyDashboard"
import ProfileHeader from "../../Components/Dashboard/ProfileHeader"
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
      <div className="w-full relative flex ct-docs-disable-sidebar-content overflow-x-hidden bg-onyx-canvas text-ivory-text min-h-screen">
        <Sidebar />
        <CompanyDashboard>
          <div className="rounded-card bg-graphite-card ring-1 ring-inset ring-mist-border/6 w-full rounded-card p-8 flex flex-col items-center justify-center text-center min-h-[450px] space-y-4 my-4 animate-fadeIn">
            <div className="flex h-16 w-16 items-center justify-center rounded-icon bg-obsidian-button">
              <svg
                className="h-6 w-6 text-ivory-text"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18M7 15l3.5-4 3 2.5L20 7" />
              </svg>
            </div>
            <div className="flex flex-col space-y-1">
              <h3 className="text-subheading font-normal text-ivory-text tracking-tight">
                Financial Data Unavailable
              </h3>
              <p className="text-body text-ash-text font-mono">
                SCOPE_LIMITATION_WARNING // LIVE_DEMO_RESTRICITON
              </p>
            </div>
            <p className="text-body text-ash-text max-w-md leading-relaxed">
              Financial data for <span className="font-bold font-mono text-ivory-text bg-obsidian-button px-2 py-1 rounded ring-1 ring-inset ring-mist-border/8">{ticker?.toUpperCase()}</span> is currently unavailable for this demo version.
            </p>
            <div className="pt-2">
              <p className="text-caption text-ash-text font-normal bg-obsidian-button px-3 py-2 rounded-card font-mono">
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
        <div className="w-full relative flex ct-docs-disable-sidebar-content overflow-x-hidden bg-onyx-canvas text-ivory-text min-h-screen">
          <Sidebar />

          <CompanyDashboard>
            {/* The identity block is the layout's header, not the profile
                tab's — every statement tab renders under the same one, so
                the ticker you are reading never leaves the screen. */}
            <ProfileHeader
              symbol={company.symbol}
              companyName={company.companyName}
              sector={company.sector}
              industry={company.industry}
              exchange={company.exchangeShortName}
              metrics={[
                { label: "Price", value: "$" + company.price.toFixed(2) },
                {
                  label: "Change",
                  value:
                    (company.changes >= 0 ? "+" : "") +
                    company.changes.toFixed(2),
                  tone: company.changes >= 0 ? "gain" : "loss",
                },
                { label: "Market cap", value: renderMarketCap(company.mktCap) },
                { label: "Beta", value: company.beta?.toFixed(2) ?? "—" },
              ]}
            />

            <div className="w-full py-10">
              <Outlet context={ticker} />
            </div>

            <div className="w-full border-t border-mist-border/8 pt-10">
              {localDbId !== null && (
                <StockComment stockSymbol={ticker!} stockId={localDbId} />
              )}
            </div>
          </CompanyDashboard>
        </div>
      ) : (
        <div className="w-full min-h-screen bg-onyx-canvas flex items-center justify-center">
          <Spinners />
        </div>
      )}
    </>
  )
}

export default CompanyPage