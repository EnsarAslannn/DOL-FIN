import loadingLoop from "../../assets/extra/loading-loop.mp4"
import { usePrefersReducedMotion } from "../../Helpers/usePrefersReducedMotion"

interface Props {
  /** Shown under the loop. Name the work, not the widget. */
  label?: string
  /** `inline` sits inside a panel; `overlay` covers the viewport. */
  variant?: "inline" | "overlay"
}

/**
 * The app's loading state.
 *
 * A cobalt line chart drawing itself across a near-black grid, which reads as
 * the data being assembled rather than as a widget spinning. The loop's own
 * ground is rgb(17,17,19) — within a few levels of Onyx Canvas — so it is
 * masked at the edges and needs no frame to sit on the page.
 *
 * The loop is decorative: it duplicates the label beneath it and carries no
 * information of its own, so reduced motion drops it for a static pulse
 * rather than freezing a video on an arbitrary frame.
 *
 * `aria-live="polite"` and `role="status"` announce the label once, so a
 * screen reader says "Reading the tape" instead of nothing at all.
 */
const DataLoader = ({ label = "Reading the tape", variant = "inline" }: Props) => {
  const prefersReducedMotion = usePrefersReducedMotion()

  const shell =
    variant === "overlay"
      ? "fixed inset-0 z-50 bg-onyx-canvas/92 backdrop-blur-sm"
      : "w-full py-16"

  return (
    <div
      id="loading-spinner"
      role="status"
      aria-live="polite"
      data-testid="loader"
      className={`flex flex-col items-center justify-center gap-6 ${shell}`}
    >
      {prefersReducedMotion ? (
        <span
          aria-hidden="true"
          className="h-1 w-40 animate-pulse rounded-pill bg-cobalt/60"
        />
      ) : (
        <>
        {/* The loop is a video on a near-black ground, so on a cream band it
            would read as a dark rectangle no mask can rescue. Both are
            rendered and the band picks one in CSS — cheaper than threading
            the band's tone back up into React, and it stays correct if a
            loader is ever moved between grounds. */}
        <span
          data-loader="pulse"
          aria-hidden="true"
          className="h-1 w-40 animate-pulse rounded-pill bg-cobalt/60"
        />
        <video
          data-loader="loop"
          className="h-24 w-full max-w-[320px] object-cover"
          style={{
            maskImage:
              "radial-gradient(ellipse at 50% 50%, #000 45%, transparent 85%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at 50% 50%, #000 45%, transparent 85%)",
          }}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
        >
          <source src={loadingLoop} type="video/mp4" />
        </video>
        </>
      )}

      <span className="font-mono text-caption font-normal uppercase tracking-label-lg text-band-muted">
        {label}
      </span>
    </div>
  )
}

export default DataLoader
