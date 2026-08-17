import { Link } from "react-router-dom"

type Props = {
  ticker: string
}

const CompFinderItem = ({ ticker }: Props) => {
  return (
    <Link
      reloadDocument
      to={`/company/${ticker}/company-profile`}
      className="flex min-w-[65px] cursor-pointer items-center justify-center rounded-pill ring-1 ring-inset ring-mist-border/8 bg-graphite-card px-4 py-2 font-mono text-caption font-normal tracking-wider text-ash-text transition-colors duration-150 hover:ring-mist-border/20 hover:text-ivory-text"
    >
      {ticker}
    </Link>
  )
}

export default CompFinderItem
