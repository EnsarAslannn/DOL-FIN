import { Link, useLocation } from "react-router-dom"
import logo from "../../assets/dolphin-ember.png"
import { useAuth } from "../../Context/useAuth"
import { containerClass } from "../../Helpers/layout"

const Navbar = () => {
  const { user, logout } = useAuth()
  const location = useLocation()

  // Ghost text links: no background, no border. Underline on hover only,
  // and persistently on the active route.
  const navLinkClass = (path: string) =>
    `text-[13px] font-normal tracking-[-0.009em] underline-offset-[6px] transition-colors duration-200 ${
      location.pathname.startsWith(path)
        ? "text-paper-white underline"
        : "text-paper-white/60 hover:text-paper-white hover:underline"
    }`

  return (
    <nav className="fixed inset-x-0 top-4 z-50 font-sans">
      {/* Shares the page grid, so the pill's edges sit exactly above the
          content column beneath it rather than 24px outside it. */}
      <div className={containerClass}>
        <div className="flex h-14 items-center justify-between gap-6 rounded-nav bg-carbon-black px-[19px]">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex shrink-0 items-center gap-2.5">
              <img
                src={logo}
                alt="DOL-FIN Logo"
                className="h-7 object-contain"
              />
              <span className="select-none text-body-lg font-bold uppercase tracking-[-0.02em] text-paper-white">
                DOL<span className="text-sunrise-coral">-</span>FIN
              </span>
            </Link>

            <div className="hidden items-center gap-6 md:flex">
              <Link to="/search" className={navLinkClass("/search")}>
                Search
              </Link>
              {user && (
                <Link to="/wallet" className={navLinkClass("/wallet")}>
                  Wallet
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="hidden items-baseline gap-2 rounded-pill bg-paper-white/10 px-3 py-1.5 sm:flex">
                  <span className="text-caption font-normal uppercase tracking-[0.1em] text-paper-white/60">
                    {user.userName}
                  </span>
                  <span className="font-mono text-caption font-normal text-paper-white">
                    ${user.walletBalance?.toFixed(2) ?? "0.00"}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="cursor-pointer text-[13px] font-normal tracking-[-0.009em] text-paper-white/60 underline-offset-[6px] transition-colors duration-200 hover:text-paper-white hover:underline"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <span className="hidden text-[13px] font-normal text-paper-white/60 sm:inline">
                  Welcome, <span className="text-paper-white">Guest</span>
                </span>
                <Link
                  to="/login"
                  className="rounded-pill bg-sunrise-coral px-6 py-2.5 text-center text-[13px] font-bold tracking-[-0.009em] text-paper-white transition-opacity duration-200 hover:opacity-90"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
