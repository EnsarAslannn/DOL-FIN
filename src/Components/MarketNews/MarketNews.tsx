import { realMarketNewsData } from "../../Components/Table/TestData"

const MarketNews = () => {
  return (
    <div className="mt-4 flex w-full flex-col space-y-4">
      <h2 className="flex items-center gap-2 border-b border-mist-border/8 pb-3 text-left text-heading font-normal text-ivory-text">
        Latest Market Insights
      </h2>
      <div className="grid grid-cols-1 gap-3">
        {realMarketNewsData.map((news, index) => (
          <a
            key={index}
            href={news.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col justify-between gap-3 rounded-card bg-graphite-card ring-1 ring-inset ring-mist-border/6 p-card text-left transition-colors duration-200 hover:ring-mist-border/20 sm:flex-row sm:items-center"
          >
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <span
                  className={`rounded-smallcard px-2 py-1 font-mono text-caption font-normal uppercase tracking-label-sm ${news.badgeColor}`}
                >
                  {news.category}
                </span>
                <span className="text-body text-ash-text/70">•</span>
                <span className="text-body font-normal text-ash-text">
                  {news.source}
                </span>
              </div>
              <h4 className="text-subheading font-normal text-ivory-text underline-offset-4 group-hover:underline">
                {news.title}
              </h4>
              {news.summary && (
                <p className="line-clamp-2 pt-1 text-body font-normal text-ash-text">
                  {news.summary}
                </p>
              )}
            </div>
            <div className="shrink-0 text-right">
              <span className="font-mono text-caption font-normal text-ash-text">
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