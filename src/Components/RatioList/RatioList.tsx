type Props = {
  config: any
  data: any
}

const RatioList = ({ config, data }: Props) => {
  const renderedRows = config.map((row: any, id: number) => {
    return (
      <li key={id} className="py-3 sm:py-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm font-bold text-foam truncate">{row.label}</p>
            <p className="text-xs text-mist truncate">
              {row.subTitle && row.subTitle}
            </p>
          </div>
          <div className="inline-flex items-center text-sm font-semibold text-foam font-mono">
            {row.render(data)}
          </div>
        </div>
      </li>
    )
  })

  return (
    <div className="bg-depth border border-ridge/40 rounded-2xl p-4 sm:p-6 shadow-xl h-full">
      <ul className="divide-y divide-ridge/20">{renderedRows}</ul>
    </div>
  )
}

export default RatioList
