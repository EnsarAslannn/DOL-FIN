import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import logo from "../../assets/dolphin.png"
import { useAuth } from "../../Context/useAuth"
import { contentClass } from "../../Helpers/layout"
import { ctaBaseClass } from "../../Helpers/formStyles"
import { useSectionTone } from "../../Helpers/useSectionTone"

/**
 * Adaptive navigation bar.
 *
 * Full-bleed rather than a contained pill: the bar spans the viewport and
 * only its contents sit on the content grid, so its lower hairline reads as
 * the top edge of whatever band is passing beneath it.
 *
 * It re-tones itself against that band. Sections declare their own ground via
 * `data-nav-tone`, and everything here — link colour, wordmark, hairline,
 * fill and the CTA pill — flips together on that one signal. Over a dark band
 * the CTA is a white pill with dark text; over cream it inverts to an Onyx
 * pill with light text, which is what keeps it the most prominent thing in
 * the bar in both directions.
 *
 * Above the fold the bar stays transparent and lets the hero video through.
 */
const SCROLL_THRESHOLD = 24

/** Sampled inside the bar, so the flip lands as the boundary crosses it. */
const PROBE_Y = 32

const Navbar = () => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)
  const tone = useSectionTone(PROBE_Y)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > SCROLL_THRESHOLD)

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const isLight = tone === "light"

  const shellClass = !isScrolled
    ? "border-transparent bg-transparent"
    : isLight
      ? "border-onyx-canvas/10 bg-cream-canvas/85 backdrop-blur-md"
      : "border-mist-border/10 bg-onyx-canvas/85 backdrop-blur-md"

  const wordmarkClass = isLight ? "text-onyx-canvas" : "text-ivory-text"
  const mutedClass = isLight ? "text-ink-muted" : "text-ash-text"
  const strongClass = isLight ? "text-onyx-canvas" : "text-ivory-text"

  const navLinkClass = (path: string) =>
    `text-label font-normal underline-offset-[6px] transition-colors duration-300 ${
      location.pathname.startsWith(path)
        ? `${strongClass} underline`
        : `${mutedClass} hover:${isLight ? "text-onyx-canvas" : "text-ivory-text"} hover:underline`
    }`

  /* The CTA inverts rather than staying Cobalt. Against cream, a Cobalt pill
     is the only saturated thing on screen and shouts; the tonal flip keeps
     the same prominence in both bands without raising the volume. */
  const ctaToneClass = isLight
    ? "bg-onyx-canvas text-ivory-text hover:bg-footer-navy"
    : "bg-ivory-text text-onyx-canvas hover:bg-pure-white"

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 border-b font-sans transition-colors duration-300 ${shellClass}`}
    >
      <div className={contentClass}>
        <div className="flex h-16 items-center justify-between gap-6">
          <div className="flex items-center gap-10">
            <Link to="/" className="flex shrink-0 items-center gap-3">
              <img
                src={logo}
                alt=""
                aria-hidden="true"
                className="h-7 object-contain"
              />
              <span
                className={`select-none text-body-lg font-bold uppercase tracking-wordmark transition-colors duration-300 ${wordmarkClass}`}
              >
                DOL<span className="text-cobalt">-</span>FIN
              </span>
            </Link>

            <div className="hidden items-center gap-7 md:flex">
              <a
                href="/#how-it-works"
                className={`text-label font-normal underline-offset-[6px] transition-colors duration-300 ${mutedClass} hover:underline`}
              >
                How it works
              </a>
              <a
                href="/#help"
                className={`text-label font-normal underline-offset-[6px] transition-colors duration-300 ${mutedClass} hover:underline`}
              >
                Help Center
              </a>
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
                <div
                  className={`hidden items-baseline gap-2 rounded-pill px-3 py-2 transition-colors duration-300 sm:flex ${
                    isLight ? "bg-onyx-canvas/8" : "bg-mist-border/10"
                  }`}
                >
                  <span
                    className={`text-caption font-normal uppercase tracking-label-sm transition-colors duration-300 ${mutedClass}`}
                  >
                    {user.userName}
                  </span>
                  <span
                    className={`font-mono text-caption font-normal transition-colors duration-300 ${strongClass}`}
                  >
                    ${user.walletBalance?.toFixed(2) ?? "0.00"}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className={`cursor-pointer text-label font-normal underline-offset-[6px] transition-colors duration-300 hover:underline ${mutedClass}`}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`hidden text-label font-normal underline-offset-[6px] transition-colors duration-300 hover:underline sm:inline ${mutedClass}`}
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className={`cursor-pointer px-6 py-2 text-center text-body ${ctaBaseClass} ${ctaToneClass}`}
                >
                  Create account
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
