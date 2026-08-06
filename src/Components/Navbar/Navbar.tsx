import { Link, useLocation } from "react-router-dom"
import logo from "../../assets/dolphin-ember.png"
import { useAuth } from "../../Context/useAuth"

const Navbar = () => {
  const { user, logout } = useAuth()
  const location = useLocation()

  const navLinkClass = (path: string) =>
    `px-4 py-2 rounded-full text-[13px] font-semibold tracking-wide transition-all duration-200 ${
      location.pathname.startsWith(path)
        ? "bg-pulse/12 text-pulse shadow-[inset_0_0_0_1px_rgba(255,87,26,0.22)]"
        : "text-mist hover:text-foam"
    }`

  return (
    <nav className="sticky top-0 w-full z-50 border-b border-white/8 bg-abyss/80 backdrop-blur-xl font-sans">
      <div className="w-full max-w-6xl mx-auto px-6 h-20 flex items-center justify-between gap-6">

        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <span className="relative flex items-center justify-center">
              <span className="absolute inset-0 rounded-full bg-pulse/25 blur-lg group-hover:bg-pulse/40 transition-colors" />
              <img
                src={logo}
                alt="DOL-FIN Logo"
                className="relative h-9 object-contain"
              />
            </span>
            <span className="text-xl font-bold tracking-tight text-foam font-display uppercase select-none">
              DOL<span className="text-pulse">-</span>FIN
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1 bg-depth/40 border border-white/5 rounded-full p-1">
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
              {}
              <div className="hidden sm:flex flex-col items-end leading-tight px-3 py-1.5 rounded-xl bg-depth/50 border border-white/5">
                <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-mist">
                  {user.userName}
                </span>
                <span className="text-xs font-bold text-pulse-dim font-mono">
                  ${user.walletBalance?.toFixed(2) ?? "0.00"}
                </span>
              </div>
              <button
                onClick={logout}
                className="py-2.5 px-5 text-xs font-bold uppercase tracking-wider text-mist hover:text-loss border border-white/8 hover:border-loss/40 hover:bg-loss/8 rounded-xl transition-all duration-200 cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <span className="hidden sm:inline text-xs font-medium text-mist tracking-wide">
                Welcome, <span className="text-foam font-semibold">Guest</span>
              </span>
              <Link
                to="/login"
                className="glow-action py-2.5 px-6 text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-pulse to-[#ff8a3d] rounded-xl transition-all duration-200 text-center cursor-pointer active:scale-95"
              >
                Login
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  )
}

export default Navbar
