import type { SyntheticEvent } from "react"

interface Props {
  onPortfolioDelete: (e: SyntheticEvent) => void
  portfolioValue: string
}

const DeletePortfolio = ({ onPortfolioDelete, portfolioValue }: Props) => {
  return (
    <div>
      <form
        onSubmit={onPortfolioDelete}
        className="flex items-center justify-center"
      >
        <input hidden={true} defaultValue={portfolioValue} />
        <button
          type="submit"
          className="flex items-center justify-center w-6 h-6 text-xs font-bold text-gray-400 bg-gray-100 rounded-full transition-all duration-200 hover:bg-red-100 hover:text-red-500 shadow-sm active:scale-90"
          title="Remove from portfolio"
        >
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </form>
    </div>
  )
}

export default DeletePortfolio
