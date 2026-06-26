import { useState } from "react"
import {
  testMarketTrendsData,
  realMarketNewsData,
} from "../../Components/Table/TestData"
import MarketTicker from "../MarketTicker/MarketTicker"
import { Link } from "react-router-dom"

const Hero = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const gainers = testMarketTrendsData
    .filter((item) => item.isPositive)
    .slice(0, 3)
  const losers = testMarketTrendsData
    .filter((item) => !item.isPositive)
    .slice(0, 3)

  return (
    <section
      id="hero"
      className="w-full bg-[#0b0f19] text-gray-100 font-sans min-h-screen flex flex-col pb-24 relative overflow-hidden"
    >
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/3 left-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <MarketTicker />

      <div className="container mx-auto px-6 py-16 flex-grow flex flex-col justify-center max-w-6xl relative z-10">
        <div className="text-center mb-24 mt-8">
          <span className="text-[11px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20 shadow-sm inline-block mb-4">
            ⚡ NEXT-GENERATION ANALYTICS TERMINAL
          </span>
          <h1 className="text-4xl font-black text-white tracking-tight sm:text-6xl mb-6 max-w-3xl mx-auto leading-none bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            Deep Market Analytics <br />
            <span className="text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]">
              Under a New Lens
            </span>
          </h1>
          <p className="text-base text-gray-400 max-w-xl mx-auto leading-relaxed mb-8">
            Take absolute control of your investments. Track customized stock
            assets, read community insights, and unlock deeper fundamental
            corporate layers without the premium terminal overhead.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              to="/search"
              className="py-3.5 px-10 text-sm font-bold text-black bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/20 transform hover:-translate-y-0.5"
            >
              Launch Terminal
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          <div className="bg-[#141a26] border border-gray-800/60 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6 border-b border-gray-800 pb-3">
              <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]"></span>
                Top Volatility Gainers
              </h3>
              <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">
                Spot Live
              </span>
            </div>
            <div className="flex flex-col space-y-4">
              {gainers.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs border-b border-gray-800/40 pb-3 last:border-0 last:pb-0"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.logoUrl}
                      alt=""
                      className="w-6 h-6 object-contain rounded-md bg-gray-800 p-0.5"
                    />
                    <span className="font-bold text-gray-200">{item.name}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="font-mono font-medium text-gray-300">
                      {item.value}
                    </span>
                    <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded text-[11px] min-w-[65px] text-center">
                      {item.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#141a26] border border-gray-800/60 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6 border-b border-gray-800 pb-3">
              <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e]"></span>
                Market Short Watch
              </h3>
              <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">
                Simulated
              </span>
            </div>
            <div className="flex flex-col space-y-4">
              {losers.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs border-b border-gray-800/40 pb-3 last:border-0 last:pb-0"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.logoUrl}
                      alt=""
                      className="w-6 h-6 object-contain rounded-md bg-gray-800 p-0.5"
                    />
                    <span className="font-bold text-gray-200">{item.name}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="font-mono font-medium text-gray-300">
                      {item.value}
                    </span>
                    <span className="text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded text-[11px] min-w-[65px] text-center">
                      {item.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800/80 pt-16 mb-24">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-black text-white tracking-tight">
              How DOLFIN Works
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Get fully synchronized with institutional parameters in 3 stages.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative items-stretch">
            <div className="flex flex-col items-center p-6 bg-[#141a26] rounded-2xl border border-gray-800/60 relative">
              <span className="absolute -top-3 left-6 bg-emerald-400 text-black font-black text-[10px] px-2.5 py-0.5 rounded-md shadow-md">
                STAGE 01
              </span>
              <div className="w-12 h-12 bg-gray-800/50 rounded-xl flex items-center justify-center text-xl mb-4 mt-2 border border-gray-700/30">
                🔐
              </div>
              <h3 className="font-bold text-gray-200 text-sm">
                Create Workspace
              </h3>
              <p className="text-[11px] text-gray-400 mt-1.5 text-center leading-relaxed">
                Register instantly to protect your encrypted financial portfolio
                analytics data.
              </p>
            </div>

            <div className="flex flex-col items-center p-6 bg-[#141a26] rounded-2xl border border-gray-800/60 relative">
              <span className="absolute -top-3 left-6 bg-emerald-400 text-black font-black text-[10px] px-2.5 py-0.5 rounded-md shadow-md">
                STAGE 02
              </span>
              <div className="w-12 h-12 bg-gray-800/50 rounded-xl flex items-center justify-center text-xl mb-4 mt-2 border border-gray-700/30">
                🔍
              </div>
              <h3 className="font-bold text-gray-200 text-sm">
                Query Any Ticker
              </h3>
              <p className="text-[11px] text-gray-400 mt-1.5 text-center leading-relaxed">
                Instantly scan raw financial fundamentals, balancing data, or
                cashflows for global companies.
              </p>
            </div>

            <div className="flex flex-col items-center p-6 bg-[#141a26] rounded-2xl border border-gray-800/60 relative">
              <span className="absolute -top-3 left-6 bg-emerald-400 text-black font-black text-[10px] px-2.5 py-0.5 rounded-md shadow-md">
                STAGE 03
              </span>
              <div className="w-12 h-12 bg-gray-800/50 rounded-xl flex items-center justify-center text-xl mb-4 mt-2 border border-gray-700/30">
                💼
              </div>
              <h3 className="font-bold text-gray-200 text-sm">
                Consolidate Portfolio
              </h3>
              <p className="text-[11px] text-gray-400 mt-1.5 text-center leading-relaxed">
                Add trending items into a personalized watchlist to execute
                real-time performance tracking.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800/80 pt-16 mb-24">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-black text-white tracking-tight">
              Latest Market Insights
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Real-time global equity intelligence reporting streams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {realMarketNewsData &&
              realMarketNewsData.map((news, idx) => (
                <a
                  key={idx}
                  href={news.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-6 bg-[#141a26] rounded-2xl border border-gray-800/60 flex flex-col justify-between text-left transition-all duration-200 hover:border-gray-700 hover:bg-[#1a2130] group shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-800 text-gray-400 px-2.5 py-0.5 rounded-md">
                        {news.category}
                      </span>
                      <span className="text-[10px] text-gray-500 font-medium">
                        {news.time}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-200 text-sm leading-snug group-hover:text-emerald-400 transition-colors mb-2">
                      {news.title}
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                      {news.summary}
                    </p>
                  </div>
                  <div className="mt-5 pt-4 border-t border-gray-800/60 flex items-center justify-between text-[11px] font-bold text-gray-500">
                    <span>
                      Source:{" "}
                      <span className="text-gray-300">{news.source}</span>
                    </span>
                    <span className="text-emerald-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      Read Article ➔
                    </span>
                  </div>
                </a>
              ))}
          </div>
        </div>

        <div className="border-t border-gray-800/80 pt-16 mb-16 max-w-3xl mx-auto w-full">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-black text-white tracking-tight">
              Help Center
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Frequently asked deployment and repository architecture questions.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-[#141a26] border border-gray-800/60 rounded-xl overflow-hidden transition-colors">
              <button
                onClick={() => toggleFaq(1)}
                className="w-full p-5 text-left font-bold text-sm text-gray-200 flex items-center justify-between hover:text-white transition-colors"
              >
                <span className="flex items-center gap-3">
                  <span className="text-gray-500 font-mono">01</span>
                  What is DOLFIN Terminal?
                </span>
                <span
                  className={`text-xs transition-transform duration-200 ${openFaq === 1 ? "rotate-180 text-emerald-400" : "text-gray-500"}`}
                >
                  ▼
                </span>
              </button>
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${openFaq === 1 ? "max-h-40 border-t border-gray-800/60" : "max-h-0"}`}
              >
                <p className="p-5 text-xs text-gray-400 leading-relaxed bg-[#111622]">
                  DOLFIN is a high-speed, noise-free financial analytics
                  platform that provides raw SEC filings, balanced statements,
                  and live simulated watchlists.
                </p>
              </div>
            </div>
            <div className="bg-[#141a26] border border-gray-800/60 rounded-xl overflow-hidden transition-colors">
              <button
                onClick={() => toggleFaq(2)}
                className="w-full p-5 text-left font-bold text-sm text-gray-200 flex items-center justify-between hover:text-white transition-colors"
              >
                <span className="flex items-center gap-3">
                  <span className="text-gray-500 font-mono">02</span>
                  How do I build and track my custom portfolio?
                </span>
                <span
                  className={`text-xs transition-transform duration-200 ${openFaq === 2 ? "rotate-180 text-emerald-400" : "text-gray-500"}`}
                >
                  ▼
                </span>
              </button>
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${openFaq === 2 ? "max-h-40 border-t border-gray-800/60" : "max-h-0"}`}
              >
                <p className="p-5 text-xs text-gray-400 leading-relaxed bg-[#111622]">
                  Simply log in, search for your favorite stock ticker (e.g.,
                  TSLA, AAPL), and click the 'Add' button to link it instantly
                  to your live dashboard grid.
                </p>
              </div>
            </div>
            <div className="bg-[#141a26] border border-gray-800/60 rounded-xl overflow-hidden transition-colors">
              <button
                onClick={() => toggleFaq(3)}
                className="w-full p-5 text-left font-bold text-sm text-gray-200 flex items-center justify-between hover:text-white transition-colors"
              >
                <span className="flex items-center gap-3">
                  <span className="text-gray-500 font-mono">03</span>
                  Where does the fundamental data come from?
                </span>
                <span
                  className={`text-xs transition-transform duration-200 ${openFaq === 3 ? "rotate-180 text-emerald-400" : "text-gray-500"}`}
                >
                  ▼
                </span>
              </button>
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${openFaq === 3 ? "max-h-40 border-t border-gray-800/60" : "max-h-0"}`}
              >
                <p className="p-5 text-xs text-gray-400 leading-relaxed bg-[#111622]">
                  All metrics, financial statements, and stock behaviors on this
                  platform are processed through our own local sandbox
                  repositories (TestData). This data is simulated for
                  educational and portfolio tracking architecture demonstrations
                  and does not reflect real-time live market realities or
                  institutional financial advice.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className="w-full py-4 border-t border-gray-900 text-[10px] text-gray-600 font-medium tracking-wide text-center mt-auto">
        © 2026 DOLFIN TERMINAL LABS. DATA PIPELINES PROCESSED IN SECURE SANDBOX
        ENVIRONMENTS.
      </footer>
    </section>
  )
}

export default Hero
