import { useEffect, useState } from "react"
import type { CompanyTenK } from "../../company"
import { getTenK } from "../../api"
import TenKFinderItem from "./TenKFinderItem/TenKFinderItem"
import Spinners from "../Spinners/Spinners"

type Props = {
  ticker: string
}

const TenKFinder = ({ ticker }: Props) => {
  const [companyData, setCompanyData] = useState<CompanyTenK[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    const getTenKData = async () => {
      setIsLoading(true)
      const value = await getTenK(ticker)
      if (value && typeof value !== "string" && "data" in value) {
        setCompanyData(value?.data)
      }
      setIsLoading(false)
    }
    getTenKData()
  }, [ticker])

  return (
    <div className="flex flex-wrap items-center gap-2 m-2">
      {isLoading ? (
        <Spinners />
      ) : companyData && companyData.length > 0 ? (
        companyData.slice(0, 5).map((tenK, index) => {
          return (
            <TenKFinderItem
              key={`tenk-report-${ticker}-${index}`}
              tenK={tenK}
            />
          )
        })
      ) : (
        <span className="text-xs font-semibold text-gray-500 font-mono">
          No reports found
        </span>
      )}
    </div>
  )
}

export default TenKFinder
