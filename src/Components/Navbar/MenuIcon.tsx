interface Props {
  open: boolean
  className?: string
}

/**
 * The menu trigger glyph.
 *
 * Two bars that rotate into a cross rather than a swap between a hamburger
 * and an X — the transform makes the open and closed states read as the same
 * control in two positions, which is what the sheet itself is doing.
 *
 * Drawn on the same 16px grid and 1.5px stroke as the rest of the icon set,
 * and inherits `currentColor` so it re-tones with the bar.
 */
const MenuIcon = ({ open, className = "h-5 w-5" }: Props) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    className={`shrink-0 ${className}`}
  >
    <path
      d="M2.5 6h11"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      className={`origin-center transition-transform duration-200 ease-out motion-reduce:transition-none ${
        open ? "translate-y-[2px] rotate-45" : ""
      }`}
    />
    <path
      d="M2.5 10h11"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      className={`origin-center transition-transform duration-200 ease-out motion-reduce:transition-none ${
        open ? "-translate-y-[2px] -rotate-45" : ""
      }`}
    />
  </svg>
)

export default MenuIcon
