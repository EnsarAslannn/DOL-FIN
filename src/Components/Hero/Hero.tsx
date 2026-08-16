import { useState } from "react"
import {
  testMarketTrendsData,
  realMarketNewsData,
} from "../../Components/Table/TestData"
import MarketTicker from "../MarketTicker/MarketTicker"
import AnimatedGroup from "../AnimatedGroup/AnimatedGroup"
import SectionHeader from "../SectionHeader/SectionHeader"
import SiteFooter from "../SiteFooter/SiteFooter"
import { Link } from "react-router-dom"
import heroStill from "../../assets/extra/hero-still.webp"
import heroVideo from "../../assets/extra/HeroDOLFIN.mp4"
import networkMesh from "../../assets/extra/market-skyline.webp"
import atriumLight from "../../assets/extra/atrium-light.webp"
import { usePrefersReducedMotion } from "../../Helpers/usePrefersReducedMotion"
import { containerClass } from "../../Helpers/layout"
import { ctaClass } from "../../Helpers/formStyles"

const trustBadges = [
  "Simulated data",
  "No card required",
  "Read-only market data",
]

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
    label: "01",
    title: "Create your workspace",
    copy: "Register to get a private portfolio only you can see and edit.",
  },
  {
    label: "02",
    title: "Query any ticker",
    copy: "Pull up income statements, balance sheets, and cash flow for any company on the platform.",
  },
  {
    label: "03",
    title: "Build your portfolio",
    copy: "Add tickers to your watchlist and track performance as it moves.",
  },
]

