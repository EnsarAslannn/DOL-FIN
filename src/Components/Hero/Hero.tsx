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
      className="w-full bg-abyss text-foam font-sans min-h-screen flex flex-col pb-24 relative overflow-hidden"
    >
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-pulse/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/3 left-1/4 w-[400px] h-[400px] bg-pulse-dim/10 rounded-full blur-[100px] pointer-events-none"></div>

      <MarketTicker />

      <div className="container mx-auto px-6 py-16 flex-grow flex flex-col justify-center max-w-6xl relative z-10">
        <div className="text-center mb-24 mt-8">
          <span className="text-[11px] font-bold text-pulse uppercase tracking-widest bg-pulse/10 px-4 py-1.5 rounded-full border border-pulse/20 shadow-sm inline-flex items-center gap-2.5 mb-4">
            <span className="relative flex w-2 h-2">
              <span className="sonar-ring" />
              <span className="w-2 h-2 rounded-full bg-pulse shrink-0" />
            </span>
            Live sounding · 5 tickers in range
          </span>
          <h1 className="text-4xl font-bold text-foam tracking-tight sm:text-6xl mb-6 max-w-3xl mx-auto leading-none font-display">
            Find the signal <br />
            <span className="text-pulse drop-shadow-[0_0_15px_rgba(69,232,214,0.3)]">
              beneath the noise
            </span>
          </h1>
          <p className="text-base text-mist max-w-xl mx-auto leading-relaxed mb-8">
            Track the tickers you care about, read what other investors are
            saying, and dive into the fundamentals underneath the price —
            without paying for a premium terminal.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              to="/search"
              className="py-3.5 px-10 text-sm font-bold text-abyss bg-pulse hover:bg-pulse-dim rounded-xl transition-all duration-200 shadow-lg shadow-pulse/20 transform hover:-translate-y-0.5"
            >
              Launch Terminal
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          <div className="bg-depth border border-ridge/40 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6 border-b border-ridge/40 pb-3">
              <h3 className="text-sm font-bold text-foam tracking-wide flex items-center gap-2 font-display">
                <span className="w-2 h-2 rounded-full bg-gain shadow-[0_0_8px_#5fe3a6]"></span>
                Top Volatility Gainers
              </h3>
              <span className="text-[10px] text-mist uppercase font-bold tracking-wider">
                Spot Live
              </span>
            </div>
            <div className="flex flex-col space-y-4">
              {gainers.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs border-b border-ridge/20 pb-3 last:border-0 last:pb-0"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.logoUrl}
                      alt=""
                      className="w-6 h-6 object-contain rounded-md bg-depth-2 p-0.5"
                    />
                    <span className="font-bold text-foam">{item.name}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="font-mono font-medium text-mist">
                      {item.value}
                    </span>
                    <span className="text-gain font-bold bg-gain/10 px-2 py-0.5 rounded text-[11px] min-w-[65px] text-center font-mono">
                      {item.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-depth border border-ridge/40 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6 border-b border-ridge/40 pb-3">
              <h3 className="text-sm font-bold text-foam tracking-wide flex items-center gap-2 font-display">
                <span className="w-2 h-2 rounded-full bg-loss shadow-[0_0_8px_#ff7a66]"></span>
                Market Short Watch
              </h3>
              <span className="text-[10px] text-mist uppercase font-bold tracking-wider">
                Simulated
              </span>
            </div>
            <div className="flex flex-col space-y-4">
              {losers.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs border-b border-ridge/20 pb-3 last:border-0 last:pb-0"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.logoUrl}
                      alt=""
                      className="w-6 h-6 object-contain rounded-md bg-depth-2 p-0.5"
                    />
                    <span className="font-bold text-foam">{item.name}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="font-mono font-medium text-mist">
                      {item.value}
                    </span>
                    <span className="text-loss font-bold bg-loss/10 px-2 py-0.5 rounded text-[11px] min-w-[65px] text-center font-mono">
                      {item.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-ridge/30 pt-16 mb-24">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-foam tracking-tight font-display">
              How DOL-FIN Works
            </h2>
            <p className="text-xs text-mist mt-1">
              Three stages between you and a synchronized portfolio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative items-stretch">
            <div className="flex flex-col items-center p-6 bg-depth rounded-2xl border border-ridge/40 relative">
              <span className="absolute -top-3 left-6 bg-pulse text-abyss font-bold text-[10px] px-2.5 py-0.5 rounded-md shadow-md font-mono">
                STAGE 01
              </span>
              <div className="w-12 h-12 bg-depth-2 rounded-xl flex items-center justify-center text-xl mb-4 mt-2 border border-ridge/30">
                🔐
              </div>
              <h3 className="font-bold text-foam text-sm">
                Create your workspace
              </h3>
              <p className="text-[11px] text-mist mt-1.5 text-center leading-relaxed">
                Register to get a private portfolio only you can see and edit.
              </p>
            </div>

            <div className="flex flex-col items-center p-6 bg-depth rounded-2xl border border-ridge/40 relative">
              <span className="absolute -top-3 left-6 bg-pulse text-abyss font-bold text-[10px] px-2.5 py-0.5 rounded-md shadow-md font-mono">
                STAGE 02
              </span>
              <div className="w-12 h-12 bg-depth-2 rounded-xl flex items-center justify-center text-xl mb-4 mt-2 border border-ridge/30">
                🔍
              </div>
              <h3 className="font-bold text-foam text-sm">
                Query any ticker
              </h3>
              <p className="text-[11px] text-mist mt-1.5 text-center leading-relaxed">
                Pull up income statements, balance sheets, and cash flow for
                any company on the platform.
              </p>
            </div>

            <div className="flex flex-col items-center p-6 bg-depth rounded-2xl border border-ridge/40 relative">
              <span className="absolute -top-3 left-6 bg-pulse text-abyss font-bold text-[10px] px-2.5 py-0.5 rounded-md shadow-md font-mono">
                STAGE 03
              </span>
              <div className="w-12 h-12 bg-depth-2 rounded-xl flex items-center justify-center text-xl mb-4 mt-2 border border-ridge/30">
                💼
              </div>
              <h3 className="font-bold text-foam text-sm">
                Build your portfolio
              </h3>
              <p className="text-[11px] text-mist mt-1.5 text-center leading-relaxed">
                Add tickers to your watchlist and track performance as it
                moves.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-ridge/30 pt-16 mb-24">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-foam tracking-tight font-display">
              Latest Market Insights
            </h2>
            <p className="text-sm text-mist mt-1">
              What's moving across global equities right now.
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
                  className="p-6 bg-depth rounded-2xl border border-ridge/40 flex flex-col justify-between text-left transition-all duration-200 hover:border-ridge hover:bg-depth-2 group shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-depth-2 text-mist px-2.5 py-0.5 rounded-md">
                        {news.category}
                      </span>
                      <span className="text-[10px] text-mist font-medium">
                        {news.time}
                      </span>
                    </div>
                    <h3 className="font-bold text-foam text-sm leading-snug group-hover:text-pulse transition-colors mb-2">
                      {news.title}
                    </h3>
                    <p className="text-xs text-mist leading-relaxed line-clamp-2">
                      {news.summary}
                    </p>
                  </div>
                  <div className="mt-5 pt-4 border-t border-ridge/40 flex items-center justify-between text-[11px] font-bold text-mist">
                    <span>
                      Source:{" "}
                      <span className="text-foam/80">{news.source}</span>
                    </span>
                    <span className="text-pulse group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      Read article ➔
                    </span>
                  </div>
                </a>
              ))}
          </div>
        </div>

        <div className="border-t border-ridge/30 pt-16 mb-16 max-w-3xl mx-auto w-full">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-foam tracking-tight font-display">
              Help center
            </h2>
            <p className="text-xs text-mist mt-1">
              Common questions about the platform and where the data comes
              from.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-depth border border-ridge/40 rounded-xl overflow-hidden transition-colors">
              <button
                onClick={() => toggleFaq(1)}
                className="w-full p-5 text-left font-bold text-sm text-foam flex items-center justify-between hover:text-pulse transition-colors"
              >
                <span className="flex items-center gap-3">
                  <span className="text-mist font-mono">01</span>
                  What is DOL-FIN?
                </span>
                <span
                  className={`text-xs transition-transform duration-200 ${openFaq === 1 ? "rotate-180 text-pulse" : "text-mist"}`}
                >
                  ▼
                </span>
              </button>
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${openFaq === 1 ? "max-h-40 border-t border-ridge/40" : "max-h-0"}`}
              >
                <p className="p-5 text-xs text-mist leading-relaxed bg-abyss/40">
                  DOL-FIN is a financial analytics platform for tracking
                  stocks, reading filings, and following what other investors
                  are saying about them.
                </p>
              </div>
            </div>
            <div className="bg-depth border border-ridge/40 rounded-xl overflow-hidden transition-colors">
              <button
                onClick={() => toggleFaq(2)}
                className="w-full p-5 text-left font-bold text-sm text-foam flex items-center justify-between hover:text-pulse transition-colors"
              >
                <span className="flex items-center gap-3">
                  <span className="text-mist font-mono">02</span>
                  How do I build and track my portfolio?
                </span>
                <span
                  className={`text-xs transition-transform duration-200 ${openFaq === 2 ? "rotate-180 text-pulse" : "text-mist"}`}
                >
                  ▼
                </span>
              </button>
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${openFaq === 2 ? "max-h-40 border-t border-ridge/40" : "max-h-0"}`}
              >
                <p className="p-5 text-xs text-mist leading-relaxed bg-abyss/40">
                  Log in, search for a ticker (try TSLA or AAPL), and select
                  Add to place it on your dashboard.
                </p>
              </div>
            </div>
            <div className="bg-depth border border-ridge/40 rounded-xl overflow-hidden transition-colors">
              <button
                onClick={() => toggleFaq(3)}
                className="w-full p-5 text-left font-bold text-sm text-foam flex items-center justify-between hover:text-pulse transition-colors"
              >
                <span className="flex items-center gap-3">
                  <span className="text-mist font-mono">03</span>
                  Where does the data come from?
                </span>
                <span
                  className={`text-xs transition-transform duration-200 ${openFaq === 3 ? "rotate-180 text-pulse" : "text-mist"}`}
                >
                  ▼
                </span>
              </button>
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${openFaq === 3 ? "max-h-40 border-t border-ridge/40" : "max-h-0"}`}
              >
                <p className="p-5 text-xs text-mist leading-relaxed bg-abyss/40">
                  Every statement and quote here is simulated in a local
                  sandbox for five companies. It's built for learning the
                  platform, not for real trading decisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className="w-full py-4 border-t border-ridge/20 text-[10px] text-mist/60 font-medium tracking-wide text-center mt-auto">
        © 2026 DOL-FIN. SIMULATED DATA, RUN IN A SECURE SANDBOX.
      </footer>
    </section>
  )
}

export default Hero
