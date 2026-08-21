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
      "Measures the company's ability to pay short term debt obligations",
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
      "Cash generated after capital expenditure, expressed on a per share basis",
  },
  {
    label: "Book Value Per Share TTM",
    render: (company: CompanyKeyMetrics) =>
      formatRatio(company.bookValuePerShareTTM),
    subTitle:
      "Book value per share indicates a firm's net asset value (total assets - total liabilities) on per share basis",
  },
  {
    label: "Dividend Yield TTM",
    render: (company: CompanyKeyMetrics) =>
      formatRatio(company.dividendYieldTTM),
    subTitle: "Shows how much a company pays each year relative to stock price",
  },
  {
    label: "Capex Per Share TTM",
    render: (company: CompanyKeyMetrics) =>
      formatRatio(company.capexPerShareTTM),
    subTitle:
      "Capex is used by a company to acquire, upgrade, and maintain physical assets",
  },
  {
    label: "Graham Number",
    render: (company: CompanyKeyMetrics) =>
      formatRatio(company.grahamNumberTTM),
    subTitle:
      "This is the upper bound of the price range that a defensive investor should pay for a stock",
  },
  {
    label: "PE Ratio",
    render: (company: CompanyKeyMetrics) => formatRatio(company.peRatioTTM),
    subTitle:
      "Share price relative to earnings per share — what the market pays for each unit of profit",
  },
]

const CompanyProfile = () => {
  const ticker = useOutletContext<string>()
  const [companyData, setCompanyData] = useState<CompanyKeyMetrics>()
  const [profile, setProfile] = useState<CompanyProfileType | null>(null)

  useEffect(() => {
    const getProfileData = async () => {
      const pResult = await getCompanyProfile(ticker)
      setProfile(pResult.data[0] ?? null)

      const mResult = await getKeyMetrics(ticker)
      setCompanyData(mResult.data[0])
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
      <Band tone="cream" className="py-section">
        <div className="flex w-full flex-col gap-14 font-sans text-band-ink">

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
