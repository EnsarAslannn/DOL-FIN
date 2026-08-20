export const fieldClass =
  "block w-full rounded-card border border-band-line/30 bg-band-raised px-4 py-3 text-body font-normal text-band-ink outline-none transition-colors duration-200 placeholder:text-band-subtle focus:border-cobalt focus:ring-2 focus:ring-cobalt/35"

export const labelClass =
  "mb-2 block font-mono text-caption font-normal uppercase tracking-label text-band-muted"

export const errorClass = "mt-2 text-body font-normal text-band-loss"

export const ctaBaseClass =
  "rounded-pill font-bold tracking-cta transition-[filter,background-color,color,border-color] duration-200"

export const ctaFillClass =
  "cursor-pointer bg-cobalt text-pure-white hover:brightness-110"

export const ctaGhostClass =
  "cursor-pointer border border-band-line/25 bg-band-raised/80 text-band-ink backdrop-blur-sm hover:border-band-line/50 hover:bg-band-raised"

export const ctaDisabledClass =
  "cursor-not-allowed border border-band-line/30 bg-band-raised text-band-subtle"

export const ctaClass = `${ctaBaseClass} ${ctaFillClass} px-8 py-cta text-body-lg`

export const ctaGhostFullClass = `${ctaBaseClass} ${ctaGhostClass} px-8 py-cta text-body-lg`

export const ctaCompactClass = `${ctaBaseClass} ${ctaFillClass} px-6 py-2 text-body`

export const primaryButtonClass = `w-full text-center ${ctaClass}`
