interface Props {
  open: boolean
  className?: string
}

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
