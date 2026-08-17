import { useEffect, useState } from "react"
import { useOutletContext } from "react-router"
import type { CompanyKeyMetrics, CompanyProfile as CompanyProfileType } from "../../company"
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
  const [profile, setProfile] = useState<CompanyProfileType | null>(null)

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
      <div className="rounded-card border border-slate-border/45 bg-graphite-card w-full rounded-card p-8 flex flex-col items-center justify-center text-center min-h-[350px] space-y-4 my-4 animate-fadeIn">
        <div className="flex h-16 w-16 items-center justify-center rounded-icon border border-slate-border/45 bg-obsidian-button">
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
          Financial data for <span className="font-bold font-mono text-ivory-text bg-obsidian-button px-2 py-1 rounded border border-slate-border/45">{ticker?.toUpperCase()}</span> is currently unavailable for this demo version.
        </p>
        <div className="pt-2">
          <p className="text-caption text-ash-text font-normal bg-obsidian-button border border-slate-border/45 px-3 py-2 rounded-card font-mono">
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
    <div className="w-full flex flex-col font-sans text-ivory-text">
      <div className="block w-full bg-graphite-card rounded-card p-6 my-4 border border-slate-border/45 flex flex-col space-y-3">
        <h3 className="text-caption font-bold text-ivory-text uppercase tracking-label-lg text-left font-mono">
          Company Description
        </h3>
        <p className="text-ivory-text text-body-lg font-normal leading-relaxed antialiased text-left">
          {profile.description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 w-full">
        <div className="bg-graphite-card rounded-card p-6 border border-slate-border/45 flex flex-col justify-start space-y-6">
          <div className="flex flex-col space-y-3">
            <h3 className="text-caption font-bold text-ivory-text uppercase tracking-label-lg text-left font-mono">
              Similar Companies
            </h3>
            <div className="flex flex-wrap items-center gap-2 pt-1 [&_button]:px-5 [&_button]:py-3 [&_button]:text-body">
              <ComparableFinder ticker={profile.symbol} />
            </div>
          </div>
          <div className="bg-obsidian-button rounded-card p-5 border border-slate-border/45 text-left mt-auto w-full">
            <p className="text-body text-ivory-text leading-relaxed">
              <strong className="text-ivory-text block mb-2 font-mono text-body uppercase tracking-wide">
                Industry Peers
              </strong>
              A curated list of publicly traded companies operating within the
              same sector and industry.
            </p>
          </div>
        </div>

        <div className="bg-graphite-card rounded-card p-6 border border-slate-border/45 flex flex-col justify-start space-y-6">
          <div className="flex flex-col space-y-3">
            <h3 className="text-caption font-bold text-ivory-text uppercase tracking-label-lg text-left font-mono">
              10-K REPORT
            </h3>
            <div className="flex flex-wrap items-center gap-2 pt-1 [&_a]:px-5 [&_a]:py-3 [&_a]:text-body">
              <TenKFinder ticker={profile.symbol} />
            </div>
          </div>
          <div className="bg-obsidian-button rounded-card p-5 border border-slate-border/45 text-left mt-auto w-full min-h-[105px] flex flex-col justify-center">
            <p className="text-body text-ivory-text leading-relaxed">
              <strong className="text-ivory-text block mb-2 font-mono text-body uppercase tracking-wide">
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
