import { Link } from "react-router-dom"

type Props = {
  ticker: string
}

const CompFinderItem = ({ ticker }: Props) => {
  return (
    <Link
      reloadDocument
      to={`/company/${ticker}/company-profile`}
      className="px-4 py-1.5 text-xs font-bold text-mist bg-black/40 border border-white/10 rounded-lg transition-all duration-150 hover:bg-pulse/10 hover:text-pulse hover:border-pulse/40 hover:shadow-[0_0_14px_rgba(255,87,26,0.2)] font-mono tracking-wider flex items-center justify-center min-w-[65px] cursor-pointer"
    >
      {ticker}
    </Link>
  )
}

export default CompFinderItem
