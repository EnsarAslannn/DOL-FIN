import { Link } from "react-router-dom"
import logo from "../../assets/dolphin.png"
import { useAuth } from "../../Context/useAuth"

const Navbar = () => {
  const { user, logout } = useAuth()

  return (
    <nav className="w-full bg-abyss border-b border-ridge/40 px-6 py-4 flex items-center justify-center font-sans relative z-50">
      <div className="w-full max-w-6xl flex items-center justify-between">

        <div className="flex items-center space-x-10">
          <Link to="/" className="flex items-center space-x-3 group">
            <img src={logo} alt="DOLFIN Logo" className="h-9 object-contain" />
            <span className="text-2xl font-bold tracking-wider text-pulse font-display uppercase select-none group-hover:text-foam transition-colors">
              DOL-FIN
            </span>
          </Link>

          <div className="flex items-center space-x-8">
            <Link
              to="/search"
              className="text-base font-semibold text-mist hover:text-pulse transition-colors"
            >
              Search
            </Link>

            {user && (
              <Link
                to="/wallet"
                className="text-base font-semibold text-mist hover:text-pulse transition-colors"
              >
                Wallet
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-8">
          <span className="text-sm font-semibold text-mist tracking-wide">
            Welcome,{" "}
            <span className="text-foam capitalize font-bold">
              {user ? user.userName : "Guest"}
            </span>
          </span>

          {user ? (
            <button
              onClick={logout}
              className="py-2.5 px-6 text-sm font-bold text-foam bg-loss hover:bg-loss/85 rounded-xl shadow-md shadow-loss/10 transition-all duration-200 cursor-pointer"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="py-2.5 px-6 text-sm font-bold text-abyss bg-pulse hover:bg-pulse/85 rounded-xl shadow-md shadow-pulse/10 transition-all duration-200 text-center cursor-pointer"
            >
              Login
            </Link>
          )}
        </div>

      </div>
    </nav>
  )
}

export default Navbar