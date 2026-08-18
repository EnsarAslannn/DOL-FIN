import type { ReactNode } from "react"
import { terminalClass } from "../../Helpers/layout"
import { TONE_ATTR } from "../../Helpers/useSectionTone"

export type BandTone = "dark" | "cream"

interface Props {
  tone: BandTone
  children: ReactNode
  /** Extra classes on the band itself — vertical rhythm, overflow, id hooks. */
  className?: string
  /** Skip the inner content column for a band that manages its own grid. */
  bare?: boolean
  id?: string
}

/**
 * A full-bleed dashboard band.
 *
 * The authenticated pages now alternate grounds the way the landing page
 * does: the colour runs edge to edge and the content inside it stays on the
 * terminal grid, so a band boundary is a hard horizontal line across the
 * whole viewport rather than the top of a card.
 *
 * It carries two attributes, and they are not the same thing:
 *
 *   `data-band`   sets the foreground roles for everything inside it, which
 *                 is how one table renders Ivory-on-Graphite in a dark band
 *                 and Onyx-on-white in a cream one with no prop threaded
 *                 through it.
 *   `data-nav-tone` is what the navbar reads as it passes overhead. It takes
 *                 "light"/"dark" rather than the band's own name, because it
 *                 is the landing page's existing vocabulary and the bar has
 *                 to flip identically across marketing and product pages.
 *
 * `w-full` and not `w-screen`: `100vw` includes the scrollbar, which pushes
 * every band 15px past the viewport and gives the page a horizontal scroll.
 */
const Band = ({ tone, children, className = "", bare = false, id }: Props) => (
  <section
    id={id}
    data-band={tone}
    {...{ [TONE_ATTR]: tone === "cream" ? "light" : "dark" }}
    /* `text-band-ink` is load-bearing, not decoration. `body` sets Ivory as
       the inherited colour for the whole app, so any text inside a cream band
       that does not name its own colour would render Ivory on Cream — 1.07:1,
       which is to say invisible. Anchoring the inherited colour per band means
       the failure mode of forgetting a text class is "slightly wrong weight"
       rather than "blank section". */
    className={`w-full bg-band-canvas text-band-ink ${className}`}
  >
    {bare ? children : <div className={terminalClass}>{children}</div>}
  </section>
)

export default Band
