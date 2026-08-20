import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { usePrefersReducedMotion } from "../../Helpers/usePrefersReducedMotion"
import { reveal, revealGroup, revealProps } from "../../Helpers/motion"

interface Props {
  children: ReactNode
  className?: string
}

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

export const RevealItem = ({ children, className = "" }: Props) => (
  <motion.div variants={reveal} className={className}>
    {children}
  </motion.div>
)

export default Reveal
