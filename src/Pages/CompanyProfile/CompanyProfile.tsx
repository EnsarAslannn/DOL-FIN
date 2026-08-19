import { useEffect, useState } from "react"
import { useOutletContext } from "react-router"
import type { CompanyKeyMetrics, CompanyProfile as CompanyProfileType } from "../../company"
import { getKeyMetrics, getCompanyProfile } from "../../api"
import RatioList from "../../Components/RatioList/RatioList"
import Spinners from "../../Components/Spinners/Spinners"
import ComparableFinder from "../../Components/ComparableFinder/ComparableFinder"
import TenKFinder from "../../Components/TenKFinder/TenKFinder"
import Panel, { PanelHeader } from "../../Components/Dashboard/Panel"
import Band from "../../Components/Dashboard/Band"
import EmptyState from "../../Components/Dashboard/EmptyState"
import { Link } from "react-router-dom"
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
      <Band tone="dark" className="py-section">
      <EmptyState
        variant="search"
        title="No financial data for this ticker"
        description={`The sandbox carries full statements for five companies. ${ticker?.toUpperCase()} is not one of them yet.`}
      >
        <div className="flex flex-wrap items-center justify-center gap-2">
          {allowedStocks.map((allowed) => (
            <Link
              key={allowed}
              to={`/company/${allowed}/company-profile`}
              className="rounded-pill bg-band-raised px-4 py-2 font-mono text-caption font-normal uppercase tracking-label-sm text-band-muted transition-colors duration-200 hover:bg-cobalt hover:text-pure-white"
            >
              {allowed}
            </Link>
          ))}
        </div>
      </EmptyState>
      </Band>
    )
  }

  if (!profile || !companyData) {
    return (
      <Band tone="dark" className="py-section">
        <Spinners variant="inline" label="Loading company profile" />
      </Band>
    )
  }

  return (
    <>
      {/* Cream — the prose and the figures. Both are read rather than
          watched, which is what the light ground is for. */}
      <Band tone="cream" className="py-section">
        <div className="flex w-full flex-col gap-14 font-sans text-band-ink">
      {/* No identity block here — CompanyPage renders one above the outlet,
          shared by every statement tab. Repeating it would show the ticker
          twice on this tab and only this tab. */}

      {/* Description sits straight on the canvas. It is one block of prose and
          a fill around it would only add a frame to read past. The block runs
          the full content width so it ends on the same line as the metrics
          table below — but one 165ch line is unreadable at that width, so past
          `lg` the prose breaks into two balanced columns of roughly 80ch. */}
      <Panel>
        <PanelHeader eyebrow="Overview" title="What the company does" />
        <p className="mt-6 text-body-lg font-normal leading-relaxed text-band-muted xl:columns-2 xl:gap-16">
          {profile.description}
        </p>
      </Panel>

      <Panel>
        <PanelHeader
          eyebrow="Key metrics"
          title="Trailing twelve months"
          className="mb-6"
        />
        <RatioList data={companyData} config={tableConfig} />
      </Panel>
        </div>
      </Band>

      {/* Onyx — where else to look. Peers and filings point away from this
          company, so they close the page on the darker ground rather than
          competing with its own numbers. */}
      <Band tone="dark" className="py-section">
        <div className="flex w-full flex-col gap-14 font-sans text-band-ink">
      <div className="grid w-full grid-cols-1 gap-10 lg:grid-cols-2">
        <Panel>
          <PanelHeader
            eyebrow="Peers"
            title="Similar companies"
            lead="Publicly traded companies in the same sector and industry."
          />
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <ComparableFinder ticker={profile.symbol} />
          </div>
        </Panel>

        <Panel>
          <PanelHeader
            eyebrow="Filings"
            title="10-K reports"
            lead="The SEC's audited annual report — financial statements and the risk factors management had to disclose."
          />
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <TenKFinder ticker={profile.symbol} />
          </div>
        </Panel>
      </div>
        </div>
      </Band>
    </>
  )
}

export default CompanyProfile