const Chevron = ({ className = "" }: { className?: string }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    className={`shrink-0 ${className}`}
  >
    <path
      d="M6 3.5L10.5 8L6 12.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

/** Trust badge row — pairs with every primary CTA, per DESIGN.md. */
const TrustBadges = () => (
  <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
    {trustBadges.map((badge) => (
      <li
        key={badge}
        className="flex items-center gap-2 text-caption font-normal text-paper-white/75"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden="true"
          className="shrink-0 text-paper-white/80"
        >
          <path
            d="M2.5 6.2L4.8 8.5L9.5 3.8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {badge}
      </li>
    ))}
  </ul>
)

const Hero = () => {
  const prefersReducedMotion = usePrefersReducedMotion()
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
      className="w-full bg-paper-white text-carbon-black font-sans relative"
    >
      {/* Full-bleed cinematic hero. The nav pill floats over this block. */}
      <div className="relative flex min-h-screen w-full flex-col overflow-hidden">
        {prefersReducedMotion ? (
          <img
            src={heroStill}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            poster={heroStill}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
            tabIndex={-1}
          >
            <source src={heroVideo} type="video/mp4" />
          </video>
        )}

        {/* Scrim. A flat base plus a vertical gradient that deepens at the
            top and bottom, so the floating nav and the CTA row keep their
            contrast against the brightest frames of the loop. */}
        <div aria-hidden="true" className="absolute inset-0 bg-carbon-black/50" />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-carbon-black/75 via-carbon-black/30 to-carbon-black/85"
        />

        <div className="relative z-10 flex flex-1 items-center justify-center px-6 pb-24 pt-36">
          <AnimatedGroup className="flex flex-col items-center text-center">
            <span className="mb-8 inline-flex items-center gap-3 font-mono text-caption font-normal uppercase tracking-label-lg text-paper-white/85">
              <span className="relative flex h-2 w-2 text-paper-white">
                <span className="sonar-ring" />
                <span className="h-2 w-2 shrink-0 rounded-full bg-paper-white" />
              </span>
              Live sounding · 5 tickers in range
            </span>

            {/* Weight 400 at display size is the system's signature. */}
            <h1 className="mb-8 max-w-4xl text-heading-lg font-normal text-paper-white md:text-display">
              Find the signal
              <br />
              beneath the noise
            </h1>

            <p className="mb-12 max-w-[480px] text-body-lg font-normal text-paper-white/85">
              Track the tickers you care about, read what other investors are
              saying, and dive into the fundamentals underneath the price.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
              <Link
                to="/search"
                className={`inline-flex items-center gap-2 ${ctaClass}`}
              >
                Launch Terminal
                <Chevron className="h-4 w-4" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center py-3 text-body font-normal text-paper-white/80 underline-offset-[6px] transition-colors duration-200 hover:text-paper-white hover:underline"
              >
                How it works
              </a>
            </div>

            <TrustBadges />
          </AnimatedGroup>
        </div>
      </div>

      <MarketTicker />

      <div className={`relative z-10 flex flex-col ${containerClass}`}>
        {/* Movers. Two instrument panels built from hairlines rather than
            boxes: a heavy rule opens each column, light rules separate the
            rows, and whitespace does the containing. */}
        <section className="py-section">
          <SectionHeader
            eyebrow="Live tape"
            title="Where the tape is moving"
            lead="The sharpest moves across the tickers on the platform."
          />

          <div className="mt-16 grid grid-cols-1 gap-x-16 gap-y-14 md:grid-cols-2">
            {[
              {
                title: "Top Volatility Gainers",
                meta: "Spot Live",
                rows: gainers,
                up: true,
              },
              {
                title: "Market Short Watch",
                meta: "Simulated",
                rows: losers,
                up: false,
              },
            ].map((panel) => (
              <div key={panel.title}>
                <div className="flex items-baseline justify-between gap-4 border-t border-carbon-black pt-4">
                  <h3 className="flex items-center gap-3 text-subheading font-normal text-carbon-black">
                    <span
                      aria-hidden="true"
                      className={`h-2 w-2 shrink-0 rounded-full ${
                        panel.up ? "bg-gain" : "bg-loss"
                      }`}
                    />
                    {panel.title}
                  </h3>
                  <span className="shrink-0 font-mono text-caption font-normal uppercase tracking-label text-ash-gray">
                    {panel.meta}
                  </span>
                </div>

                <ul className="mt-2 flex flex-col">
                  {panel.rows.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-center justify-between gap-4 border-b border-mist-gray py-4"
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <img
                          src={item.logoUrl}
                          alt=""
                          aria-hidden="true"
                          className="h-6 w-6 shrink-0 object-contain"
                        />
                        <span className="truncate text-body font-normal text-carbon-black">
                          {item.name}
                        </span>
                      </div>
                      <div className="flex shrink-0 items-baseline gap-6">
                        <span className="font-mono text-body font-normal text-zinc-gray">
                          {item.value}
                        </span>
                        <span
                          className={`min-w-[76px] text-right font-mono text-body font-bold ${
                            panel.up ? "text-gain" : "text-loss"
                          }`}
                        >
                          {panel.up ? "▲" : "▼"} {item.change}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* How it works. Oversized mono numerals carry the sequence; the
            boxes are gone entirely. */}
        <section id="how-it-works" className="py-section">
          <SectionHeader
            eyebrow="Getting started"
            title="How DOL-FIN works"
            lead="Three stages between you and a synchronized portfolio."
          />

          <div className="mt-16 grid grid-cols-1 gap-x-16 gap-y-14 md:grid-cols-3">
            {stages.map((stage) => (
              <div key={stage.label} className="border-t border-carbon-black pt-6">
                <span className="block font-mono text-heading-xl font-normal text-ash-gray">
                  {stage.label}
                </span>
                <h3 className="mt-8 text-heading-sm font-normal text-carbon-black">
                  {stage.title}
                </h3>
                <p className="mt-4 text-body font-normal text-zinc-gray">
                  {stage.copy}
                </p>
              </div>
            ))}
          </div>

          <img
            src={atriumLight}
            alt=""
            aria-hidden="true"
            className="mt-20 aspect-[3/1] w-full rounded-card object-cover"
          />
        </section>

        {/* Market insights. An editorial index, not a wall of cards. */}
        <section className="py-section">
          <SectionHeader
            eyebrow="Newsroom"
            title="Latest market insights"
            lead="What's moving across global equities right now."
          />

          <div className="mt-16 grid grid-cols-1 gap-x-16 md:grid-cols-2">
            {realMarketNewsData &&
              realMarketNewsData.map((news, idx) => (
                <a
                  key={idx}
                  href={news.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col border-t border-mist-gray py-8 transition-colors duration-200 hover:border-carbon-black"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="font-mono text-caption font-normal uppercase tracking-label text-zinc-gray">
                      {news.category}
                    </span>
                    <span className="shrink-0 font-mono text-caption font-normal text-ash-gray">
                      {news.time}
                    </span>
                  </div>

                  <h3 className="mt-6 text-heading-sm font-normal text-carbon-black underline-offset-4 group-hover:underline">
                    {news.title}
                  </h3>
                  <p className="mt-4 line-clamp-2 text-body font-normal text-zinc-gray">
                    {news.summary}
                  </p>

                  <span className="mt-6 flex items-center gap-2 font-mono text-caption font-normal uppercase tracking-label-sm text-ash-gray">
                    {news.source}
                    <Chevron className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                </a>
              ))}
          </div>
        </section>
      </div>

      {/* Sandbox CTA — the page's second cinematic dark moment. */}
      <div className="relative w-full overflow-hidden">
        <img
          src={networkMesh}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-carbon-black/75" />
        <div
          className={`relative z-10 flex flex-col items-center py-section text-center ${containerClass}`}
        >
          <span className="font-mono text-caption font-normal uppercase tracking-label-lg text-paper-white/75">
            Sandboxed by design
          </span>
          <h2 className="mt-8 max-w-[16ch] text-heading md:text-heading-lg lg:text-display-sm font-normal text-paper-white">
            Every position you take stays inside the vault
          </h2>
          <p className="mt-8 max-w-[480px] text-body-lg font-normal text-paper-white/85">
            Balances, trades, and comments are scoped to your account and run
            against simulated data. Nothing here touches a real brokerage.
          </p>
          <Link
            to="/register"
            className={`mt-12 inline-flex items-center gap-2 ${ctaClass}`}
          >
            Create an account
            <Chevron className="h-4 w-4" />
          </Link>
          <TrustBadges />
        </div>
      </div>

      {/* FAQ — no boxes, no rules. Whitespace and type size do the work, and
          the measure is capped so the ghost link stays beside its question
          instead of drifting to the far edge of the grid. */}
      <div className={`relative z-10 py-section ${containerClass}`}>
        <SectionHeader eyebrow="Answers" title="Frequently asked questions" />

        <div className="mt-16 flex max-w-[860px] flex-col gap-element">
          {faqs.map((faq) => (
            <div key={faq.id} className="w-full">
              <button
                onClick={() => toggleFaq(faq.id)}
                aria-expanded={openFaq === faq.id}
                className="flex w-full cursor-pointer items-start justify-between gap-8 py-4 text-left"
              >
                <span className="text-heading-sm md:text-heading font-normal text-carbon-black">
                  {faq.question}
                </span>
                <span className="shrink-0 whitespace-nowrap pt-3 text-label font-normal text-zinc-gray underline-offset-4 hover:underline">
                  {openFaq === faq.id ? "Close" : "Read more"}
                </span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openFaq === faq.id ? "max-h-40" : "max-h-0"
                }`}
              >
                <p className="max-w-[62ch] pb-6 text-body-lg font-normal text-zinc-gray">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <SiteFooter />
    </section>
  )
}

export default Hero
