import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { usePrefersReducedMotion } from "../../Helpers/usePrefersReducedMotion"
import { reveal, revealGroup, revealProps } from "../../Helpers/motion"

export type RatioListColumn<T> = {
  label: string
  subTitle?: string
  render: (data: T) => ReactNode
}

type Props<T> = {
  config: RatioListColumn<T>[]
  data: T
}

/**
 * A key-figure list.
 *
 * Sits on Graphite because it is a discrete panel beside other panels, but
 * the internal dividers are gone — label left, figure right, separated by
 * space. The label is Ash and the figure Ivory mono, which is enough
 * structure at this density.
 */
const RatioList = <T,>({ config, data }: Props<T>) => {
  const prefersReducedMotion = usePrefersReducedMotion()

  return (
    <div className="h-full rounded-card bg-graphite-card p-5 ring-1 ring-inset ring-mist-border/6 sm:p-6">
      <motion.ul
        variants={revealGroup}
        {...revealProps(prefersReducedMotion)}
        className="flex flex-col"
      >
        {config.map((row, id) => (
          <motion.li
            key={id}
            variants={reveal}
            className="flex items-baseline justify-between gap-6 py-3"
          >
            <div className="min-w-0 text-left">
              <p className="truncate text-body font-normal text-ash-text">
                {row.label}
              </p>
              {row.subTitle && (
                <p className="truncate text-caption font-normal text-ash-text/60">
                  {row.subTitle}
                </p>
              )}
            </div>
            <div className="shrink-0 font-mono text-body font-normal text-ivory-text">
              {row.render(data)}
            </div>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  )
}

export default RatioList
