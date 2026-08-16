import { realMarketNewsData } from "../../Components/Table/TestData"

const MarketNews = () => {
  return (
    <div className="mt-4 flex w-full flex-col space-y-4">
      <h2 className="flex items-center gap-2 border-b border-mist-gray pb-3 text-left text-heading font-normal text-carbon-black">
        Latest Market Insights
      </h2>
      <div className="grid grid-cols-1 gap-3">
        {realMarketNewsData.map((news, index) => (
          <a
            key={index}
            href={news.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col justify-between gap-3 rounded-card border border-mist-gray bg-paper-white p-card text-left transition-colors duration-200 hover:border-ash-gray sm:flex-row sm:items-center"
          >
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <span
                  className={`rounded-smallcard px-2 py-0.5 font-mono text-caption font-normal uppercase tracking-[0.12em] ${news.badgeColor}`}
                >
                  {news.category}
                </span>
                <span className="text-body text-ash-gray">•</span>
                <span className="text-body font-normal text-zinc-gray">
                  {news.source}
                </span>
              </div>
              <h4 className="text-subheading font-normal text-carbon-black underline-offset-4 group-hover:underline">
                {news.title}
              </h4>
              {news.summary && (
                <p className="line-clamp-2 pt-0.5 text-body font-normal text-zinc-gray">
                  {news.summary}
                </p>
              )}
            </div>
            <div className="shrink-0 text-right">
              <span className="font-mono text-caption font-normal text-zinc-gray">
                {news.time}
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

export default MarketNews