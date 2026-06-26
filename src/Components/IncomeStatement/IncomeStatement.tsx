import { useEffect, useState } from "react"
import type { CompanyIncomeStatement } from "../../company"
import { useOutletContext } from "react-router-dom"
import { getIncomeStatement } from "../../api"
import Table from "../Table/Table"
import Spinners from "../Spinners/Spinners"

import {
  formatLargeMonetaryNumber,
  formatRatio,
} from "../../Helpers/NumberFormatting"

const configs = [
  {
    label: "Date",

    render: (company: CompanyIncomeStatement) => company.date,
  },

  {
    label: "Revenue",

    render: (company: CompanyIncomeStatement) =>
      formatLargeMonetaryNumber(company.revenue),
  },

  {
    label: "Cost Of Revenue",

    render: (company: CompanyIncomeStatement) =>
      formatLargeMonetaryNumber(company.costOfRevenue),
  },

  {
    label: "Depreciation",

    render: (company: CompanyIncomeStatement) =>
      formatLargeMonetaryNumber(company.depreciationAndAmortization),
  },

  {
    label: "Operating Income",

    render: (company: CompanyIncomeStatement) =>
      formatLargeMonetaryNumber(company.operatingIncome),
  },

  {
    label: "Income Before Taxes",

    render: (company: CompanyIncomeStatement) =>
      formatLargeMonetaryNumber(company.incomeBeforeTax),
  },

  {
    label: "Net Income",

    render: (company: CompanyIncomeStatement) =>
      formatLargeMonetaryNumber(company.netIncome),
  },

  {
    label: "Net Income Ratio",

    render: (company: CompanyIncomeStatement) =>
      formatRatio(company.netIncomeRatio),
  },

  {
    label: "Earnings Per Share",

    render: (company: CompanyIncomeStatement) => formatRatio(company.eps),
  },

  {
    label: "Earnings Per Diluted",

    render: (company: CompanyIncomeStatement) =>
      formatRatio(company.epsdiluted),
  },

  {
    label: "Gross Profit Ratio",

    render: (company: CompanyIncomeStatement) =>
      formatRatio(company.grossProfitRatio),
  },

  {
    label: "Opearting Income Ratio",

    render: (company: CompanyIncomeStatement) =>
      formatRatio(company.operatingIncomeRatio),
  },

  {
    label: "Income Before Taxes Ratio",

    render: (company: CompanyIncomeStatement) =>
      formatRatio(company.incomeBeforeTaxRatio),
  },
]

