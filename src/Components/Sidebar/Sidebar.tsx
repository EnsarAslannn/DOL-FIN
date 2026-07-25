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
    <nav className="block py-8 px-4 top-0 bottom-0 w-64 bg-depth border-r border-ridge/50 left-0 absolute flex-row flex-nowrap md:z-10 z-9999 transition-all duration-300 ease-in-out transform md:translate-x-0 -translate-x-full text-left">
      <button className="md:hidden flex items-center justify-center cursor-pointer text-mist w-6 h-10 bg-depth rounded-r border border-ridge/60 absolute top-1/2 -right-6 focus:outline-none z-9998">
        <i className="fas fa-ellipsis-v"></i>
      </button>

      <div className="flex-col min-h-full px-0 flex flex-nowrap items-center justify-start w-full mx-auto overflow-y-auto overflow-x-hidden">
        <div className="flex flex-col items-stretch opacity-100 relative mt-4 h-auto z-40 flex-1 w-full">
          <span className="px-4 pb-3 mb-2 text-[10px] font-bold text-mist/70 uppercase tracking-widest border-b border-ridge/40 font-mono">
            Instrument Panel
          </span>
          <div className="md:flex-col md:min-w-full flex flex-col list-none space-y-2">
            <Link
              to="company-profile"
              className={`flex items-center text-sm font-semibold py-3.5 px-4 no-underline rounded-xl transition-all duration-200 tracking-wide relative group ${isActive("company-profile")
                  ? "bg-pulse/10 text-pulse border-l-4 border-pulse pl-3"
                  : "text-mist hover:text-foam hover:bg-depth-2/60"
                }`}
            >
              <FaBuilding size={18} className="shrink-0" />
              <span className="ml-3 font-sans">Company Profile</span>
            </Link>

            <Link
              to="income-statement"
              className={`flex items-center text-sm font-semibold py-3.5 px-4 no-underline rounded-xl transition-all duration-200 tracking-wide relative group ${isActive("income-statement")
                  ? "bg-pulse/10 text-pulse border-l-4 border-pulse pl-3"
                  : "text-mist hover:text-foam hover:bg-depth-2/60"
                }`}
            >
              <FaTable size={18} className="shrink-0" />
              <span className="ml-3 font-sans">Income Statement</span>
            </Link>

            <Link
              to="balance-sheet"
              className={`flex items-center text-sm font-semibold py-3.5 px-4 no-underline rounded-xl transition-all duration-200 tracking-wide relative group ${isActive("balance-sheet")
                  ? "bg-pulse/10 text-pulse border-l-4 border-pulse pl-3"
                  : "text-mist hover:text-foam hover:bg-depth-2/60"
                }`}
            >
              <FaBalanceScale size={18} className="shrink-0" />
              <span className="ml-3 font-sans">Balance Sheet</span>
            </Link>

            <Link
              to="cashflow-statement"
              className={`flex items-center text-sm font-semibold py-3.5 px-4 no-underline rounded-xl transition-all duration-200 tracking-wide relative group ${isActive("cashflow-statement")
                  ? "bg-pulse/10 text-pulse border-l-4 border-pulse pl-3"
                  : "text-mist hover:text-foam hover:bg-depth-2/60"
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
