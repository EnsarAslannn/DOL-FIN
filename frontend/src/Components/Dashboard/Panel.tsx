import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { usePrefersReducedMotion } from "../../Helpers/usePrefersReducedMotion"
import { reveal, revealProps } from "../../Helpers/motion"

interface PanelProps {
  children: ReactNode
  surface?: "bare" | "raised"
  className?: string
  animate?: boolean
}

export const Panel = ({
  children,
  surface = "bare",
  className = "",
  animate = true,
}: PanelProps) => {
  const prefersReducedMotion = usePrefersReducedMotion()

  const skin =
    surface === "raised"
      ? "rounded-card bg-band-surface ring-1 ring-inset ring-band-line/6"
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
  eyebrow?: string
  title: string
  lead?: string
  actions?: ReactNode
  className?: string
}

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
        <span className="block font-mono text-caption font-normal uppercase tracking-label-lg text-band-subtle">
          {eyebrow}
        </span>
      )}
      <h2 className="mt-3 text-heading-sm font-medium text-band-ink md:text-heading">
        {title}
      </h2>
      {lead && (
        <p className="mt-3 max-w-[60ch] text-body font-normal text-band-muted">
          {lead}
        </p>
      )}
    </div>
    {actions && <div className="shrink-0">{actions}</div>}
  </div>
)

export default Panel
