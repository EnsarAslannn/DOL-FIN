import { useState } from "react"
import {
  testMarketTrendsData,
  realMarketNewsData,
} from "../../Components/Table/TestData"
import MarketTicker from "../MarketTicker/MarketTicker"
import AnimatedGroup from "../AnimatedGroup/AnimatedGroup"
import { Link } from "react-router-dom"
import heroVortex from "../../assets/generated/hero-vortex.jpg"
import networkMesh from "../../assets/generated/network-mesh.jpg"
import vaultCore from "../../assets/generated/vault-core.jpg"

const faqs = [
  {
    id: 1,
    question: "What is DOL-FIN?",
    answer:
      "DOL-FIN is a financial analytics platform for tracking stocks, reading filings, and following what other investors are saying about them.",
  },
  {
    id: 2,
    question: "How do I build and track my portfolio?",
    answer:
      "Log in, search for a ticker (try TSLA or AAPL), and select Add to place it on your dashboard.",
  },
  {
    id: 3,
    question: "Where does the data come from?",
    answer:
      "Every statement and quote here is simulated in a local sandbox for five companies. It's built for learning the platform, not for real trading decisions.",
  },
]

const stages = [
  {
    label: "Stage 01",
    icon: "🔐",
    title: "Create your workspace",
    copy: "Register to get a private portfolio only you can see and edit.",
  },
  {
    label: "Stage 02",
    icon: "🔍",
    title: "Query any ticker",
    copy: "Pull up income statements, balance sheets, and cash flow for any company on the platform.",
  },
  {
    label: "Stage 03",
    icon: "💼",
    title: "Build your portfolio",
    copy: "Add tickers to your watchlist and track performance as it moves.",
  },
]

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
      className="w-full bg-abyss text-foam font-sans min-h-screen flex flex-col pb-4 relative overflow-hidden"
    >
      <MarketTicker />

      {/* ---- Hero stage -------------------------------------------------- */}
      <div className="relative">
        {/* Generated key art: the flare the whole palette is drawn from. It
            sits behind the headline, screened into the void so it reads as
            emitted light rather than a pasted-in photograph. */}
        <div className="absolute inset-x-0 -top-24 h-[820px] pointer-events-none select-none">
          <img
            src={heroVortex}
            alt=""
            aria-hidden="true"
            className="art-layer animate-drift w-full h-full opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-abyss/70 via-abyss/25 to-abyss" />
          <div className="absolute inset-0 grid-veil" />
        </div>

        <div className="container mx-auto px-6 pt-24 pb-16 max-w-6xl relative z-10">
          <AnimatedGroup className="text-center flex flex-col items-center">
            <span className="text-[11px] font-bold text-pulse uppercase tracking-[0.16em] bg-pulse/8 px-4 py-1.5 rounded-full border border-pulse/25 inline-flex items-center gap-2.5 mb-8">
              <span className="relative flex w-2 h-2">
                <span className="sonar-ring" />
                <span className="w-2 h-2 rounded-full bg-pulse shrink-0" />
              </span>
              Live sounding · 5 tickers in range
            </span>

            <h1 className="text-5xl sm:text-7xl font-extrabold text-foam tracking-[-0.03em] mb-6 max-w-4xl leading-[1.05] font-display">
              Find the signal
              <br />
              <span className="text-pulse glow-text">beneath the noise</span>
            </h1>

            <p className="text-base sm:text-lg text-mist max-w-xl leading-relaxed mb-10">
              Track the tickers you care about, read what other investors are
              saying, and dive into the fundamentals underneath the price —
              without paying for a premium terminal.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/search"
                className="glow-action py-4 px-10 text-xs font-bold uppercase tracking-[0.12em] text-white bg-gradient-to-r from-pulse to-[#ff8a3d] rounded-xl transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
              >
                Launch Terminal
              </Link>
              <a
                href="#how-it-works"
                className="py-4 px-8 text-xs font-bold uppercase tracking-[0.12em] text-mist hover:text-foam border border-white/10 hover:border-white/25 rounded-xl transition-all duration-200"
              >
                How it works
              </a>
            </div>
          </AnimatedGroup>
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-6xl relative z-10 flex flex-col">
        {/* ---- Movers -------------------------------------------------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-28">
          <div className="glass-panel-hot rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6 border-b border-white/8 pb-3">
              <h3 className="text-sm font-bold text-foam tracking-wide flex items-center gap-2.5 font-display">
                <span className="w-2 h-2 rounded-full bg-gain shadow-[0_0_10px_#5fe3a6]"></span>
                Top Volatility Gainers
              </h3>
              <span className="text-[10px] text-mist uppercase font-bold tracking-[0.12em]">
                Spot Live
              </span>
            </div>
            <div className="flex flex-col space-y-4">
              {gainers.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs border-b border-white/5 pb-3 last:border-0 last:pb-0"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.logoUrl}
                      alt=""
                      className="w-7 h-7 object-contain rounded-lg bg-white/5 border border-white/8 p-1"
                    />
                    <span className="font-bold text-foam">{item.name}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="font-mono font-medium text-mist">
                      {item.value}
                    </span>
                    <span className="text-gain font-bold bg-gain/10 border border-gain/20 px-2 py-0.5 rounded text-[11px] min-w-[65px] text-center font-mono">
                      {item.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6 border-b border-white/8 pb-3">
              <h3 className="text-sm font-bold text-foam tracking-wide flex items-center gap-2.5 font-display">
                <span className="w-2 h-2 rounded-full bg-loss shadow-[0_0_10px_#ff5d73]"></span>
                Market Short Watch
              </h3>
              <span className="text-[10px] text-mist uppercase font-bold tracking-[0.12em]">
                Simulated
              </span>
            </div>
            <div className="flex flex-col space-y-4">
              {losers.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs border-b border-white/5 pb-3 last:border-0 last:pb-0"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.logoUrl}
                      alt=""
                      className="w-7 h-7 object-contain rounded-lg bg-white/5 border border-white/8 p-1"
                    />
                    <span className="font-bold text-foam">{item.name}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="font-mono font-medium text-mist">
                      {item.value}
                    </span>
                    <span className="text-loss font-bold bg-loss/10 border border-loss/20 px-2 py-0.5 rounded text-[11px] min-w-[65px] text-center font-mono">
                      {item.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ---- How it works -------------------------------------------- */}
        <div id="how-it-works" className="relative rounded-3xl overflow-hidden mb-28">
          {/* Key art #2: a lit node network, standing in for the three stages
              connecting into one account. */}
          <div className="absolute inset-0 pointer-events-none select-none">
            <img
              src={networkMesh}
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-abyss/70 via-abyss/45 to-abyss/90" />
          </div>

          <div className="relative z-10 px-6 sm:px-10 py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foam tracking-[-0.02em] font-display">
                How DOL-FIN Works
              </h2>
              <p className="text-sm text-mist mt-2">
                Three stages between you and a synchronized portfolio.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              {stages.map((stage) => (
                <div
                  key={stage.label}
                  className="glass-panel flex flex-col items-center p-7 rounded-2xl relative"
                >
                  <span className="absolute -top-3 left-6 bg-gradient-to-r from-pulse to-[#ff8a3d] text-white font-bold text-[10px] uppercase tracking-[0.12em] px-2.5 py-1 rounded-md font-mono">
                    {stage.label}
                  </span>
                  <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-xl mb-4 mt-2 border border-white/8">
                    {stage.icon}
                  </div>
                  <h3 className="font-bold text-foam text-sm">{stage.title}</h3>
                  <p className="text-[11px] text-mist mt-2 text-center leading-relaxed">
                    {stage.copy}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ---- Sandbox promise ----------------------------------------- */}
        <div className="glass-panel-hot rounded-3xl overflow-hidden mb-28 grid grid-cols-1 md:grid-cols-2 items-center">
          <div className="p-8 sm:p-12 flex flex-col gap-5 order-2 md:order-1">
            <span className="text-[10px] font-bold text-pulse uppercase tracking-[0.16em] font-mono">
              Sandboxed by design
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-foam tracking-[-0.02em] font-display leading-tight">
              Every position you take
              <br />
              stays inside the vault
            </h3>
            <p className="text-sm text-mist leading-relaxed max-w-md">
              Balances, trades, and comments are scoped to your account and run
              against simulated data. Nothing here touches a real brokerage —
              so you can be wrong as often as it takes to get good.
            </p>
            <Link
              to="/register"
              className="self-start mt-2 py-3 px-7 text-xs font-bold uppercase tracking-[0.12em] text-foam border border-pulse/40 hover:bg-pulse/10 hover:border-pulse rounded-xl transition-all duration-200"
            >
              Create an account
            </Link>
          </div>

          {/* Key art #3: the glass core -- the visual argument for "sandbox". */}
          <div className="relative h-64 md:h-full min-h-[320px] order-1 md:order-2">
            <img
              src={vaultCore}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-abyss via-abyss/20 to-transparent md:from-abyss md:via-abyss/40" />
          </div>
        </div>

        {/* ---- Market insights ----------------------------------------- */}
        <div className="mb-28">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foam tracking-[-0.02em] font-display">
              Latest Market Insights
            </h2>
            <p className="text-sm text-mist mt-2">
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
                  className="glass-panel p-6 rounded-2xl flex flex-col justify-between text-left transition-all duration-200 hover:border-pulse/25 hover:-translate-y-0.5 group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-bold uppercase tracking-[0.12em] bg-white/5 border border-white/8 text-mist px-2.5 py-1 rounded-md">
                        {news.category}
                      </span>
                      <span className="text-[10px] text-mist font-medium font-mono">
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
                  <div className="mt-5 pt-4 border-t border-white/8 flex items-center justify-between text-[11px] font-bold text-mist">
                    <span>
                      Source: <span className="text-foam/80">{news.source}</span>
                    </span>
                    <span className="text-pulse group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      Read article ➔
                    </span>
                  </div>
                </a>
              ))}
          </div>
        </div>

        {/* ---- Help center --------------------------------------------- */}
        <div className="max-w-3xl mx-auto w-full">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foam tracking-[-0.02em] font-display">
              Help center
            </h2>
            <p className="text-sm text-mist mt-2">
              Common questions about the platform and where the data comes from.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className={`glass-panel rounded-2xl overflow-hidden transition-colors ${
                  openFaq === faq.id ? "border-pulse/25" : ""
                }`}
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full p-5 text-left font-bold text-sm text-foam flex items-center justify-between hover:text-pulse transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-mist font-mono">
                      {String(faq.id).padStart(2, "0")}
                    </span>
                    {faq.question}
                  </span>
                  <span
                    className={`text-xs transition-transform duration-200 ${
                      openFaq === faq.id ? "rotate-180 text-pulse" : "text-mist"
                    }`}
                  >
                    ▼
                  </span>
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    openFaq === faq.id ? "max-h-40 border-t border-white/8" : "max-h-0"
                  }`}
                >
                  <p className="p-5 text-xs text-mist leading-relaxed bg-black/20">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="w-full mt-20 pt-8 border-t border-white/8 text-[10px] text-mist/70 font-medium tracking-[0.12em] uppercase text-center">
        © 2026 DOL-FIN · Simulated data, run in a secure sandbox
      </footer>
    </section>
  )
}

export default Hero
