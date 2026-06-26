import { realMarketNewsData } from "../../Components/Table/TestData"

const MarketNews = () => {
  return (
    <div className="w-full flex flex-col space-y-4 mt-4">
      <h2 className="text-xl font-bold text-white tracking-tight border-b border-gray-800/60 pb-3 flex items-center gap-2 text-left">
        Latest Market Insights
      </h2>
      <div className="grid grid-cols-1 gap-3">
        {realMarketNewsData.map((news, index) => (
          <a
            key={index}
            href={news.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-[#141a26] rounded-xl border border-gray-800/60 shadow-lg hover:border-gray-700 hover:bg-[#1a2130] transition-all duration-200 gap-3 text-left group block"
          >
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${news.badgeColor}`}
                >
                  {news.category}
                </span>
                <span className="text-gray-600 text-xs">•</span>
                <span className="text-xs text-gray-400 font-medium">
                  {news.source}
                </span>
              </div>
              <h4 className="font-semibold text-gray-200 text-sm sm:text-base tracking-tight group-hover:text-emerald-400 transition-colors">
                {news.title}
              </h4>
              {news.summary && (
                <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 pt-0.5">
                  {news.summary}
                </p>
              )}
            </div>
            <div className="text-right shrink-0">
              <span className="text-[10px] text-gray-400 font-medium bg-gray-800/60 px-2 py-1 rounded-md border border-gray-700/30">
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