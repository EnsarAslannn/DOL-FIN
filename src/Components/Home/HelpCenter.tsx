import { useId, useState } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import SectionHeader from "../SectionHeader/SectionHeader"
import { bandClass, contentClass } from "../../Helpers/layout"
import { usePrefersReducedMotion } from "../../Helpers/usePrefersReducedMotion"
import { reveal, revealGroup, revealProps } from "../../Helpers/motion"
import { TONE_ATTR } from "../../Helpers/useSectionTone"
import { Chevron, PlusMinus } from "./Icons"

const faqs = [
  {
    question: "What is DOL-FIN?",
    answer:
      "A financial analytics platform for tracking tickers, reading the filings underneath them, and following what other investors are saying about the same companies — in one place, without a terminal subscription.",
  },
  {
    question: "Where does the data come from?",
    answer:
      "Every statement and quote on the platform is simulated in a local sandbox across a set of well-known companies. It is built for learning the workflow, not for making real trading decisions.",
  },
  {
    question: "How do I build and track a portfolio?",
    answer:
      "Create an account, search for a ticker such as TSLA or AAPL, and select Add. The position lands on your dashboard with its cost basis, and the value updates as the simulated tape moves.",
  },
  {
    question: "Who can see my portfolio?",
    answer:
      "Only you. Holdings, balances and wallet activity are scoped to your account. Comments are the one thing you publish deliberately, and they are attached to a company rather than to your portfolio.",
  },
  {
    question: "Does it cost anything?",
    answer:
      "No. There is no card step and no paid tier while the sandbox is open — the account exists so your portfolio has somewhere private to live.",
  },
]

/**
 * Help Center, on the page's second light ground.
 *
 * A minimal accordion: one open at a time, a single plus-to-minus glyph
 * carrying the state, and no rules other than the hairline that separates
 * each row from the next. On cream the rows lift with a white fill rather
 * than a darker one — the same one-step-brighter logic the Graphite cards
 * use on Onyx, inverted.
 *
 * Height is animated via `grid-template-rows` rather than `max-height`, so
 * the panel opens to its exact content height — a fixed max-height either
 * clips long answers or leaves a gap under short ones.
 */
const HelpCenter = () => {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const panelId = useId()

  const toggle = (index: number) =>
    setOpenIndex(openIndex === index ? null : index)

  return (
    <section
      id="help"
      {...{ [TONE_ATTR]: "light" }}
      className={`bg-cream-canvas py-section ${bandClass}`}
    >
      <div className={contentClass}>
        <motion.div
          variants={revealGroup}
          {...revealProps(prefersReducedMotion)}
        >
          <SectionHeader
            align="center"
            tone="light"
            eyebrow="Help Center"
            title="Questions, answered"
            lead="The five things people ask before they create an account."
          />
        </motion.div>

        <motion.div
          variants={revealGroup}
          {...revealProps(prefersReducedMotion)}
          className="mx-auto mt-16 flex max-w-[820px] flex-col gap-2"
        >
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index

            return (
              <motion.div
                key={faq.question}
                variants={reveal}
                className={`overflow-hidden rounded-card border transition-colors duration-200 ${
                  isOpen
                    ? "border-onyx-canvas/20 bg-pure-white/70"
                    : "border-onyx-canvas/10 bg-pure-white/35 hover:border-onyx-canvas/20"
                }`}
              >
                <h3>
                  <button
                    type="button"
                    onClick={() => toggle(index)}
                    aria-expanded={isOpen}
                    aria-controls={`${panelId}-${index}`}
                    className="flex w-full cursor-pointer items-center justify-between gap-6 px-6 py-5 text-left"
                  >
                    <span className="text-body-lg font-medium text-onyx-canvas md:text-subheading">
                      {faq.question}
                    </span>
                    <span
                      className={`shrink-0 transition-colors duration-200 ${
                        isOpen ? "text-cobalt" : "text-ink-muted"
                      }`}
                    >
                      <PlusMinus open={isOpen} className="h-4 w-4" />
                    </span>
                  </button>
                </h3>

                <div
                  id={`${panelId}-${index}`}
                  className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-[68ch] px-6 pb-6 text-body font-normal text-ink-muted">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        <motion.p
          variants={reveal}
          {...revealProps(prefersReducedMotion)}
          className="mt-12 text-center text-body font-normal text-ink-muted"
        >
          Still stuck?{" "}
          <Link
            to="/register"
            className="inline-flex items-center gap-1 text-onyx-canvas underline-offset-4 transition-colors duration-200 hover:text-cobalt hover:underline"
          >
            Create an account and try it
            <Chevron className="h-3 w-3" />
          </Link>
        </motion.p>
      </div>
    </section>
  )
}

export default HelpCenter
