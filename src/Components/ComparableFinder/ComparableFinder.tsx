import { useState, useEffect } from "react"
import { getCompanyPeers } from "../../api"
import CompFinderItem from "./CompFinderItem/CompFinderItem"
import Spinners from "../Spinners/Spinners"

type Props = {
  ticker: string
}

const ComparableFinder = ({ ticker }: Props) => {
  const [companyPeers, setCompanyPeers] = useState<any>(null)

  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchPeers = async () => {
      setIsLoading(true)

      const result = await getCompanyPeers(ticker)

      if (result && typeof result !== "string" && "data" in result) {
        setCompanyPeers(result?.data)
      }

      setIsLoading(false)
    }

    fetchPeers()
  }, [ticker])

  return (
    <div className="flex flex-wrap gap-2 m-2">
      {isLoading ? (
        <Spinners />
      ) : companyPeers &&
        Array.isArray(companyPeers) &&
        companyPeers.length > 0 ? (
        companyPeers.slice(0, 6).map((peerTicker) => {
          return <CompFinderItem key={peerTicker} ticker={peerTicker} />
        })
      ) : companyPeers &&
        typeof companyPeers === "object" &&
        "peersList" in companyPeers &&
        Array.isArray(companyPeers.peersList) ? (
        (companyPeers.peersList as string[]).slice(0, 6).map((peerTicker) => {
          return <CompFinderItem key={peerTicker} ticker={peerTicker} />
        })
      ) : (
        <span className="text-xs font-semibold text-gray-500 font-mono">
          No peers found
        </span>
      )}
    </div>
  )
}

export default ComparableFinder
