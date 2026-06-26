import React, { type SyntheticEvent } from 'react'
import Card from '../Card/Card'
import { v4 as uuidv4 } from "uuid"

interface Props {
  searchResults: any[];
  onPortfolioCreate: (e: SyntheticEvent) => void;
}

const CardList: React.FC<Props> = ({ searchResults, onPortfolioCreate }: Props) => {
  return (
    <>
      {searchResults.length > 0 ? (
        searchResults.map((result) => {
          // Büyük veya küçük harfli sembol yapısını garantiye alıyoruz
          const currentSymbol = result.symbol || result.Symbol || uuidv4();

          return <Card
            id={currentSymbol}
            key={uuidv4()}
            searchResult={result}
            onPortfolioCreate={onPortfolioCreate}
          />
        })
      ) : (
        <div>
          <p className="mb-3 mt-3 text-xl font-semibold text-center md:text-xl text-gray-500">
            No results found!
          </p>
        </div>
      )}
    </>
  )
}

export default CardList