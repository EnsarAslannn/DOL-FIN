import { Link } from "react-router-dom"

type Props = {
  ticker: string
}

const CompFinderItem = ({ ticker }: Props) => {
  return (
    <Link
      reloadDocument
      to={`/company/${ticker}/company-profile`}
      className="flex min-w-[65px] cursor-pointer items-center justify-center rounded-pill border border-mist-gray bg-paper-white px-4 py-1.5 font-mono text-caption font-normal tracking-wider text-zinc-gray transition-colors duration-150 hover:border-ash-gray hover:text-carbon-black"
    >
      {ticker}
    </Link>
  )
}

export default CompFinderItem
