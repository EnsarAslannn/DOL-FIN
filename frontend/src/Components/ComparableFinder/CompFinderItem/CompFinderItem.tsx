import { Link } from "react-router-dom"

type Props = {
  ticker: string
}

const CompFinderItem = ({ ticker }: Props) => {
  return (
    <Link
      reloadDocument
      to={`/company/${ticker}/company-profile`}
      className="flex min-w-[65px] cursor-pointer items-center justify-center rounded-pill ring-1 ring-inset ring-band-line/8 bg-band-surface px-4 py-2 font-mono text-caption font-normal tracking-wider text-band-muted transition-colors duration-150 hover:ring-band-line/20 hover:text-band-ink"
    >
      {ticker}
    </Link>
  )
}

export default CompFinderItem
