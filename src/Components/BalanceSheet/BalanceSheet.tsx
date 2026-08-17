import { useEffect, useState } from "react"
import { useOutletContext } from "react-router-dom"
import type { CompanyBalanceSheet } from "../../company"
import { getBalanceSheet } from "../../api"
import Table from "../Table/Table"
import Spinners from "../Spinners/Spinners"
import { formatLargeMonetaryNumber } from "../../Helpers/NumberFormatting"
import { testIncomeStatementData } from "../../Components/Table/TestData"

const config = [
  {
    label: "Year",
    render: (company: CompanyBalanceSheet) => company.calendarYear,
  },
  {
    label: <div className="font-bold">Total Assets</div>,
    render: (company: CompanyBalanceSheet) =>
      formatLargeMonetaryNumber(company.totalAssets),
  },
  {
    label: "Current Assets",
    render: (company: CompanyBalanceSheet) =>
      formatLargeMonetaryNumber(company.totalCurrentAssets),
  },
  {
    label: "Total Cash",
    render: (company: CompanyBalanceSheet) =>
      formatLargeMonetaryNumber(company.cashAndCashEquivalents),
  },
  {
    label: "Property & equipment",
    render: (company: CompanyBalanceSheet) =>
      formatLargeMonetaryNumber(company.propertyPlantEquipmentNet),
  },
  {
    label: "Intangible Assets",
    render: (company: CompanyBalanceSheet) =>
      formatLargeMonetaryNumber(company.intangibleAssets),
  },
  {
    label: "Long Term Debt",
    render: (company: CompanyBalanceSheet) =>
      formatLargeMonetaryNumber(company.longTermDebt),
  },
  {
    label: "Total Debt",
    render: (company: CompanyBalanceSheet) =>
      formatLargeMonetaryNumber(company.totalDebt),
  },
  {
    label: <div className="font-bold">Total Liabilities</div>,
    render: (company: CompanyBalanceSheet) =>
      formatLargeMonetaryNumber(company.totalLiabilities),
  },
  {
    label: "Current Liabilities",
    render: (company: CompanyBalanceSheet) =>
      formatLargeMonetaryNumber(company.totalCurrentLiabilities),
  },
  {
    label: "Long-Term Income Taxes",
    render: (company: CompanyBalanceSheet) =>
      formatLargeMonetaryNumber(company.otherLiabilities),
  },
  {
    label: "Stakeholder's Equity",
    render: (company: CompanyBalanceSheet) =>
      formatLargeMonetaryNumber(company.totalStockholdersEquity),
  },
  {
    label: "Retained Earnings",
    render: (company: CompanyBalanceSheet) =>
      formatLargeMonetaryNumber(company.retainedEarnings),
  },
]

