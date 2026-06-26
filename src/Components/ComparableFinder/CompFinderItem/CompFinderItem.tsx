import { Link } from "react-router-dom"

type Props = {
  ticker: string
}

const CompFinderItem = ({ ticker }: Props) => {
  return (
    <Link
      reloadDocument
      to={`/company/${ticker}/company-profile`}
      className="px-4 py-1.5 text-xs font-bold text-gray-400 bg-[#0b0f19]/80 border border-gray-800 rounded-lg transition-all duration-150 hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/40 hover:shadow-[0_0_10px_rgba(16,185,129,0.15)] font-mono tracking-wider flex items-center justify-center min-w-[65px] cursor-pointer"
    >
      {ticker}
    </Link>
  )
}

export default CompFinderItem
