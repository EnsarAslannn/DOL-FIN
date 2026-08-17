import { Link } from "react-router-dom"
import logo from "../../assets/dolphin.png"
import { bandClass, contentClass } from "../../Helpers/layout"
import { TONE_ATTR } from "../../Helpers/useSectionTone"

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
  {
    heading: "Company",
    links: [
      { to: "/#how-it-works", label: "How it works" },
      { to: "/#help", label: "Help Center" },
    ],
  },
]

/**
 * Site footer — the page's floor, on weathered Onyx.
 *
 * Footer Navy is a shade deeper than the section bands and drained of their
 * blue, which is what separates it from the two Onyx bands above without
 * reading as a fourth surface level. It follows the cream Help Center, so
 * the boundary above it is already a hard tonal break; the deeper navy is
 * what keeps it from being mistaken for another dark *section*.
 *
 * Structured as a brand column plus three link columns, closed by a Slate
 * hairline over the legal row. The wordmark's separator stays Cobalt, the
 * only place the brand colour appears outside a button or a selected state.
 */
const SiteFooter = () => (
  <footer
    {...{ [TONE_ATTR]: "dark" }}
    className={`bg-footer-navy font-sans ${bandClass}`}
  >
    <div className={`py-section ${contentClass}`}>
      <div className="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-[2fr_1fr_1fr_1fr] md:gap-x-16">
        <div className="col-span-2 md:col-span-1">
          <Link to="/" className="flex shrink-0 items-center gap-3">
            <img
              src={logo}
              alt=""
              aria-hidden="true"
              className="h-7 object-contain"
            />
            <span className="select-none text-body-lg font-bold uppercase tracking-wordmark text-ivory-text">
              DOL<span className="text-cobalt">-</span>FIN
            </span>
          </Link>
          <p className="mt-6 max-w-[300px] text-body font-normal text-ash-text">
            Find the signal beneath the noise. Fundamentals, filings and
            portfolio tracking in one sandboxed terminal.
          </p>
        </div>

        {columns.map((col) => (
          <nav key={col.heading} aria-label={col.heading}>
            <h2 className="font-mono text-caption font-normal uppercase tracking-label-lg text-ash-text/70">
              {col.heading}
            </h2>
            <ul className="mt-6 flex flex-col gap-4">
              {col.links.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-body font-normal text-ash-text underline-offset-4 transition-colors duration-200 hover:text-ivory-text hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="mt-20 flex flex-col gap-3 border-t border-slate-border/30 pt-8 sm:flex-row sm:items-center sm:justify-between">
        <span className="font-mono text-caption font-normal uppercase tracking-label text-ash-text/70">
          © 2026 DOL-FIN
        </span>
        <span className="font-mono text-caption font-normal uppercase tracking-label text-ash-text/70">
          Simulated data · run in a secure sandbox
        </span>
      </div>
    </div>
  </footer>
)

export default SiteFooter
