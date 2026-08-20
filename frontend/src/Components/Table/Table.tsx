import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { usePrefersReducedMotion } from "../../Helpers/usePrefersReducedMotion"
import { reveal, revealGroup, revealProps } from "../../Helpers/motion"

export type TableColumn<T> = {
  label: ReactNode
  render: (row: T) => ReactNode
}

type Props<T> = {
  config: TableColumn<T>[]
  data: T[]
}

const Table = <T extends { symbol?: string }>({ config, data }: Props<T>) => {
  const prefersReducedMotion = usePrefersReducedMotion()

  const renderedRows = data.map((company, rowIndex) => {
    const rowKey = `row-${company.symbol || "stock"}-${rowIndex}`

    return (
      <motion.tr
        key={rowKey}
        variants={reveal}
        className="group transition-colors duration-150 hover:bg-band-surface/70"
      >
        {config.map((col, idx) => (
          <td
            key={`cell-${rowIndex}-${idx}`}
            className={`whitespace-nowrap px-4 py-3.5 first:rounded-l-smallcard first:pl-4 last:rounded-r-smallcard last:pr-4 ${
              idx === 0
                ? "font-sans text-body font-normal text-band-muted group-hover:text-band-ink"
                : "text-right font-mono text-body font-normal text-band-ink"
            }`}
          >
            {col.render(company)}
          </td>
        ))}
      </motion.tr>
    )
  })

  const renderedHeaders = config.map((col, index) => (
    <th
      className={`whitespace-nowrap border-b border-band-line/10 px-4 pb-3 font-mono text-caption font-normal uppercase tracking-label text-band-subtle first:pl-4 last:pr-4 ${
        index === 0 ? "text-left" : "text-right"
      }`}
      key={`header-${index}`}
      scope="col"
    >
      {col.label}
    </th>
  ))

  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full border-separate border-spacing-0 text-left font-sans">
        <thead>
          <tr>{renderedHeaders}</tr>
        </thead>
        <motion.tbody
          variants={revealGroup}
          {...revealProps(prefersReducedMotion)}
        >
          {renderedRows}
        </motion.tbody>
      </table>
    </div>
  )
}

export default Table
