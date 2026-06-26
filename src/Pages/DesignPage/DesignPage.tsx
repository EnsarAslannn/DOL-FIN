import Table from "../../Components/Table/Table"
import { mockProfileData } from "../../Components/Table/TestData"

const testTableConfig = [
  {
    label: "Company Name",
    render: (company: any) => company.companyName,
  },
  {
    label: "Ticker",
    render: (company: any) => company.symbol,
  },
  {
    label: "Price",
    render: (company: any) => `$${company.price}`,
  },
  {
    label: "Sector",
    render: (company: any) => company.sector,
  },
  {
    label: "Industry",
    render: (company: any) => company.industry,
  },
]

const DesignPage = () => {
  const tableDataArray = Object.values(mockProfileData)

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold">FinShark Design Page</h1>
      <h2 className="text-gray-600">
        This is FinShark's design page. This is where we will house various
        design aspects of the app.
      </h2>

      <Table config={testTableConfig} data={tableDataArray} />
    </div>
  )
}

export default DesignPage
