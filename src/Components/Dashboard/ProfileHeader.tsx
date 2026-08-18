import { motion } from "framer-motion"
import abstractHeader from "../../assets/extra/abstract-header.webp"
import { companyLogos } from "../Table/TestData"
import GlassLogo from "./GlassLogo"
import { usePrefersReducedMotion } from "../../Helpers/usePrefersReducedMotion"
import { reveal, revealGroup, revealProps } from "../../Helpers/motion"

export interface HeaderMetric {
  label: string
  value: string
  /** Optional direction, for figures that carry one. */
  tone?: "gain" | "loss"
}

interface Props {
  symbol: string
  companyName: string
  sector?: string
  industry?: string
  exchange?: string
  metrics: HeaderMetric[]
}

/**
 * The company identity block.
 *
 * The abstract data-viz render sits behind it as a cinematic layer rather
 * than as decoration: it is pinned to the right and faded out to the left
 * under an Onyx gradient, so the type it sits behind never loses contrast
 * while the plate still reads as a header rather than a flat band.
 *
 * The render's own ground is near-Onyx, which is why it can bleed straight
 * into the canvas at the bottom with no border to close it off.
 */
const ProfileHeader = ({
  symbol,
  companyName,
  sector,
  industry,
  exchange,
  metrics,
}: Props) => {
  const prefersReducedMotion = usePrefersReducedMotion()
  const symbolUpper = symbol?.toUpperCase() ?? ""

  const context = [sector, industry, exchange].filter(Boolean)

  return (
    <motion.section
      variants={revealGroup}
      {...revealProps(prefersReducedMotion)}
      className="relative overflow-hidden rounded-card"
    >
      <img
        src={abstractHeader}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-right"
      />
      {/* Left-weighted so the identity column sits on near-solid Onyx and the
          chart survives only on the right, where nothing is written. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-onyx-canvas via-onyx-canvas/85 to-onyx-canvas/40"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-onyx-canvas via-transparent to-transparent"
      />

      <div className="relative z-10 flex flex-col gap-10 p-6 md:p-8">
        <motion.div variants={reveal} className="flex items-center gap-4">
          <GlassLogo className="h-14 w-14" padding="p-3">
            {companyLogos[symbolUpper] ? (
              companyLogos[symbolUpper]()
            ) : (
              <span className="font-mono text-caption font-bold text-ivory-text">
                {symbolUpper.slice(0, 4)}
              </span>
            )}
          </GlassLogo>

          <div className="min-w-0">
            <h1 className="truncate text-heading-sm font-medium text-ivory-text md:text-heading">
              {companyName}
            </h1>
            <p className="mt-1 flex flex-wrap items-center gap-x-2 font-mono text-caption font-normal uppercase tracking-label-sm text-ash-text">
              <span className="text-ivory-text">{symbolUpper}</span>
              {context.map((item) => (
                <span key={item} className="flex items-center gap-2">
                  <span aria-hidden="true" className="text-ash-text/70">
                    ·
                  </span>
                  {item}
                </span>
              ))}
            </p>
          </div>
        </motion.div>

        <motion.dl
          variants={revealGroup}
          className="grid grid-cols-2 gap-x-8 gap-y-6 lg:grid-cols-4"
        >
          {metrics.map((metric) => (
            <motion.div
              key={metric.label}
              variants={reveal}
              className="border-l border-mist-border/15 pl-4 first:border-l-0 first:pl-0 lg:border-l lg:pl-4 lg:first:border-l-0 lg:first:pl-0"
            >
              <dt className="font-mono text-caption font-normal uppercase tracking-label-sm text-ash-text/70">
                {metric.label}
              </dt>
              <dd
                className={`mt-2 font-mono text-heading-sm font-normal ${
                  metric.tone === "gain"
                    ? "text-gain"
                    : metric.tone === "loss"
                      ? "text-loss"
                      : "text-ivory-text"
                }`}
              >
                {metric.value}
              </dd>
            </motion.div>
          ))}
        </motion.dl>
      </div>
    </motion.section>
  )
}

export default ProfileHeader