const BalanceSheet = () => {
  const ticker = useOutletContext<string>()
  const [balanceSheet, setBalanceSheet] = useState<CompanyBalanceSheet[]>()

  useEffect(() => {
    const getData = async () => {
      const value = await getBalanceSheet(ticker!)
      if (value && typeof value !== "string" && "data" in value) {
        const sortedData = [...value.data].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        )
        setBalanceSheet(sortedData)
      }
    }
    getData()
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
          Financial data for{" "}
          <span className="font-bold font-mono text-ivory-text bg-obsidian-button px-2 py-1 rounded border border-slate-border/45">
            {ticker?.toUpperCase()}
          </span>{" "}
          is currently unavailable for this demo version.
        </p>
        <div className="pt-2">
          <p className="text-caption text-ash-text font-normal bg-obsidian-button border border-slate-border/45 px-3 py-2 rounded-card font-mono">
            Please audit premium corporate tiers: AAPL, MSFT, NVDA, TSLA, GOOGL
          </p>
        </div>
      </div>
    )
  }

  const calculateMetrics = (data: CompanyBalanceSheet[]) => {
    if (data.length === 0)
      return {
        dte: 0,
        turnover: 0,
        dteFormatted: "0.00",
        turnoverFormatted: "0.00",
        summaryText: "",
        status: "NEUTRAL",
      }

    const latest = data[data.length - 1]
    const dte =
      latest.totalStockholdersEquity > 0
        ? latest.totalLiabilities / latest.totalStockholdersEquity
        : 0

    const companyInc = testIncomeStatementData.find(
      (c) =>
        c.symbol.toUpperCase() === ticker.toUpperCase() &&
        c.calendarYear === latest.calendarYear,
    )
    const revenue = companyInc ? companyInc.revenue : latest.totalAssets * 0.8
    const turnover = revenue / latest.totalAssets

    let status = "STABLE"
    let summaryText = `The balance sheet structure presents a balanced capital architecture. The Debt-to-Equity leverage metric is sustained at ${dte.toFixed(2)}, confirming that operational expansion is securely backed by capital reserves rather than toxic debt scaling. Furthermore, an Asset Turnover ratio of ${turnover.toFixed(2)} highlights optimal institutional asset utilization to manufacture top-line corporate revenue channels.`

    if (dte > 2.0) {
      status = "LEVERAGED"
      summaryText = `Technical screening signals a heavily leveraged balance allocation. The Debt-to-Equity ratio rests at an aggressive ${dte.toFixed(2)}, implying that liabilities significantly outweigh stockholder equity cushions. Structural adjustments or long-term consolidation adjustments might be necessary to safeguard credit lines against macro volatility.`
    } else if (turnover < 0.3) {
      status = "CAUTIOUS"
      summaryText = `Asset efficiency indices indicate minor deceleration. While capital metrics appear safe with a Debt-to-Equity profile of ${dte.toFixed(2)}, the asset turnover fields are underperforming at ${turnover.toFixed(2)}. This suggests capital is trapped in idle physical properties or inventories rather than optimizing marketplace turnover.`
    }

    return {
      dte,
      turnover,
      dteFormatted: dte.toFixed(2),
      turnoverFormatted: turnover.toFixed(2),
      summaryText,
      status,
    }
  }

  const renderMetricsAndSummary = (data: CompanyBalanceSheet[]) => {
    const metrics = calculateMetrics(data)

    return (
      <div className="w-full flex flex-col space-y-4 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <div className="bg-graphite-card border border-slate-border/45 rounded-card p-5 shadow-xl flex flex-col text-left justify-between min-h-[115px]">
            <div className="flex flex-col space-y-1">
              <span className="text-ash-text uppercase font-bold text-caption tracking-widest font-mono">
                Debt-to-Equity Ratio
              </span>
              <span className="font-normal text-heading text-ivory-text font-mono">
                {metrics.dteFormatted}
              </span>
            </div>
            <div className="w-full flex flex-col space-y-2 mt-3">
              <div className="w-full h-1 bg-obsidian-button rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${metrics.dte <= 1.5 ? "bg-gain" : metrics.dte <= 2.5 ? "bg-obsidian-button" : "bg-loss"}`}
                  style={{
                    width: `${Math.min(Math.max((metrics.dte / 3) * 100, 10), 100)}%`,
                  }}
                ></div>
              </div>
              <span className="text-caption text-ash-text font-normal font-mono">
                Total liabilities divided by total shareholder equity leverage
              </span>
            </div>
          </div>

          <div className="bg-graphite-card border border-slate-border/45 rounded-card p-5 shadow-xl flex flex-col text-left justify-between min-h-[115px]">
            <div className="flex flex-col space-y-1">
              <span className="text-ash-text uppercase font-bold text-caption tracking-widest font-mono">
                Asset Turnover Ratio
              </span>
              <span className="font-normal text-heading text-ivory-text font-mono">
                {metrics.turnoverFormatted}
              </span>
            </div>
            <div className="w-full flex flex-col space-y-2 mt-3">
              <div className="w-full h-1 bg-obsidian-button rounded-full overflow-hidden">
                <div
                  className="h-full bg-slate-border rounded-full"
                  style={{
                    width: `${Math.min(Math.max(metrics.turnover * 80, 15), 100)}%`,
                  }}
                ></div>
              </div>
              <span className="text-caption text-ash-text font-normal font-mono">
                Efficiency of company assets in generating top-line revenue
              </span>
            </div>
          </div>
        </div>

        <div className="w-full bg-graphite-card border border-slate-border/45 rounded-card p-5 shadow-xl flex flex-col space-y-3 text-left">
          <div className="flex items-center justify-between border-b border-slate-border/45 pb-3">
            <h4 className="text-body font-bold text-ash-text uppercase tracking-wider font-mono flex items-center gap-2">
              <svg
                className="w-4 h-4 text-ash-text"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              Balance Sheet Structural Intelligence
            </h4>
            <span
              className={`text-caption font-bold uppercase px-2 py-1 rounded font-mono ${metrics.status === "STABLE"
                  ? "bg-gain/10 text-gain"
                  : metrics.status === "LEVERAGED"
                    ? "bg-loss/10 text-loss"
                    : "bg-obsidian-button text-ash-text"
                }`}
            >
              {metrics.status} LAYOUT
            </span>
          </div>
          <p className="text-body text-ivory-text leading-relaxed font-sans font-normal">
            {metrics.summaryText}
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      {balanceSheet ? (
        <div className="w-full flex flex-col">
          <div className="block w-full bg-graphite-card shadow-xl rounded-card p-6 mb-6 border border-slate-border/45 flex flex-col space-y-3 text-left">
            <h3 className="text-body-lg font-bold text-ivory-text uppercase tracking-wider font-mono">
              Understanding the Balance Sheet
            </h3>
            <p className="text-ivory-text text-body-lg font-normal leading-relaxed antialiased">
              A{" "}
              <strong className="text-ivory-text font-normal">
                Balance Sheet
              </strong>{" "}
              represents a financial snapshot of a company's structural health
              at a specific point in time. It explicitly details what the
              institution{" "}
              <strong className="text-ash-text">owns (Assets)</strong>, what it{" "}
              <strong className="text-loss">owes (Liabilities)</strong>, and
              the net capital invested by the{" "}
              <strong className="text-ash-text">shareholders (Equity)</strong>{" "}
              based on the accounting core: Assets = Liabilities + Equity.
            </p>
            <p className="text-ivory-text text-body font-normal leading-relaxed antialiased pt-1">
              <strong className="text-ivory-text block mb-1 font-mono text-body uppercase tracking-wide">
                Why is it Critical?
              </strong>
              While the Income Statement demonstrates performance velocity, the
              Balance Sheet focuses heavily on liquidity, solvency risks, and
              capital structure longevity. Analysts review these parameters to
              compute capital leverage risks, evaluating if corporate assets are
              scaled safely or dangerously inflated by unsecured credit lines.
            </p>
          </div>

          <Table config={config} data={balanceSheet} />
          {renderMetricsAndSummary(balanceSheet)}
        </div>
      ) : (
        <Spinners />
      )}
    </>
  )
}

export default BalanceSheet
