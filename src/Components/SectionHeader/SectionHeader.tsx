import { motion } from "framer-motion"
import { reveal } from "../../Helpers/motion"

interface Props {
  /** Mono uppercase kicker. Names the section's role, not its content. */
  eyebrow: string
  title: string
  /** Optional lead paragraph. Kept short — one line at desktop measure. */
  lead?: string
  /**
   * Centred headers open the sections that present a set of peers (the three
   * How-It-Works cards, the FAQ list), where there is no single element for
   * a left edge to align to. Every other section stays left-aligned on the
   * page grid.
   */
  align?: "left" | "center"
  /**
   * Which band the header sits on. `dark` is Ivory on Onyx; `light` inverts
   * to Onyx ink on Cream. The two are the same header, not two components —
   * only the foreground ladder swaps.
   */
  tone?: "dark" | "light"
  className?: string
}

/**
 * The page's one section-opening device.
 *
 * Section headings run 45–56px at weight 500 with a generous bottom margin.
 * The eyebrow above it is what turns a heading into a section: without it
 * every band opened at the same visual weight and the page read as one long
 * undifferentiated column.
 *
 * Eyebrow, heading and lead each carry their own reveal variant, so they
 * enter in sequence off the parent's stagger rather than as one block.
 * The measure is capped at 680px so headings break into two lines at display
 * size rather than running the full column.
 */
const SectionHeader = ({
  eyebrow,
  title,
  lead,
  align = "left",
  tone = "dark",
  className = "",
}: Props) => {
  const centered = align === "center"
  const isLight = tone === "light"

  return (
    <div
      className={`max-w-[680px] ${centered ? "mx-auto text-center" : ""} ${className}`}
    >
      <motion.span
        variants={reveal}
        className={`block font-mono text-caption font-normal uppercase tracking-label-lg ${
          isLight ? "text-ink-muted" : "text-ash-text/70"
        }`}
      >
        {eyebrow}
      </motion.span>
      <motion.h2
        variants={reveal}
        className={`mt-5 text-heading md:text-heading-lg lg:text-display-sm font-medium ${
          isLight ? "text-onyx-canvas" : "text-ivory-text"
        }`}
      >
        {title}
      </motion.h2>
      {lead && (
        <motion.p
          variants={reveal}
          className={`mt-6 max-w-[520px] text-body-lg font-normal ${
            centered ? "mx-auto" : ""
          } ${isLight ? "text-ink-muted" : "text-ash-text"}`}
        >
          {lead}
        </motion.p>
      )}
    </div>
  )
}

export default SectionHeader
