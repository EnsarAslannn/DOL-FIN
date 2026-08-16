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
 * Top clearance for the fixed nav pill: `top-4` (16px) + `h-14` (56px) = 72px
 * of occupied space, rounded up to 112px so content never crowds the capsule.
 */
export const navClearanceClass = "pt-28"
