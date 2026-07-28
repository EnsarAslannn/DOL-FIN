type Props = {
  isLoading?: boolean
}

const Spinners = ({ isLoading = true }: Props) => {
  if (!isLoading) return null

  return (
    <div
      id="loading-spinner"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-abyss/85 backdrop-blur-md"
    >
      <div
        className="flex flex-col items-center justify-center space-y-5"
        aria-label="Loading"
        data-testid="loader"
      >
        <div className="relative w-16 h-16 flex items-center justify-center">
          <span className="sonar-ring" />
          <span className="sonar-ring" data-delay="1" />
          <span className="sonar-ring" data-delay="2" />
          <span className="w-2.5 h-2.5 rounded-full bg-pulse shadow-[0_0_14px_#ff571a]" />
        </div>
        <span className="text-[11px] font-bold text-mist uppercase tracking-[0.2em] font-mono">
          Reading the tape…
        </span>
      </div>
    </div>
  )
}

export default Spinners
