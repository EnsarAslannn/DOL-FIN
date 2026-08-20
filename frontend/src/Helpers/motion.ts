import type { Variants } from "framer-motion"


const EASE_OUT = [0.22, 0.61, 0.36, 1] as const

export const reveal: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE_OUT },
  },
}

export const revealGroup: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
}

export const revealImage: Variants = {
  hidden: { opacity: 0, y: 28, scale: 1.04 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: EASE_OUT },
  },
}

export const viewportOnce = { once: true, margin: "-80px" } as const

export const revealProps = (reduced: boolean) =>
  reduced
    ? {}
    : {
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport: viewportOnce,
      }
