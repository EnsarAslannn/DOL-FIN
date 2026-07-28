import { realMarketNewsData } from "../../Components/Table/TestData"

const MarketNews = () => {
  return (
    <div className="w-full flex flex-col space-y-4 mt-4">
      <h2 className="text-xl font-bold text-foam tracking-[-0.02em] font-display border-b border-white/8 pb-3 flex items-center gap-2 text-left">
        Latest Market Insights
      </h2>
      <div className="grid grid-cols-1 gap-3">
        {realMarketNewsData.map((news, index) => (
          <a
            key={index}
            href={news.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-depth rounded-xl border border-white/8 hover:border-pulse/25 hover:bg-depth-2/60 transition-all duration-200 gap-3 text-left group block"
          >
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${news.badgeColor}`}
                >
                  {news.category}
                </span>
                <span className="text-mist/70 text-xs">•</span>
                <span className="text-xs text-mist font-medium">
                  {news.source}
                </span>
              </div>
              <h4 className="font-semibold text-foam text-sm sm:text-base tracking-tight group-hover:text-pulse transition-colors">
                {news.title}
              </h4>
              {news.summary && (
                <p className="text-xs text-mist leading-relaxed line-clamp-2 pt-0.5">
                  {news.summary}
                </p>
              )}
            </div>
            <div className="text-right shrink-0">
              <span className="text-[10px] text-mist font-medium font-mono bg-white/5 px-2 py-1 rounded-md border border-white/6">
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