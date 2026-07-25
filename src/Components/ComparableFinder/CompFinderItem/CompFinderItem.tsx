import { Link } from "react-router-dom"

type Props = {
  ticker: string
}

const CompFinderItem = ({ ticker }: Props) => {
  return (
    <Link
      reloadDocument
      to={`/company/${ticker}/company-profile`}
      className="px-4 py-1.5 text-xs font-bold text-mist bg-abyss/80 border border-ridge/50 rounded-lg transition-all duration-150 hover:bg-pulse/10 hover:text-pulse hover:border-pulse/40 hover:shadow-[0_0_10px_rgba(69,232,214,0.15)] font-mono tracking-wider flex items-center justify-center min-w-[65px] cursor-pointer"
    >
      {ticker}
    </Link>
  )
}

export default CompFinderItem
