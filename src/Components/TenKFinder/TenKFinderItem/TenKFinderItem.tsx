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
      className="px-3.5 py-1.5 text-xs font-bold text-sky-400 bg-[#0b0f19]/80 border border-sky-500/30 rounded-lg shadow-sm transition-all duration-150 hover:bg-sky-500/10 hover:border-sky-400 hover:shadow-[0_0_10px_rgba(56,189,248,0.2)] font-mono flex items-center gap-1.5 cursor-pointer"
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
