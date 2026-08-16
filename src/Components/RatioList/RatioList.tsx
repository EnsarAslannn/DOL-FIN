import type { ReactNode } from "react"

export type RatioListColumn<T> = {
  label: string
  subTitle?: string
  render: (data: T) => ReactNode
}

type Props<T> = {
  config: RatioListColumn<T>[]
  data: T
}

const RatioList = <T,>({ config, data }: Props<T>) => {
  const renderedRows = config.map((row, id) => {
    return (
      <li key={id} className="py-3 sm:py-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 min-w-0 text-left">
            <p className="text-body font-bold text-carbon-black truncate">{row.label}</p>
            <p className="text-body text-zinc-gray truncate">
              {row.subTitle && row.subTitle}
            </p>
          </div>
          <div className="inline-flex items-center text-body font-bold text-zinc-gray font-mono">
            {row.render(data)}
          </div>
        </div>
      </li>
    )
  })

  return (
    <div className="bg-paper-white border border-mist-gray rounded-card p-4 sm:p-6 h-full">
      <ul className="divide-y divide-mist-gray">{renderedRows}</ul>
    </div>
  )
}

export default RatioList
