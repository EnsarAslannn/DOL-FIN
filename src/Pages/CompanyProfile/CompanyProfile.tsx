import { useEffect, useState } from "react"
import { useOutletContext } from "react-router"
import type { CompanyKeyMetrics } from "../../company"
import { getKeyMetrics, getCompanyProfile } from "../../api"
import RatioList from "../../Components/RatioList/RatioList"
import Spinners from "../../Components/Spinners/Spinners"
import ComparableFinder from "../../Components/ComparableFinder/ComparableFinder"
import TenKFinder from "../../Components/TenKFinder/TenKFinder"
import {
  formatLargeNonMonetaryNumber,
  formatRatio,
} from "../../Helpers/NumberFormatting"

const tableConfig = [
  {
    label: "Market Cap",
    render: (company: CompanyKeyMetrics) =>
      formatLargeNonMonetaryNumber(company.marketCapTTM),
    subTitle: "Total value of all a company's shares of stock",
  },
  {
    label: "Current Ratio",
    render: (company: CompanyKeyMetrics) =>
      formatRatio(company.currentRatioTTM),
    subTitle:
      "Measures the companies ability to pay short term debt obligations",
  },
  {
    label: "Return On Equity",
    render: (company: CompanyKeyMetrics) => formatRatio(company.roeTTM),
    subTitle:
      "Return on equity is the measure of a company's net income divided by its shareholder's equity",
  },
  {
    label: "Return On Assets",
    render: (company: CompanyKeyMetrics) =>
      formatRatio(company.returnOnTangibleAssetsTTM),
    subTitle:
      "Return on assets is the measure of how effective a company is using its assets",
  },
  {
    label: "Free Cashflow Per Share",
    render: (company: CompanyKeyMetrics) =>
      formatRatio(company.freeCashFlowPerShareTTM),
    subTitle:
      "Return on assets is the measure of how effective a company is using its assets",
  },
  {
    label: "Book Value Per Share TTM",
    render: (company: CompanyKeyMetrics) =>
      formatRatio(company.bookValuePerShareTTM),
    subTitle:
      "Book value per share indicates a firm's net asset value (total assets - total liabilities) on per share basis",
  },
  {
    label: "Divdend Yield TTM",
    render: (company: CompanyKeyMetrics) =>
      formatRatio(company.dividendYieldTTM),
    subTitle: "Shows how much a company pays each year relative to stock price",
  },
  {
    label: "Capex Per Share TTM",
    render: (company: CompanyKeyMetrics) =>
      formatRatio(company.capexPerShareTTM),
    subTitle:
      "Capex is used by a company to aquire, upgrade, and maintain physical assets",
  },
  {
    label: "Graham Number",
    render: (company: CompanyKeyMetrics) =>
      formatRatio(company.grahamNumberTTM),
    subTitle:
      "This is the upperbouind of the price range that a defensive investor should pay for a stock",
  },
  {
    label: "PE Ratio",
    render: (company: CompanyKeyMetrics) => formatRatio(company.peRatioTTM),
    subTitle:
      "This is the upperbouind of the price range that a defensive investor should pay for a stock",
  },
]

