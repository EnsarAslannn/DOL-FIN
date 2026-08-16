import { useState, type ChangeEvent, type SyntheticEvent } from "react"
import { ctaCompactClass } from "../../Helpers/formStyles"

interface Props {
  onSearchSubmit: (e: SyntheticEvent, overrideQuery?: string) => void
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

    const mockFormEvent = { preventDefault: () => { } } as SyntheticEvent
    onSearchSubmit(mockFormEvent, symbol)
  }

  return (
    <section className="relative mx-auto mb-2 mt-6 w-full max-w-2xl px-2 font-sans">
      <form
        className="relative flex w-full items-center"
        onSubmit={onSearchSubmit}
      >
        <div className="pointer-events-none absolute left-5 flex items-center justify-center text-ash-gray">
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          className="w-full rounded-pill border border-mist-gray bg-paper-white py-4 pl-14 pr-32 text-body font-normal text-carbon-black outline-none transition-colors duration-200 placeholder:text-ash-gray focus:border-sunrise-coral focus:ring-2 focus:ring-sunrise-coral/25"
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
          className={`absolute right-2 ${ctaCompactClass}`}
        >
          Search
        </button>
      </form>

      {showSuggestions && (
        <div className="absolute left-2 right-2 z-50 mt-2 flex max-h-60 flex-col overflow-hidden rounded-card border border-mist-gray bg-paper-white text-left shadow-subtle">
          <div className="border-b border-mist-gray px-4 py-3 font-mono text-caption font-normal uppercase tracking-label text-zinc-gray">
            Featured Demo Assets
          </div>
          {suggestions
            .filter((sym) => sym.toLowerCase().includes((search || "").toLowerCase()))
            .map((symbol) => (
              <div
                key={symbol}
                onMouseDown={() => handleSuggestionClick(symbol)}
                className="cursor-pointer px-4 py-3 font-mono text-body font-normal text-carbon-black transition-colors duration-150 hover:bg-fog-gray"
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