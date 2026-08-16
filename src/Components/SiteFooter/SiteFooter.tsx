import { Link } from "react-router-dom"
import logo from "../../assets/dolphin-ember.png"
import { containerClass } from "../../Helpers/layout"

const columns = [
  {
    heading: "Platform",
    links: [
      { to: "/search", label: "Search" },
      { to: "/wallet", label: "Wallet" },
    ],
  },
  {
    heading: "Account",
    links: [
      { to: "/login", label: "Log in" },
      { to: "/register", label: "Create account" },
    ],
  },
]

/**
 * Site footer on the muted surface.
 *
 * Replaces a single centred line of micro-copy, which was the least
 * considered element on the page. Structured as a brand column plus two link
 * columns, closed by a hairline and the legal row.
 */
const SiteFooter = () => (
  <footer className="w-full border-t border-mist-gray bg-fog-gray font-sans">
    <div className={`py-section ${containerClass}`}>
      <div className="grid grid-cols-1 gap-x-16 gap-y-14 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <Link to="/" className="flex shrink-0 items-center gap-3">
            <img src={logo} alt="DOL-FIN Logo" className="h-7 object-contain" />
            <span className="select-none text-body-lg font-bold uppercase tracking-wordmark text-carbon-black">
              DOL<span className="text-sunrise-coral">-</span>FIN
            </span>
          </Link>
          <p className="mt-6 max-w-[300px] text-body font-normal text-zinc-gray">
            Find the signal beneath the noise. Fundamentals, filings and
            portfolio tracking in one sandboxed terminal.
          </p>
        </div>

        {columns.map((col) => (
          <nav key={col.heading} aria-label={col.heading}>
            <h2 className="font-mono text-caption font-normal uppercase tracking-label-lg text-ash-gray">
              {col.heading}
            </h2>
            <ul className="mt-6 flex flex-col gap-4">
              {col.links.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-body font-normal text-zinc-gray underline-offset-4 transition-colors duration-200 hover:text-carbon-black hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="mt-20 flex flex-col gap-3 border-t border-mist-gray pt-8 sm:flex-row sm:items-center sm:justify-between">
        <span className="font-mono text-caption font-normal uppercase tracking-label text-ash-gray">
          © 2026 DOL-FIN
        </span>
        <span className="font-mono text-caption font-normal uppercase tracking-label text-ash-gray">
          Simulated data · run in a secure sandbox
        </span>
      </div>
    </div>
  </footer>
)

export default SiteFooter
