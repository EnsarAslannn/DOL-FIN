import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { usePrefersReducedMotion } from "../../Helpers/usePrefersReducedMotion"
import { reveal, revealGroup, revealProps } from "../../Helpers/motion"

interface Props {
  children: ReactNode
  className?: string
}

/**
 * A section that arrives on scroll.
 *
 * The landing page's bands each fade up as they cross into view, and the
 * dashboard only had that where a component happened to build it in —
 * ListPortfolio's card grid animated, the heading above it did not, so a
 * section would half-arrive. This is the plain wrapper for everything that
 * needs the same entrance without owning a motion tree of its own.
 *
 * It carries its own viewport trigger rather than inheriting one, so a block
 * reveals when *it* reaches the fold rather than when its band does. On a
 * 2,000px band those are very different moments, and the second one means
 * everything below the first screen is already finished by the time you
 * reach it.
 *
 * Reduced motion collapses the whole thing: `revealProps` returns no variants
 * at all, so the content renders in its final state rather than waiting for
 * an animation that will never run.
 */
export const Reveal = ({ children, className = "" }: Props) => {
  const prefersReducedMotion = usePrefersReducedMotion()

  return (
    <motion.div
      variants={reveal}
      {...revealProps(prefersReducedMotion)}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/**
 * A set of peers that arrive in sequence.
 *
 * Direct children marked with `RevealItem` inherit the hidden/visible state
 * from here and stagger off it. Use for rows of tiles or cards, where one
 * block fading in reads as flat and a 70ms cascade reads as deliberate.
 */
export const RevealGroup = ({ children, className = "" }: Props) => {
  const prefersReducedMotion = usePrefersReducedMotion()

  return (
    <motion.div
      variants={revealGroup}
      {...revealProps(prefersReducedMotion)}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/**
 * One member of a `RevealGroup`.
 *
 * Deliberately has no viewport trigger of its own — the group owns that, and
 * a child that re-triggered independently would break the cascade.
 */
export const RevealItem = ({ children, className = "" }: Props) => (
  <motion.div variants={reveal} className={className}>
    {children}
  </motion.div>
)

export default Reveal
