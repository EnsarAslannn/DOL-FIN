import type { ReactNode } from "react"
import { terminalClass } from "../../Helpers/layout"
import { TONE_ATTR } from "../../Helpers/useSectionTone"

export type BandTone = "dark" | "cream"

interface Props {
  tone: BandTone
  children: ReactNode
  className?: string
  bare?: boolean
  id?: string
}

const Band = ({ tone, children, className = "", bare = false, id }: Props) => (
  <section
    id={id}
    data-band={tone}
    {...{ [TONE_ATTR]: tone === "cream" ? "light" : "dark" }}
    className={`w-full bg-band-canvas text-band-ink ${className}`}
  >
    {bare ? children : <div className={terminalClass}>{children}</div>}
  </section>
)

export default Band
