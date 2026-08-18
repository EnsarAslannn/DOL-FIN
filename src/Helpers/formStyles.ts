/**
 * Shared form field treatment. Obsidian fill, a Slate hairline, and a Cobalt
 * focus ring — the focus indicator is never removed, only restyled.
 *
 * The fill sits one step above the card it lands on rather than below it: on
 * a dark canvas an inset field reads as disabled, so the input is the
 * brighter surface and the border does the containing.
 *
 * Used by LoginPage, RegisterPage, Search, WalletPage and the comment form
 * so the four copies of this recipe stay in sync.
 */
export const fieldClass =
  "block w-full rounded-card border border-band-line/30 bg-band-raised px-4 py-3 text-body font-normal text-band-ink outline-none transition-colors duration-200 placeholder:text-band-subtle focus:border-cobalt focus:ring-2 focus:ring-cobalt/35"

/** Field label: mono micro-copy, the system's "technical label" role. */
export const labelClass =
  "mb-2 block font-mono text-caption font-normal uppercase tracking-label text-band-muted"

/**
 * Inline validation message, shown directly beneath its field. Kept at body
 * size rather than the 11px caption role — an error is content the user has
 * to read, not metadata.
 */
export const errorClass = "mt-2 text-body font-normal text-band-loss"

/**
 * Primary pill CTA — Cobalt fill, Pure White text at 15–17px, 9999px radius,
 * 15px vertical × 24–32px horizontal padding, -0.009em tracking, no shadow.
 *
 * The label is Pure White rather than Ivory: Ivory on Cobalt is 4.04:1 and
 * misses AA, where white holds 4.71:1. This is the one place in the system
 * that #ffffff is correct.
 *
 * Hover brightens the fill instead of fading it — a translucent button on a
 * dark canvas loses its edge and reads as disabled.
 *
 * Ten call sites hand-rolled this with four different padding recipes before
 * it was centralised here. Compose from these three parts rather than
 * respelling them.
 */
export const ctaBaseClass =
  "rounded-pill font-bold tracking-cta transition-[filter,background-color,color,border-color] duration-200"

/** The Cobalt fill itself. Reserved for primary actions and nothing else. */
export const ctaFillClass =
  "cursor-pointer bg-cobalt text-pure-white hover:brightness-110"

/**
 * Secondary CTA: an Obsidian fill with a Mist hairline. Sits beside the
 * primary without competing — the brief's "subtle interactive surface".
 */
export const ctaGhostClass =
  "cursor-pointer border border-band-line/25 bg-band-raised/80 text-band-ink backdrop-blur-sm hover:border-band-line/50 hover:bg-band-raised"

/** Disabled CTA drops to the muted surface — never a faded Cobalt. */
export const ctaDisabledClass =
  "cursor-not-allowed border border-band-line/30 bg-band-raised text-band-subtle"

/** Full-size CTA: 17px text at the spec's 15×32px padding. */
export const ctaClass = `${ctaBaseClass} ${ctaFillClass} px-8 py-cta text-body-lg`

/** Full-size secondary CTA, matched to `ctaClass` in metrics. */
export const ctaGhostFullClass = `${ctaBaseClass} ${ctaGhostClass} px-8 py-cta text-body-lg`

/**
 * Compact CTA: 15px text at 8×24px. For the nav pill and inline row actions,
 * where the full 15px vertical padding would overwhelm its container. 8px is
 * measured, not eyeballed: it leaves 8.75px of clearance inside the 56px nav
 * pill, where 12px left only 4.75px and read as cramped.
 */
export const ctaCompactClass = `${ctaBaseClass} ${ctaFillClass} px-6 py-2 text-body`

/** Full-bleed form submit. */
export const primaryButtonClass = `w-full text-center ${ctaClass}`
