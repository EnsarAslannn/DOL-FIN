import { motion } from "framer-motion"
import emptySearch from "../../assets/extra/empty-search.webp"
import { usePrefersReducedMotion } from "../../Helpers/usePrefersReducedMotion"
import { reveal, revealProps } from "../../Helpers/motion"

interface Props {
  title?: string
  description?: string
}

/**
 * The search results empty state, as a banner card.
 *
 * Replaces the floating 3D object that used to sit centred in the results
 * column. Masking a render into a bare canvas meant fighting the asset's own
 * studio backdrop at every step; a card sidesteps the problem entirely —
 * inside a Graphite surface the art has an edge it is *supposed* to have, and
 * the gradient does the blending that a mask was doing badly.
 *
 * Three layers, back to front:
 *
 *   1. The art, anchored right and contained, so it scales with the card's
 *      height instead of being cropped by its width.
 *   2. A left-to-right gradient from solid Graphite to transparent. This is
 *      what keeps the copy legible over its own flat ground while the render
 *      dissolves into the card rather than ending on a visible edge.
 *   3. The copy, held to a measure so a wide viewport cannot run a line of
 *      text under the artwork.
 *
 * The art is hidden below `sm`. At 390px the card is narrower than the
 * render is wide, so any right-anchored image sits directly behind the
 * heading no matter how hard the gradient works; the card carries its copy
 * alone at that size.
 */
const SearchEmptyState = ({
  title = "Search for a company to begin",
  description = "Look up any listed ticker to read its fundamentals and add it to your portfolio.",
}: Props) => {
  const prefersReducedMotion = usePrefersReducedMotion()

  return (
    <motion.div
      variants={reveal}
      {...revealProps(prefersReducedMotion)}
      className="relative w-full overflow-hidden rounded-card bg-graphite-card ring-1 ring-inset ring-mist-border/6"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-3/5 bg-contain bg-right bg-no-repeat sm:block"
        style={{ backgroundImage: `url(${emptySearch})` }}
      />

      {/* Solid for the first half so the copy never sits on a tint, then a
          long fall to nothing — a short ramp would read as a seam down the
          middle of the card. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-graphite-card from-45% via-graphite-card/80 to-transparent"
      />

      {/* Proportional rather than a fixed measure. A `ch` cap tuned for the
          748px card left the heading wrapping mid-phrase on the 1228px one,
          where there was room to spare; a percentage keeps the copy clear of
          the artwork at every card width instead of at one of them. */}
      <div className="relative max-w-[34ch] px-7 py-12 sm:max-w-[54%] sm:px-10 sm:py-16 lg:max-w-[50%] lg:px-12 lg:py-20">
        <h3 className="text-heading-sm font-medium text-ivory-text">{title}</h3>
        <p className="mt-4 text-body font-normal leading-relaxed text-ash-text">
          {description}
        </p>
      </div>
    </motion.div>
  )
}

export default SearchEmptyState
