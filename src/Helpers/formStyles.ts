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
  "mb-2 block font-mono text-caption font-normal uppercase tracking-[0.14em] text-zinc-gray"

/**
 * Inline validation message, shown directly beneath its field. Kept at body
 * size rather than the 11px caption role — an error is content the user has
 * to read, not metadata.
 */
export const errorClass = "mt-2 text-body font-normal text-loss"

/** Filled coral pill — the one primary action treatment. */
export const primaryButtonClass =
  "w-full cursor-pointer rounded-pill bg-sunrise-coral px-8 py-[15px] text-center text-body-lg font-bold tracking-[-0.009em] text-paper-white transition-opacity duration-200 hover:opacity-90"
