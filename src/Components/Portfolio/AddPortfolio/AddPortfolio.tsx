import { type SyntheticEvent } from "react"

type Props = {
  onPortfolioCreate: (e: SyntheticEvent) => void
  symbol: string
}

const AddPortfolio = ({ onPortfolioCreate, symbol }: Props) => {
  return (
    <div className="flex flex-col items-center justify-end flex-1 space-x-4 space-y-2 md:flex-row md:space-y-0">
      <form onSubmit={onPortfolioCreate}>
        {/* Load-bearing: SearchPage reads this via form.elements[0].value. */}
        <input readOnly={true} hidden={true} value={symbol} />
        <button
          type="submit"
          className="cursor-pointer rounded-pill bg-sunrise-coral px-6 py-2.5 text-body font-bold tracking-[-0.009em] text-paper-white transition-opacity duration-200 hover:opacity-90"
        >
          Add
        </button>
      </form>
    </div>
  )
}

export default AddPortfolio
