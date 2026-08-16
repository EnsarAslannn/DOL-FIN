import { Link, useLocation } from "react-router-dom"
import {
  FaBuilding,
  FaTable,
  FaBalanceScale,
  FaMoneyBillWave,
} from "react-icons/fa"

const links = [
  { to: "company-profile", label: "Company Profile", Icon: FaBuilding },
  { to: "income-statement", label: "Income Statement", Icon: FaTable },
  { to: "balance-sheet", label: "Balance Sheet", Icon: FaBalanceScale },
  { to: "cashflow-statement", label: "Cashflow Statement", Icon: FaMoneyBillWave },
]

const Sidebar = () => {
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname.includes(path)
  }

  return (
    // w-64 is mirrored by CompanyDashboard's md:ml-64 — change both together.
    <nav className="absolute bottom-0 left-0 top-0 z-[9999] block w-64 -translate-x-full flex-row flex-nowrap border-r border-mist-gray bg-paper-white px-4 pb-8 pt-28 text-left transition-all duration-300 ease-in-out md:z-10 md:translate-x-0">
      <div className="mx-auto flex w-full min-h-full flex-col flex-nowrap items-center justify-start overflow-y-auto overflow-x-hidden px-0">
        <div className="relative z-40 mt-4 flex h-auto w-full flex-1 flex-col items-stretch">
          <span className="mb-2 border-b border-mist-gray px-4 pb-3 font-mono text-caption font-normal uppercase tracking-[0.16em] text-zinc-gray">
            Instrument Panel
          </span>
          <div className="flex list-none flex-col space-y-1 md:min-w-full md:flex-col">
            {links.map(({ to, label, Icon }) => (
              <Link
                key={to}
                to={to}
                className={`group relative flex items-center rounded-card py-3 text-body font-normal tracking-[-0.005em] no-underline transition-colors duration-200 ${
                  isActive(to)
                    ? "border-l-[3px] border-sunrise-coral bg-fog-gray pl-[13px] pr-4 text-carbon-black"
                    : "px-4 text-zinc-gray hover:bg-fog-gray hover:text-carbon-black"
                }`}
              >
                <Icon
                  size={16}
                  className={`shrink-0 ${isActive(to) ? "text-sunrise-coral" : "text-ash-gray"}`}
                />
                <span className="ml-3 font-sans">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Sidebar
