import type { Variants } from "framer-motion"

/**
 * The page's one scroll-reveal recipe.
 *
 * Every band on the home page enters the same way — a short fade with a small
 * upward drift — so the scroll reads as one continuous surface rather than a
 * stack of separately animated widgets. Sections that reveal a set of peers
 * (cards, list rows) stagger their children off `revealGroup`.
 *
 * Deliberately small numbers: 20px of travel over 500ms with an ease-out
 * curve. Anything longer starts to feel like the page is loading rather than
 * responding, and anything further reads as a slide instead of a fade.
 *
 * Motion is opt-out, not opt-in: pass `useReducedMotion()` into
 * `revealProps` and the whole system collapses to a static render.
 */

const EASE_OUT = [0.22, 0.61, 0.36, 1] as const

export const reveal: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE_OUT },
  },
}

/**
 * Container for a set of peers. 70ms per child sits inside the 30–50ms
 * guidance for long lists while staying legible for the 3–4 item groups this
 * page actually uses.
 */
export const revealGroup: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
}

/**
 * Images enter on the same curve but travel further and settle out of a
 * slight scale, so a photograph reads as arriving rather than blinking on.
 * The scale starts at 1.04 and not lower — past about 1.06 the edges visibly
 * crop during the tween, which draws attention to the animation itself.
 */
export const revealImage: Variants = {
  hidden: { opacity: 0, y: 28, scale: 1.04 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: EASE_OUT },
  },
}

/**
 * Standard viewport trigger. `once` stops the reveal re-firing when the user
 * scrolls back up, and the -80px margin delays it until the band is properly
 * on screen rather than clipping the bottom edge.
 */
export const viewportOnce = { once: true, margin: "-80px" } as const

/**
 * Spreads the whole recipe onto a `motion` element. When the user has asked
 * for reduced motion the element renders in its final state with no variants
 * attached at all, so nothing animates and nothing is left invisible.
 */
export const revealProps = (reduced: boolean) =>
  reduced
    ? {}
    : {
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport: viewportOnce,
      }
