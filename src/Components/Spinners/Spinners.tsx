type Props = {
  isLoading?: boolean
}

const Spinners = ({ isLoading = true }: Props) => {
  if (!isLoading) return null

  return (
    <div
      id="loading-spinner"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-graphite-card/95"
    >
      <div
        className="flex flex-col items-center justify-center space-y-5"
        aria-label="Loading"
        data-testid="loader"
      >
        <div className="relative flex h-16 w-16 items-center justify-center text-cobalt">
          <span className="sonar-ring" />
          <span className="sonar-ring" data-delay="1" />
          <span className="sonar-ring" data-delay="2" />
          <span className="h-2.5 w-2.5 rounded-full bg-cobalt" />
        </div>
        <span className="font-mono text-caption font-normal uppercase tracking-label-lg text-ash-text">
          Reading the tape…
        </span>
      </div>
    </div>
  )
}

export default Spinners
