import DataLoader from "../Dashboard/DataLoader"

type Props = {
  isLoading?: boolean
  /** Names the work in progress. Defaults to the generic tape read. */
  label?: string
  /** `overlay` covers the viewport; `inline` sits inside a panel. */
  variant?: "inline" | "overlay"
}

/**
 * Kept as the app's loading entry point so the ~10 existing call sites do not
 * each have to change, but the spinner itself is gone — this now delegates to
 * DataLoader, which draws the cobalt chart loop.
 *
 * `#loading-spinner` and `data-testid="loader"` live on DataLoader's root, so
 * the e2e suite's selectors still resolve.
 */
const Spinners = ({
  isLoading = true,
  label,
  variant = "overlay",
}: Props) => {
  if (!isLoading) return null

  return <DataLoader label={label} variant={variant} />
}

export default Spinners
