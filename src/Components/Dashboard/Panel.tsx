import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { usePrefersReducedMotion } from "../../Helpers/usePrefersReducedMotion"
import { reveal, revealProps } from "../../Helpers/motion"

interface PanelProps {
  children: ReactNode
  /**
   * `raised` puts the content on Graphite — for the surfaces that genuinely
   * need quiet separation, like a data table or a portfolio card.
   * `bare` keeps it on the Onyx canvas with no fill and no border, which is
   * the default: most sections are separated by space, not by a box.
   */
  surface?: "bare" | "raised"
  className?: string
  /** Skip the entrance animation for content that is already on screen. */
  animate?: boolean
}

/**
 * A dashboard section.
 *
 * The old pages nested bordered boxes three deep. Here the canvas does the
 * containing and Graphite appears only where a surface has to lift — so a
 * page reads as a few large areas rather than a grid of frames.
 */
export const Panel = ({
  children,
  surface = "bare",
  className = "",
  animate = true,
}: PanelProps) => {
  const prefersReducedMotion = usePrefersReducedMotion()

  const skin =
    surface === "raised"
      ? "rounded-card bg-graphite-card ring-1 ring-inset ring-mist-border/6"
      : ""

  return (
    <motion.section
      variants={reveal}
      {...(animate ? revealProps(prefersReducedMotion) : {})}
      className={`${skin} ${className}`}
    >
      {children}
    </motion.section>
  )
}

interface HeaderProps {
  /** Mono uppercase kicker naming the section's role. */
  eyebrow?: string
  title: string
  lead?: string
  /** Right-aligned controls: a filter, a count, an action. */
  actions?: ReactNode
  className?: string
}

/**
 * The dashboard's section opener.
 *
 * Mirrors the landing page's SectionHeader at a smaller step — same eyebrow,
 * same weight-500 heading, same Ash lead — so moving from the marketing page
 * into the product does not feel like changing products.
 */
export const PanelHeader = ({
  eyebrow,
  title,
  lead,
  actions,
  className = "",
}: HeaderProps) => (
  <div
    className={`flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between ${className}`}
  >
    <div>
      {eyebrow && (
        <span className="block font-mono text-caption font-normal uppercase tracking-label-lg text-ash-text/70">
          {eyebrow}
        </span>
      )}
      <h2 className="mt-3 text-heading-sm font-medium text-ivory-text md:text-heading">
        {title}
      </h2>
      {lead && (
        <p className="mt-3 max-w-[60ch] text-body font-normal text-ash-text">
          {lead}
        </p>
      )}
    </div>
    {actions && <div className="shrink-0">{actions}</div>}
  </div>
)

export default Panel
