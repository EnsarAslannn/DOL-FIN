import React, { type SyntheticEvent } from 'react'
import Card from '../Card/Card'
import type { StockSearchResult } from "../../Models/StockSearchResult"

interface Props {
  searchResults: StockSearchResult[];
  onPortfolioCreate: (e: SyntheticEvent) => void;
}

const CardList: React.FC<Props> = ({ searchResults, onPortfolioCreate }: Props) => {
  return (
    <>
      {searchResults.length > 0 ? (
        searchResults.map((result, index) => {
          // Büyük veya küçük harfli sembol yapısını garantiye alıyoruz
          const currentSymbol = result.symbol || result.Symbol || `stock-${index}`;

          // The key has to stay stable across renders. A fresh uuid on every
          // pass made React tear down and rebuild every card whenever the page
          // re-rendered -- including on each keystroke in the search box, since
          // that updates state the parent owns.
          return <Card
            id={currentSymbol}
            key={currentSymbol}
            searchResult={result}
            onPortfolioCreate={onPortfolioCreate}
          />
        })
      ) : (
        <div>
          <p className="mb-3 mt-3 text-xl font-semibold text-center md:text-xl text-mist">
            No results found!
          </p>
        </div>
      )}
    </>
  )
}

export default CardList