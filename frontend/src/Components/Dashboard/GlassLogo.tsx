import type { ReactNode } from "react"
import glassPanel from "../../assets/extra/glass-panel.webp"

interface Props {
  children: ReactNode
  className?: string
  padding?: string
}

const GlassLogo = ({
  children,
  className = "h-11 w-11",
  padding = "p-2",
}: Props) => (
  <div
    className={`relative grid shrink-0 place-items-center overflow-hidden rounded-icon bg-band-surface ${className}`}
  >
    <img
      src={glassPanel}
      alt=""
      aria-hidden="true"
      loading="lazy"
      decoding="async"
      className="pointer-events-none absolute inset-0 h-full w-full scale-[1.6] object-cover"
      style={{
        opacity: "var(--band-glass-opacity)",
        mixBlendMode: "var(--band-glass-blend)" as React.CSSProperties["mixBlendMode"],
      }}
    />
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 rounded-icon ring-1 ring-inset ring-band-line/10"
    />
    <div
      className={`relative z-10 grid h-full w-full place-items-center ${padding}`}
    >
      {children}
    </div>
  </div>
)

export default GlassLogo
