
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
