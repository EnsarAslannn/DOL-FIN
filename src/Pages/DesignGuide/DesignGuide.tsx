import Table from "../../Components/Table/Table"
import RatioList from "../../Components/RatioList/RatioList"
import { testIncomeStatementData } from "../../Components/Table/TestData"

const tableConfig = [
  {
    label: "Market Cap",
    render: (company: any) => company.marketCapTTM,
    subTitle: "Total value of all a company's shares of stock",
  },
]

const DesignGuide = () => {
  return (
    <div className="w-full min-h-screen bg-abyss text-foam font-sans p-8 space-y-6 text-left">
      <h1 className="text-xl font-bold font-display">
        Design guide — reusable components of DOL-FIN with brief instructions
        on how to use them.
      </h1>
      <RatioList data={testIncomeStatementData} config={tableConfig} />
      <Table data={testIncomeStatementData} config={tableConfig} />
      <h3 className="text-sm text-mist">
        Table — Table takes in a configuration object and company data as
        params. Use the config to style your table.
      </h3>
    </div>
  )
}

export default DesignGuide
