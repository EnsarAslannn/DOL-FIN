import DataLoader from "../Dashboard/DataLoader"

type Props = {
  isLoading?: boolean
  label?: string
  variant?: "inline" | "overlay"
}

const Spinners = ({
  isLoading = true,
  label,
  variant = "overlay",
}: Props) => {
  if (!isLoading) return null

  return <DataLoader label={label} variant={variant} />
}

export default Spinners
