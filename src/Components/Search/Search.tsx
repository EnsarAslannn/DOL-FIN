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
          className="w-full pl-12 pr-24 py-3.5 bg-depth text-foam placeholder-mist/70 text-sm rounded-xl border border-ridge/60 shadow-lg outline-none transition-all duration-200 focus:border-pulse focus:ring-2 focus:ring-pulse/10"
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
          className="absolute right-2 px-5 py-2 bg-pulse hover:bg-pulse-dim text-abyss font-bold text-xs uppercase tracking-wider rounded-lg shadow-md transition-all duration-200 active:scale-95"
        >
          Search
        </button>
      </form>

      {showSuggestions && (
        <div className="absolute left-2 right-2 mt-2 z-50 bg-depth border border-ridge/60 rounded-xl shadow-2xl overflow-hidden max-h-60 flex flex-col text-left">
          <div className="px-4 py-2 text-[10px] font-bold text-mist uppercase tracking-wider border-b border-ridge/40 bg-abyss/30 font-mono">
            Featured Demo Assets
          </div>
          {suggestions
            .filter((sym) => sym.toLowerCase().includes((search || "").toLowerCase()))
            .map((symbol) => (
              <div
                key={symbol}
                onMouseDown={() => handleSuggestionClick(symbol)}
                className="px-4 py-2.5 cursor-pointer text-sm font-semibold text-mist hover:bg-depth-2 hover:text-pulse transition-colors duration-150 font-mono"
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