const IncomeStatement = () => {
  const ticker = useOutletContext<string>()

  const [incomeStatement, setIncomeStatement] =
    useState<CompanyIncomeStatement[]>()

  useEffect(() => {
    const incomeStatementFetch = async () => {
      const result = await getIncomeStatement(ticker)

      if (result && typeof result !== "string" && "data" in result) {
        const sortedData = [...result.data].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        )

        setIncomeStatement(sortedData)
      }
    }

    incomeStatementFetch()
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
            Please audit premium corporate tiers: AAPL, MSFT, NVDA, TSLA, GOOGL
          </p>
        </div>
      </div>
    )
  }

  const calculateMetrics = (data: CompanyIncomeStatement[]) => {
    if (data.length < 2)
      return {
        margin: 0,
        growth: 0,
        marginFormatted: "0.0%",
        growthFormatted: "0.0%",
        summaryText: "",
        status: "NEUTRAL",
      }

    const latest = data[data.length - 1]

    const previous = data[data.length - 2]

    const margin = (latest.netIncome / latest.revenue) * 100

    const growth =
      ((latest.revenue - previous.revenue) / previous.revenue) * 100

    let status = "STRONG"

    let summaryText = `The company expanded its top-line operations significantly, registering a year-over-year revenue growth of ${growth.toFixed(1)}%. It maintained a stable net conversion efficiency with a profit margin of ${margin.toFixed(1)}%, signaling sustainable operational scaling and resilient corporate risk management over the trailing fiscal period.`

    if (growth < 0 && margin < 10) {
      status = "WEAK"

      summaryText = `The asset shows contraction signs with a negative top-line revenue growth of ${growth.toFixed(1)}% alongside a tight profit conversion margin sitting at ${margin.toFixed(1)}%. This compression suggests potential headwinds in macroeconomic scaling or rising cost boundaries that require structural optimization.`
    } else if (growth < 0 || margin < 10) {
      status = "MODERATE"

      summaryText = `Mixed technical indicators observed. While top-line growth metrics or net profit margin fields show slight deceleration, corporate baseline indicators remain functional. Close inspection of underlying expenditure lines is advised to balance future fiscal performance.`
    }

    return {
      margin,

      growth,

      marginFormatted: margin.toFixed(1) + "%",

      growthFormatted: (growth >= 0 ? "+" : "") + growth.toFixed(1) + "%",

      summaryText,

      status,
    }
  }

  const renderMetricsAndSummary = (data: CompanyIncomeStatement[]) => {
    const metrics = calculateMetrics(data)

    return (
      <div className="w-full flex flex-col space-y-4 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <div className="bg-[#141a26] border border-gray-800/60 rounded-2xl p-5 shadow-xl flex flex-col text-left justify-between min-h-[115px]">
            <div className="flex flex-col space-y-1">
              <span className="text-gray-500 uppercase font-bold text-[10px] tracking-widest font-mono">
                Net Profit Margin
              </span>

              <span className="font-black text-2xl text-white font-mono">
                {metrics.marginFormatted}
              </span>
            </div>

            <div className="w-full flex flex-col space-y-1.5 mt-3">
              <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-sky-500 rounded-full"
                  style={{
                    width: `${Math.min(Math.max(metrics.margin, 5), 100)}%`,
                  }}
                ></div>
              </div>

              <span className="text-[10px] text-gray-400 font-medium font-mono">
                Net conversion efficiency of capital deployment
              </span>
            </div>
          </div>

          <div className="bg-[#141a26] border border-gray-800/60 rounded-2xl p-5 shadow-xl flex flex-col text-left justify-between min-h-[115px]">
            <div className="flex flex-col space-y-1">
              <span className="text-gray-500 uppercase font-bold text-[10px] tracking-widest font-mono">
                Revenue Growth (YoY)
              </span>

              <span
                className={`font-black text-2xl font-mono ${metrics.growth >= 0 ? "text-emerald-400" : "text-rose-400"}`}
              >
                {metrics.growthFormatted}
              </span>
            </div>

            <div className="w-full flex flex-col space-y-1.5 mt-3">
              <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${metrics.growth >= 0 ? "bg-emerald-500" : "bg-rose-500"}`}
                  style={{
                    width: `${Math.min(Math.max(Math.abs(metrics.growth) * 3, 10), 100)}%`,
                  }}
                ></div>
              </div>

              <span className="text-[10px] text-gray-400 font-medium font-mono">
                Top-line macroeconomic scalability expansion metric
              </span>
            </div>
          </div>
        </div>

        <div className="w-full bg-[#141a26] border border-gray-800/60 rounded-2xl p-5 shadow-xl flex flex-col space-y-3 text-left">
          <div className="flex items-center justify-between border-b border-gray-800/40 pb-2.5">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono flex items-center gap-2">
              <svg
                className="w-4 h-4 text-emerald-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Income Statement Performance Intelligence
            </h4>

            <span
              className={`text-[10px] font-black uppercase px-2 py-0.5 rounded font-mono ${metrics.status === "STRONG"
                ? "bg-emerald-500/10 text-emerald-400"
                : metrics.status === "WEAK"
                  ? "bg-rose-500/10 text-rose-400"
                  : "bg-amber-500/10 text-amber-400"
                }`}
            >
              {metrics.status} OUTLOOK
            </span>
          </div>

          <p className="text-sm text-gray-300 leading-relaxed font-sans font-normal">
            {metrics.summaryText}
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      {incomeStatement ? (
        <div className="w-full flex flex-col">
          <div className="block w-full bg-[#141a26] shadow-xl rounded-2xl p-6 mb-6 border border-gray-800/60 flex flex-col space-y-3 text-left">
            <h3 className="text-base font-bold text-emerald-400 uppercase tracking-wider font-mono">
              Understanding the Income Statement
            </h3>

            <p className="text-gray-200 text-base font-normal leading-relaxed antialiased">
              An{" "}
              <strong className="text-white font-semibold">
                Income Statement
              </strong>{" "}
              (Profit and Loss Statement) maps out a corporate institution's
              core financial velocity over a sequential reporting period. It
              tracks how total{" "}
              <strong className="text-emerald-400">Revenue (Top-Line)</strong>{" "}
              transitions down into operational expenses, tax components, and
              finally yields the net consolidated{" "}
              <strong className="text-sky-400">
                Profit or Loss (Bottom-Line)
              </strong>
              .
            </p>

            <p className="text-gray-300 text-sm font-normal leading-relaxed antialiased pt-1">
              <strong className="text-gray-100 block mb-1 font-mono text-xs uppercase tracking-wide">
                Why is it Critical?
              </strong>
              While the Balance Sheet records asset and liability weight levels,
              the Income Statement focuses strictly on business efficiency,
              momentum, and operational pricing leverage. Investors study this
              matrix to measure market share scalability, identifying if gross
              margins are healthy enough to outpace rising industrial overhead
              thresholds.
            </p>
          </div>

          <Table config={configs} data={incomeStatement} />

          {renderMetricsAndSummary(incomeStatement)}
        </div>
      ) : (
        <Spinners />
      )}
    </>
  )
}

export default IncomeStatement
