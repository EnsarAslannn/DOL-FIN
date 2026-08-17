import type { ReactNode } from "react"
import { motion } from "framer-motion"
import emptyWallet from "../../assets/extra/empty-wallet.webp"
import emptySearch from "../../assets/extra/empty-search.webp"
import { usePrefersReducedMotion } from "../../Helpers/usePrefersReducedMotion"
import { reveal, revealGroup, revealProps } from "../../Helpers/motion"

const art = {
  wallet: {
    src: emptyWallet,
    /* Keyed to transparency, so it needs its own grounding glow — without
       one the render floats with nothing underneath it. */
    glow: true,
  },
  search: {
    src: emptySearch,
    /* Rendered on its own dark plinth already; a second glow would double up. */
    glow: false,
  },
} as const

interface Props {
  variant: keyof typeof art
  title: string
  description: string
  /** Optional action. A single primary route out of the empty state. */
  children?: ReactNode
}

/**
 * The dashboard's empty state.
 *
 * Replaces a line of grey text with the 3D asset for that context, sized
 * generously and set on its own vertical rhythm — an empty portfolio is the
 * first thing a new account sees, so it carries the weight of a real screen
 * rather than an error.
 *
 * Both renders are masked with a radial fade at the edges. The search plinth
 * is charcoal and the wallet's contact shadow is grey; against Onyx either
 * would otherwise end on a visible rectangular seam.
 */
const EmptyState = ({ variant, title, description, children }: Props) => {
  const prefersReducedMotion = usePrefersReducedMotion()
  const { src, glow } = art[variant]

  return (
    <motion.div
      variants={revealGroup}
      {...revealProps(prefersReducedMotion)}
      className="flex flex-col items-center px-6 py-16 text-center md:py-20"
    >
      <motion.div variants={reveal} className="relative">
        {glow && (
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cobalt/12 blur-3xl"
          />
        )}
        <img
          src={src}
          alt=""
          aria-hidden="true"
          width={240}
          height={240}
          loading="lazy"
          decoding="async"
          className="relative h-40 w-40 object-contain md:h-56 md:w-56"
          style={{
            maskImage:
              "radial-gradient(circle at 50% 50%, #000 58%, transparent 88%)",
            WebkitMaskImage:
              "radial-gradient(circle at 50% 50%, #000 58%, transparent 88%)",
          }}
        />
      </motion.div>

      <motion.h3
        variants={reveal}
        className="mt-8 text-heading-sm font-medium text-ivory-text"
      >
        {title}
      </motion.h3>
      <motion.p
        variants={reveal}
        className="mt-3 max-w-[46ch] text-body font-normal text-ash-text"
      >
        {description}
      </motion.p>

      {children && (
        <motion.div variants={reveal} className="mt-8">
          {children}
        </motion.div>
      )}
    </motion.div>
  )
}

export default EmptyState
