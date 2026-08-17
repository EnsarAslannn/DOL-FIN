/**
 * The home page's icon set.
 *
 * Drawn inline rather than pulled from react-icons so every glyph shares one
 * grid, one 1.5px stroke and `currentColor` — which is what lets the same
 * chevron read correctly on a Cobalt fill, on Graphite and over the hero
 * video without a per-surface override.
 *
 * All are decorative: they sit beside a text label at every call site, so
 * they carry `aria-hidden` and contribute nothing to the accessible name.
 */

interface IconProps {
  className?: string
}

const base = (className: string) => `shrink-0 ${className}`

export const Chevron = ({ className = "h-4 w-4" }: IconProps) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    className={base(className)}
  >
    <path
      d="M6 3.5L10.5 8L6 12.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const Check = ({ className = "h-3 w-3" }: IconProps) => (
  <svg
    viewBox="0 0 12 12"
    fill="none"
    aria-hidden="true"
    className={base(className)}
  >
    <path
      d="M2.5 6.2L4.8 8.5L9.5 3.8"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

/**
 * The FAQ toggle. One glyph for both states: the vertical bar is rotated to
 * horizontal when the row opens, so plus becomes minus in a single 200ms
 * transform rather than a swap between two icons.
 */
export const PlusMinus = ({
  open,
  className = "h-4 w-4",
}: IconProps & { open: boolean }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    className={base(className)}
  >
    <path
      d="M2.5 8h11"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M8 2.5v11"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      className={`origin-center transition-transform duration-200 ease-out ${
        open ? "rotate-90" : "rotate-0"
      }`}
    />
  </svg>
)
