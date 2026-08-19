import { useEffect, useState } from "react"

export type Tone = "dark" | "light"

export const TONE_ATTR = "data-nav-tone"

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
