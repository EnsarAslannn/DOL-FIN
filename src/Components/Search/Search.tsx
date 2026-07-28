import { useState, type ChangeEvent, type SyntheticEvent } from "react"

interface Props {
  onSearchSubmit: (e: SyntheticEvent) => void
  search: string | undefined
  handleSearchChange: (e: ChangeEvent<HTMLInputElement>) => void
}

const Search: React.FC<Props> = ({
  onSearchSubmit,
  search,
  handleSearchChange,
}: Props) => {
  const [showSuggestions, setShowSuggestions] = useState(false)
  const suggestions = ["AAPL", "MSFT", "NVDA", "TSLA", "GOOGL"]

  const handleSuggestionClick = (symbol: string) => {
    const customEvent = {
      target: { value: symbol }
    } as ChangeEvent<HTMLInputElement>

    handleSearchChange(customEvent)
    setShowSuggestions(false)

    setTimeout(() => {
      const mockFormEvent = {
        preventDefault: () => { }
      } as SyntheticEvent
      onSearchSubmit(mockFormEvent)
    }, 50)
  }

  return (
    <section className="relative w-full max-w-2xl mx-auto mt-6 mb-2 px-2 font-sans">
      <form
        className="relative flex items-center w-full"
        onSubmit={onSearchSubmit}
      >
        <div className="absolute left-4 text-mist pointer-events-none flex items-center justify-center">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          className="w-full pl-12 pr-28 py-4 bg-black/50 backdrop-blur-md text-foam placeholder-mist/60 text-sm rounded-xl border border-white/10 outline-none transition-all duration-200 focus:border-pulse/70 focus:shadow-[0_0_0_4px_rgba(255,87,26,0.12)]"
          id="search-input"
          placeholder="Search companies by ticker or name..."
          value={search}
          onChange={handleSearchChange}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          autoComplete="off"
        />

        <button
          type="submit"
          className="glow-action absolute right-2.5 px-5 py-2.5 bg-gradient-to-r from-pulse to-[#ff8a3d] text-white font-bold text-[11px] uppercase tracking-[0.12em] rounded-lg transition-all duration-200 active:scale-95 cursor-pointer"
        >
          Search
        </button>
      </form>

      {showSuggestions && (
        <div className="glass-panel absolute left-2 right-2 mt-2 z-50 rounded-xl shadow-2xl overflow-hidden max-h-60 flex flex-col text-left">
          <div className="px-4 py-2.5 text-[10px] font-bold text-mist uppercase tracking-[0.14em] border-b border-white/8 font-mono">
            Featured Demo Assets
          </div>
          {suggestions
            .filter((sym) => sym.toLowerCase().includes((search || "").toLowerCase()))
            .map((symbol) => (
              <div
                key={symbol}
                onMouseDown={() => handleSuggestionClick(symbol)}
                className="px-4 py-2.5 cursor-pointer text-sm font-semibold text-mist hover:bg-white/5 hover:text-pulse transition-colors duration-150 font-mono"
              >
                {symbol}
              </div>
            ))}
        </div>
      )}
    </section>
  )
}

export default Search