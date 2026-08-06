type Props = {
  title: string
  subTitle: string
}

const Tile = ({ title, subTitle }: Props) => {
  return (
    <div className="w-full bg-depth border border-white/8 rounded-2xl p-5 flex items-center justify-between min-h-[115px] transition-all duration-200 hover:border-pulse/30 hover:bg-depth-2/50 group relative overflow-hidden">
      {}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-pulse/40 to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
      <div className="absolute right-14 bottom-2 w-20 h-8 opacity-20 group-hover:opacity-45 transition-opacity duration-300 hidden sm:block">
        {(title === "Company Name" || title === "Total Net Worth") && (
          <svg
            viewBox="0 0 100 40"
            className="w-full h-full stroke-pulse stroke-2 fill-none"
          >
            <path d="M0,35 Q15,5 30,25 T60,10 T90,5 T100,2" />
          </svg>
        )}
        {(title === "Price" || title === "Portfolio Health") && (
          <svg
            viewBox="0 0 100 40"
            className="w-full h-full stroke-amber-400 stroke-2 fill-none"
          >
            <path d="M0,20 Q20,20 40,5 T80,35 T100,10" />
          </svg>
        )}
        {(title === "Sector" || title === "Primary Sector") && (
          <svg
            viewBox="0 0 100 40"
            className="w-full h-full stroke-pulse-dim stroke-2 fill-none"
          >
            <path d="M0,30 Q25,30 50,10 T75,25 T100,5" />
          </svg>
        )}
        {title === "Market Cap" && (
          <svg
            viewBox="0 0 100 40"
            className="w-full h-full stroke-orchid stroke-2 fill-none"
          >
            <path d="M0,15 Q30,40 60,15 T100,5" />
          </svg>
        )}
      </div>

      <div className="flex flex-col space-y-2 text-left z-10">
        <h5 className="text-mist uppercase font-bold text-[10px] tracking-[0.16em] font-mono">
          {title}
        </h5>
        <span className="font-bold text-xl text-foam tracking-[-0.02em] font-display">
          {subTitle}
        </span>
      </div>

      <div className="p-3 bg-black/40 rounded-xl flex items-center justify-center shrink-0 border border-white/8 z-10 group-hover:scale-105 group-hover:border-white/15 transition-all">
        {(title === "Company Name" || title === "Total Net Worth") && (
          <svg
            className="w-5 h-5 text-pulse"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        )}
        {(title === "Price" || title === "Portfolio Health") && (
          <svg
            className="w-5 h-5 text-amber-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )}
        {(title === "Sector" || title === "Primary Sector") && (
          <svg
            className="w-5 h-5 text-pulse-dim"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        )}
        {title === "Market Cap" && (
          <svg
            className="w-5 h-5 text-orchid"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
            />
          </svg>
        )}
      </div>
    </div>
  )
}

export default Tile
