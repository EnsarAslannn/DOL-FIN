import { useEffect, useState } from "react"

export type Tone = "dark" | "light"

/** Sections declare their own ground with this attribute. */
export const TONE_ATTR = "data-nav-tone"

/**
 * Reports the tone of whichever band is currently passing under the navbar.
 *
 * Rather than sampling pixels — which cannot see through a video or a scrim,
 * and would need a canvas readback every frame — each band declares its own
 * ground with `data-nav-tone="dark" | "light"`. This walks those elements and
 * returns the tone of the one intersecting the navbar's own centre line.
 *
 * A plain rect test beats an IntersectionObserver here: the question is not
 * "is this section visible" but "which section is under this specific y", and
 * an observer answers that only through a rootMargin computed from the live
 * viewport height, which then has to be rebuilt on every resize. Six
 * `getBoundingClientRect` reads inside one rAF frame is cheaper than that,
 * and it stays correct when bands change height.
 *
 * @param probeY  Distance from the top of the viewport to sample, in px.
 *                Should sit inside the navbar so the bar flips exactly as the
 *                boundary crosses it.
 */
export const useSectionTone = (probeY: number): Tone => {
  const [tone, setTone] = useState<Tone>("dark")

  useEffect(() => {
    let frame = 0

    const measure = () => {
      frame = 0

      const bands = document.querySelectorAll<HTMLElement>(`[${TONE_ATTR}]`)
      let next: Tone = "dark"

      for (const band of bands) {
        const { top, bottom } = band.getBoundingClientRect()
        if (top <= probeY && bottom > probeY) {
          const declared = band.getAttribute(TONE_ATTR)
          if (declared === "light" || declared === "dark") next = declared
          break
        }
      }

      // Bail before the state write when nothing changed, so a scroll over a
      // single long band costs one rect read per frame and no re-render.
      setTone((current) => (current === next ? current : next))
    }

    const schedule = () => {
      if (frame) return
      frame = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)

    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
    }
  }, [probeY])

  return tone
}
