import type { CompanyTenK } from "../../../company"

type Props = {
  tenK: CompanyTenK
}

const TenKFinderItem = ({ tenK }: Props) => {
  const parsedDate = new Date(tenK.fillingDate)
  const fillingDate = isNaN(parsedDate.getTime())
    ? "N/A"
    : parsedDate.getFullYear()

  return (
    <a
      href={tenK.finalLink}
      target="_blank"
      rel="noopener noreferrer"
      className="flex cursor-pointer items-center gap-2 rounded-pill ring-1 ring-inset ring-band-line/8 bg-band-surface px-4 py-2 font-mono text-caption font-normal text-band-muted transition-colors duration-150 hover:ring-band-line/20 hover:text-band-ink"
    >
      <svg
        className="w-3.5 h-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
        />
      </svg>
      10-K {fillingDate}
    </a>
  )
}

export default TenKFinderItem
