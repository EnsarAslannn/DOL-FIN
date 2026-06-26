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
            <p className="text-sm font-bold text-white truncate">{row.label}</p>
            <p className="text-xs text-gray-400 truncate">
              {row.subTitle && row.subTitle}
            </p>
          </div>
          <div className="inline-flex items-center text-sm font-semibold text-gray-100 font-mono">
            {row.render(data)}
          </div>
        </div>
      </li>
    )
  })

  return (
    <div className="bg-[#141a26] border border-gray-800/60 rounded-2xl p-4 sm:p-6 shadow-xl h-full">
      <ul className="divide-y divide-gray-800/40">{renderedRows}</ul>
    </div>
  )
}

export default RatioList
