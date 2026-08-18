/**
 * A full-bleed section band.
 *
 * The home page is built from alternating colour bands that run the entire
 * viewport width with no gutter and no radius, so each background meets the
 * next on a hard horizontal line. Put the band colour on this element.
 *
 * `w-full` rather than `w-screen`: `100vw` includes the scrollbar's width on
 * desktop, which pushes the page 15px wider than its own viewport and gives
 * every band a horizontal scroll.
 */
export const bandClass = "w-full"

/**
 * The content column inside a band.
 *
 * Backgrounds go edge-to-edge; text does not. This keeps copy on a measured
 * grid roughly 8% in from each edge — matching the reference — so headings
 * across different bands still align to the same two vertical rules and no
 * line ever runs the full width of a 27-inch display.
 *
 * Pair it with `bandClass`: the band carries the colour, this carries the
 * grid.
 */
export const contentClass =
  "mx-auto w-full max-w-wide px-6 sm:px-10 lg:px-16 xl:px-20"

/**
 * The dashboard's content column.
 *
 * Wider than `contentClass` and padded tighter, because the authenticated
 * pages are a terminal rather than an article: search results, a holdings
 * grid and the live market rail are meant to be read side by side, and the
 * reading column that suits the landing page squeezed all three into the
 * middle third of the screen.
 *
 * Still bounded rather than full-bleed — past ~1760px the holdings grid grows
 * a fifth column of cards that nobody scans, and the market rail drifts so
 * far from the results it stops reading as related.
 */
export const terminalClass =
  "mx-auto w-full max-w-terminal px-4 sm:px-6 lg:px-10 xl:px-12"