const CompanyProfile = () => {
  const ticker = useOutletContext<string>()
  const [companyData, setCompanyData] = useState<CompanyKeyMetrics>()
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    const getProfileData = async () => {
      const pResult = await getCompanyProfile(ticker)
      if (pResult && pResult.data) {
        setProfile(pResult.data[0])
      }
      const mResult = await getKeyMetrics(ticker)
      if (mResult && typeof mResult !== "string" && "data" in mResult) {
        setCompanyData(mResult?.data[0])
      }
    }
    getProfileData()
  }, [ticker])

  const allowedStocks = ["AAPL", "MSFT", "NVDA", "TSLA", "GOOGL"]

  if (!allowedStocks.includes(ticker?.toUpperCase())) {
    return (
      <div className="w-full bg-[#141a26] border border-gray-800/60 rounded-2xl p-8 shadow-2xl flex flex-col items-center justify-center text-center min-h-[350px] space-y-4 my-4 animate-fadeIn">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 text-2xl shadow-sm">
          📊
        </div>
        <div className="flex flex-col space-y-1">
          <h3 className="text-lg font-black text-white tracking-tight">
            Financial Data Unavailable
          </h3>
          <p className="text-xs text-gray-500 font-mono">
            SCOPE_LIMITATION_WARNING // LIVE_DEMO_RESTRICITON
          </p>
        </div>
        <p className="text-sm text-gray-400 max-w-md leading-relaxed">
          Financial data for <span className="font-bold font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">{ticker?.toUpperCase()}</span> is currently unavailable for this demo version.
        </p>
        <div className="pt-2">
          <p className="text-[11px] text-gray-500 font-medium bg-[#0b0f19]/40 border border-gray-800/40 px-3 py-1.5 rounded-xl font-mono">
            Please audit premium corporate tiers: AAPAL, MSFT, NVDA, TSLA, GOOGL
          </p>
        </div>
      </div>
    )
  }

  if (!profile || !companyData) {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <Spinners />
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col font-sans text-gray-100">
      <div className="block w-full bg-[#141a26] shadow-xl rounded-2xl p-6 my-4 border border-gray-800/60 flex flex-col space-y-3">
        <h3 className="text-base font-bold text-emerald-400 uppercase tracking-wider text-left font-mono">
          Company Description
        </h3>
        <p className="text-gray-200 text-base font-normal leading-relaxed antialiased text-left">
          {profile.description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 w-full">
        <div className="bg-[#141a26] shadow-xl rounded-2xl p-6 border border-gray-800/60 flex flex-col justify-start space-y-6">
          <div className="flex flex-col space-y-3">
            <h3 className="text-base font-bold text-emerald-400 uppercase tracking-wider text-left font-mono">
              Similar Companies
            </h3>
            <div className="flex flex-wrap items-center gap-2 pt-1 [&_button]:px-5 [&_button]:py-2.5 [&_button]:text-sm">
              <ComparableFinder ticker={profile.symbol} />
            </div>
          </div>
          <div className="bg-[#0b0f19]/40 rounded-xl p-5 border border-gray-800/40 text-left mt-auto w-full">
            <p className="text-sm text-gray-300 leading-relaxed">
              <strong className="text-gray-100 block mb-1.5 font-mono text-xs uppercase tracking-wide">
                Industry Peers
              </strong>
              A curated list of publicly traded companies operating within the
              same sector and industry.
            </p>
          </div>
        </div>

        <div className="bg-[#141a26] shadow-xl rounded-2xl p-6 border border-gray-800/60 flex flex-col justify-start space-y-6">
          <div className="flex flex-col space-y-3">
            <h3 className="text-base font-bold text-emerald-400 uppercase tracking-wider text-left font-mono">
              10-K REPORT
            </h3>
            <div className="flex flex-wrap items-center gap-2 pt-1 [&_a]:px-5 [&_a]:py-2.5 [&_a]:text-sm">
              <TenKFinder ticker={profile.symbol} />
            </div>
          </div>
          <div className="bg-[#0b0f19]/40 rounded-xl p-5 border border-gray-800/40 text-left mt-auto w-full min-h-[105px] flex flex-col justify-center">
            <p className="text-sm text-gray-300 leading-relaxed">
              <strong className="text-gray-100 block mb-1.5 font-mono text-xs uppercase tracking-wide">
                What is a 10-K Report?
              </strong>
              A Form 10-K is a comprehensive annual regulatory report required by the SEC that provides an in-depth analysis of a company's financial performance and structural risk factors. Unlike marketing-oriented annual reports, it offers audited financial statements and detailed management insights to help investors make informed, high-fidelity valuation decisions.
            </p>
          </div>
        </div>
      </div>

      <div className="w-full mt-4">
        <RatioList data={companyData} config={tableConfig} />
      </div>
    </div>
  )
}

export default CompanyProfile
