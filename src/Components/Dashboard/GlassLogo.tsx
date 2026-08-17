import type { ReactNode } from "react"
import glassPanel from "../../assets/extra/glass-panel.webp"

interface Props {
  /** The company mark. Rendered on top of the panel, never blended with it. */
  children: ReactNode
  /** Tailwind size classes for the tile. Square sizes only. */
  className?: string
  /** Inner padding, so the mark never touches the panel's bevel. */
  padding?: string
}

/**
 * Frosted-glass plinth for a company mark.
 *
 * The source render sits on pure black with its own bloom, so it is composited
 * with `mix-blend-screen` rather than masked: screen leaves black untouched
 * against a dark canvas and lifts only the panel and its glow. That means one
 * asset works unmodified on Onyx, on Graphite and on a table row, with no
 * per-surface cut-out.
 *
 * The panel occupies about 62% of its own frame, so it is scaled 1.6x to reach
 * the tile's edges — cropping the black margin rather than shrinking the glass.
 *
 * The mark itself sits in a sibling layer at normal blend. Screening a logo
 * would blow out its dark areas and tint white ones.
 */
const GlassLogo = ({
  children,
  className = "h-11 w-11",
  padding = "p-2",
}: Props) => (
  <div
    className={`relative grid shrink-0 place-items-center overflow-hidden rounded-icon ${className}`}
  >
    <img
      src={glassPanel}
      alt=""
      aria-hidden="true"
      loading="lazy"
      decoding="async"
      /* Held at 55%. Screened at full strength the panel lifts to a near-white
         chip that outweighs the mark sitting on it — at this level it reads as
         frosted glass and the logo stays the brightest thing in the tile. */
      className="pointer-events-none absolute inset-0 h-full w-full scale-[1.6] object-cover opacity-55 mix-blend-screen"
    />
    {/* A hairline over the composite, so the tile keeps a defined edge on
        surfaces where the panel's own bevel falls below the crop. */}
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 rounded-icon ring-1 ring-inset ring-mist-border/10"
    />
    <div
      className={`relative z-10 grid h-full w-full place-items-center ${padding}`}
    >
      {children}
    </div>
  </div>
)

export default GlassLogo
