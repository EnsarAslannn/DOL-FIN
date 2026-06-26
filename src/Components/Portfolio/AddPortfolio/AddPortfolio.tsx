import { type SyntheticEvent } from "react"

type Props = {
  onPortfolioCreate: (e: SyntheticEvent) => void
  symbol: string
}

const AddPortfolio = ({ onPortfolioCreate, symbol }: Props) => {
  return (
    <div className="flex flex-col items-center justify-end flex-1 space-x-4 space-y-2 md:flex-row md:space-y-0">
      <form onSubmit={onPortfolioCreate}>
        <input readOnly={true} hidden={true} value={symbol} />
        <button
          type="submit"
          className="px-6 py-2 bg-lightGreen hover:bg-green-600 text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-sm transition-all duration-200 active:scale-95"
        >
          Add
        </button>
      </form>
    </div>
  )
}

export default AddPortfolio
