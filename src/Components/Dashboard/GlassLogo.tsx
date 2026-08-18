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
 * The source render sits on pure black with its own bloom, so it is
 * composited with `mix-blend-screen` rather than masked: screen leaves black
 * untouched against a dark canvas and lifts only the panel and its glow. One
 * asset then works unmodified on Onyx, on Graphite and on a table row, with
 * no per-surface cut-out.
 *
 * That trick has exactly one prerequisite — a dark ground. Screen resolves to
 * at least the lighter of its inputs, so on the cream band the same plinth
 * blows out to a white square with the mark stranded in the middle of it.
 *
 * So the blend and the plinth's opacity come from the band rather than from
 * this component: dark bands screen it at 55%, cream bands drop it to zero
 * and the tile falls back to its own surface and hairline, which is what a
 * logo chip should look like on white anyway. The mark itself never blends
 * in either case — screening a logo would blow out its dark areas and tint
 * its white ones.
 */
const GlassLogo = ({
  children,
  className = "h-11 w-11",
  padding = "p-2",
}: Props) => (
  <div
    className={`relative grid shrink-0 place-items-center overflow-hidden rounded-icon bg-band-surface ${className}`}
  >
    <img
      src={glassPanel}
      alt=""
      aria-hidden="true"
      loading="lazy"
      decoding="async"
      /* Held at 55% on dark. Screened at full strength the panel lifts to a
         near-white chip that outweighs the mark sitting on it; at this level
         it reads as frosted glass and the logo stays the brightest thing in
         the tile. */
      className="pointer-events-none absolute inset-0 h-full w-full scale-[1.6] object-cover"
      style={{
        opacity: "var(--band-glass-opacity)",
        mixBlendMode: "var(--band-glass-blend)" as React.CSSProperties["mixBlendMode"],
      }}
    />
    {/* A hairline over the composite, so the tile keeps a defined edge on
        surfaces where the panel's own bevel falls below the crop — and it is
        the only edge the tile has once the plinth is dropped on cream. */}
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 rounded-icon ring-1 ring-inset ring-band-line/10"
    />
    <div
      className={`relative z-10 grid h-full w-full place-items-center ${padding}`}
    >
      {children}
    </div>
  </div>
)

export default GlassLogo
