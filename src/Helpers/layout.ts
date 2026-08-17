/**
 * The app's single horizontal grid.
 *
 * Every band on every page — light content sections, full-bleed dark bands,
 * the footer, and the floating nav pill itself — resolves to this same 1200px
 * column, so headings, cards, images and the pill all land on the same two
 * vertical rules.
 *
 * Nothing should hand-roll `max-w-page` plus its own padding again. That drift
 * is what pushed the nav pill 24px wider than every content block on the home
 * page, and left the search page on a full-bleed grid of its own.
 */
export const containerClass = "mx-auto w-full max-w-page px-6"

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
 * Top clearance for the fixed nav pill: `top-4` (16px) + `h-14` (56px) = 72px
 * of occupied space, rounded up to 112px so content never crowds the capsule.
 */
export const navClearanceClass = "pt-28"
