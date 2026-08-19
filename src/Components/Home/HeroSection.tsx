import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import heroStill from "../../assets/extra/hero-still.webp"
import heroVideo from "../../assets/extra/HeroDOLFIN.mp4"
import { usePrefersReducedMotion } from "../../Helpers/usePrefersReducedMotion"
import { bandClass, contentClass } from "../../Helpers/layout"
import { ctaClass, ctaGhostFullClass } from "../../Helpers/formStyles"
import { reveal, revealGroup } from "../../Helpers/motion"
import { TONE_ATTR } from "../../Helpers/useSectionTone"
import { Check, Chevron } from "./Icons"

const heroStats = [
  { label: "Full statements", value: "Income, balance and cash flow" },
  { label: "No card required", value: "Free while the sandbox is open" },
  { label: "Private by default", value: "Your portfolio, only your account" },
]

const HeroSection = () => {
  const prefersReducedMotion = usePrefersReducedMotion()

  return (
    <section
      id="hero"
      {...{ [TONE_ATTR]: "dark" }}
      className={`relative flex min-h-svh flex-col overflow-hidden bg-onyx-canvas ${bandClass}`}
    >
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

      <div aria-hidden="true" className="absolute inset-0 bg-onyx-canvas/25" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-onyx-canvas/85 via-onyx-canvas/40 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-onyx-canvas/65 via-transparent to-onyx-canvas/80"
      />

      <div className="relative z-10 flex flex-1 flex-col justify-end pb-14 pt-40 sm:pb-16 md:pb-20 md:pt-48">
        <div className={contentClass}>
          <motion.div
            initial={prefersReducedMotion ? undefined : "hidden"}
            animate={prefersReducedMotion ? undefined : "visible"}
            variants={revealGroup}
            className="max-w-[760px]"
          >
            <motion.span
              variants={reveal}
              className="inline-flex items-start gap-2 font-mono text-caption font-normal uppercase tracking-label-lg text-ivory-text/85"
            >
              <Check className="mt-[2px] h-3 w-3" />
              Simulated market data · no brokerage attached
            </motion.span>

            <motion.h1
              variants={reveal}
              className="mt-8 text-heading-lg font-medium text-ivory-text md:text-display-md lg:text-display"
            >
              Find the signal
              <br />
              beneath the noise
            </motion.h1>

            <motion.p
              variants={reveal}
              className="mt-7 max-w-[460px] text-body-lg font-normal text-ash-text"
            >
              Track the tickers you care about, read what other investors are
              saying, and dive into the fundamentals underneath the price.
            </motion.p>

            <motion.div
              variants={reveal}
              className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
            >
              <Link
                to="/register"
                className={`inline-flex items-center justify-center gap-2 ${ctaClass}`}
              >
                Create an account
                <Chevron className="h-4 w-4" />
              </Link>
              <a
                href="#how-it-works"
                className={`inline-flex items-center justify-center ${ctaGhostFullClass}`}
              >
                See how it works
              </a>
            </motion.div>
          </motion.div>
        </div>

        <div className={`mt-16 md:mt-24 ${contentClass}`}>
          <motion.dl
            initial={prefersReducedMotion ? undefined : "hidden"}
            animate={prefersReducedMotion ? undefined : "visible"}
            variants={revealGroup}
            className="grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-3"
          >
            {heroStats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={reveal}
                className="border-l border-mist-border/25 pl-4 sm:first:border-l-0 sm:first:pl-0"
              >
                <dt className="text-body font-medium text-ivory-text">
                  {stat.label}
                </dt>
                <dd className="mt-1 text-label font-normal text-ash-text">
                  {stat.value}
                </dd>
              </motion.div>
            ))}
          </motion.dl>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
