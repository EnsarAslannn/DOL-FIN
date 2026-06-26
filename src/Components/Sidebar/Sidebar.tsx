import { Link, useLocation } from "react-router-dom"
import {
  FaBuilding,
  FaTable,
  FaBalanceScale,
  FaMoneyBillWave,
} from "react-icons/fa"


const Sidebar = () => {
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname.includes(path)
  }

  return (
    <nav className="block py-8 px-4 top-0 bottom-0 w-64 bg-[#141a26] border-r border-gray-800/80 left-0 absolute flex-row flex-nowrap md:z-10 z-9999 transition-all duration-300 ease-in-out transform md:translate-x-0 -translate-x-full text-left">
      <button className="md:hidden flex items-center justify-center cursor-pointer text-gray-400 w-6 h-10 bg-[#141a26] rounded-r border border-gray-800 absolute top-1/2 -right-6 focus:outline-none z-9998">
        <i className="fas fa-ellipsis-v"></i>
      </button>

      <div className="flex-col min-h-full px-0 flex flex-nowrap items-center justify-start w-full mx-auto overflow-y-auto overflow-x-hidden">
        <div className="flex flex-col items-stretch opacity-100 relative mt-4 h-auto z-40 flex-1 w-full">
          <div className="md:flex-col md:min-w-full flex flex-col list-none space-y-2">
            <Link
              to="company-profile"
              className={`flex items-center text-sm font-bold py-3.5 px-4 no-underline rounded-xl transition-all duration-200 tracking-wide relative group ${isActive("company-profile")
                  ? "bg-emerald-500/10 text-emerald-400 border-l-4 border-emerald-500 pl-3"
                  : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/30"
                }`}
            >
              <FaBuilding size={18} className="shrink-0" />
              <span className="ml-3 font-sans">Company Profile</span>
            </Link>

            <Link
              to="income-statement"
              className={`flex items-center text-sm font-bold py-3.5 px-4 no-underline rounded-xl transition-all duration-200 tracking-wide relative group ${isActive("income-statement")
                  ? "bg-emerald-500/10 text-emerald-400 border-l-4 border-emerald-500 pl-3"
                  : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/30"
                }`}
            >
              <FaTable size={18} className="shrink-0" />
              <span className="ml-3 font-sans">Income Statement</span>
            </Link>

            <Link
              to="balance-sheet"
              className={`flex items-center text-sm font-bold py-3.5 px-4 no-underline rounded-xl transition-all duration-200 tracking-wide relative group ${isActive("balance-sheet")
                  ? "bg-emerald-500/10 text-emerald-400 border-l-4 border-emerald-500 pl-3"
                  : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/30"
                }`}
            >
              <FaBalanceScale size={18} className="shrink-0" />
              <span className="ml-3 font-sans">Balance Sheet</span>
            </Link>

            <Link
              to="cashflow-statement"
              className={`flex items-center text-sm font-bold py-3.5 px-4 no-underline rounded-xl transition-all duration-200 tracking-wide relative group ${isActive("cashflow-statement")
                  ? "bg-emerald-500/10 text-emerald-400 border-l-4 border-emerald-500 pl-3"
                  : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/30"
                }`}
            >
              <FaMoneyBillWave size={18} className="shrink-0" />
              <span className="ml-3 font-sans">Cashflow Statement</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Sidebar
