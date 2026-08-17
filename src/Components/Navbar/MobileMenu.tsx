import { useEffect, useRef, type ReactNode } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { usePrefersReducedMotion } from "../../Helpers/usePrefersReducedMotion"

interface Props {
  open: boolean
  onClose: () => void
  /** Matches the navbar's own tone, so the sheet belongs to the bar. */
  isLight: boolean
  /** Element that opened the sheet; focus returns here on close. */
  triggerRef: React.RefObject<HTMLButtonElement | null>
  id: string
  children: ReactNode
}

/**
 * The mobile navigation sheet.
 *
 * Drops from under the bar rather than sliding from the side: the bar is
 * full-bleed and fixed to the top, so a panel that grows downward from it
 * reads as the same object opening rather than a second surface arriving.
 *
 * It re-tones with the navbar — cream over a light band, Onyx over a dark
 * one — so opening the menu never introduces a colour the section beneath it
 * does not already use.
 *
 * Behaviour the sheet owns, because a nav menu that lacks any of it is
 * broken rather than merely unpolished:
 *   - Escape closes it, and focus returns to the trigger
 *   - a click on the scrim closes it
 *   - the page behind it cannot scroll while it is open
 *   - the first link takes focus on open, so the keyboard lands inside
 */
const MobileMenu = ({
  open,
  onClose,
  isLight,
  triggerRef,
  id,
  children,
}: Props) => {
  const prefersReducedMotion = usePrefersReducedMotion()
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return
      onClose()
      triggerRef.current?.focus()
    }

    // Lock the page, restoring whatever overflow was set rather than
    // assuming it was the default — the wallet page sets its own.
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    document.addEventListener("keydown", onKeyDown)

    panelRef.current?.querySelector<HTMLElement>("a, button")?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [open, onClose, triggerRef])

  const duration = prefersReducedMotion ? 0 : 0.22

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration }}
            onClick={onClose}
            aria-hidden="true"
            className="fixed inset-x-0 bottom-0 top-16 z-40 bg-onyx-canvas/70 backdrop-blur-sm md:hidden"
          />

          <motion.div
            key="sheet"
            id={id}
            ref={panelRef}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration, ease: [0.22, 0.61, 0.36, 1] }}
            className={`fixed inset-x-0 top-16 z-50 border-b md:hidden ${
              isLight
                ? "border-onyx-canvas/10 bg-cream-canvas"
                : "border-mist-border/10 bg-onyx-canvas"
            }`}
          >
            <nav
              aria-label="Mobile"
              className="flex flex-col gap-1 px-6 pb-8 pt-4"
            >
              {children}
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default MobileMenu
