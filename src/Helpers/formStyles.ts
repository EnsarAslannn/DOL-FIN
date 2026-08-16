/**
 * Shared form field treatment. Flat white surface, hairline Mist Gray
 * outline, and a coral focus ring — the focus indicator is never removed,
 * only restyled.
 *
 * Used by LoginPage, RegisterPage, Search, WalletPage and the comment form
 * so the four copies of this recipe stay in sync.
 */
export const fieldClass =
  "block w-full rounded-card border border-mist-gray bg-paper-white px-4 py-3 text-body font-normal text-carbon-black outline-none transition-colors duration-200 placeholder:text-ash-gray focus:border-sunrise-coral focus:ring-2 focus:ring-sunrise-coral/25"

/** Field label: mono micro-copy, the system's "technical label" role. */
export const labelClass =
  "mb-2 block font-mono text-caption font-normal uppercase tracking-label text-zinc-gray"

/**
 * Inline validation message, shown directly beneath its field. Kept at body
 * size rather than the 11px caption role — an error is content the user has
 * to read, not metadata.
 */
export const errorClass = "mt-2 text-body font-normal text-loss"

/**
 * Primary pill CTA — DESIGN.md:104: Sunrise Coral fill, white 700 text at
 * 15–17px, 9999px radius, 15px vertical × 24–32px horizontal padding,
 * -0.009em tracking, no drop shadow.
 *
 * Ten call sites hand-rolled this with four different padding recipes before
 * it was centralised here. Compose from these three parts rather than
 * respelling them.
 */
export const ctaBaseClass =
  "rounded-pill font-bold tracking-cta transition-opacity duration-200"

/** The coral fill itself. Reserved for primary actions and nothing else. */
export const ctaFillClass =
  "cursor-pointer bg-sunrise-coral text-paper-white hover:opacity-90"

/** Disabled CTA drops to the muted surface — never a faded coral. */
export const ctaDisabledClass =
  "cursor-not-allowed border border-mist-gray bg-fog-gray text-ash-gray"

/** Full-size CTA: 17px text at the spec's 15×32px padding. */
export const ctaClass = `${ctaBaseClass} ${ctaFillClass} px-8 py-cta text-body-lg`

/**
 * Compact CTA: 15px text at 8×24px. For the nav pill and inline row actions,
 * where the full 15px vertical padding would overwhelm its container. 8px is
 * measured, not eyeballed: it leaves 8.75px of clearance inside the 56px nav
 * pill, where 12px left only 4.75px and read as cramped.
 */
export const ctaCompactClass = `${ctaBaseClass} ${ctaFillClass} px-6 py-2 text-body`

/** Full-bleed form submit. */
export const primaryButtonClass = `w-full text-center ${ctaClass}`
