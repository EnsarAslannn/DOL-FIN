import { Children, type ReactNode } from "react"
import { motion, type Variants } from "framer-motion"

interface Props {
  children: ReactNode
  className?: string
}

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
}

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    filter: "blur(12px)",
    y: 16,
  },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: {
      type: "spring",
      bounce: 0.3,
      duration: 1.5,
    },
  },
}

// Slow-motion reveal: children fade/blur/rise in on mount, staggered one
// after another instead of popping in all at once.
const AnimatedGroup = ({ children, className }: Props) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={className}
    >
      {Children.map(children, (child) => (
        <motion.div variants={itemVariants}>{child}</motion.div>
      ))}
    </motion.div>
  )
}

export default AnimatedGroup
