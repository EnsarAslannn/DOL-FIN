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
          const currentSymbol = result.symbol || result.Symbol || `stock-${index}`;

          return <Card
            id={currentSymbol}
            key={currentSymbol}
            searchResult={result}
            onPortfolioCreate={onPortfolioCreate}
          />
        })
      ) : (
        <div>
          <p className="mb-3 mt-3 text-center text-subheading font-normal text-zinc-gray">
            No results found!
          </p>
        </div>
      )}
    </>
  )
}

export default CardList