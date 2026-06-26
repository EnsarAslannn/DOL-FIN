import { ClipLoader } from "react-spinners"

type Props = {
  isLoading?: boolean
}

const Spinners = ({ isLoading = true }: Props) => {
  return (
    <>
      <div
        id="loading-spinner"
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-50 bg-opacity-60 backdrop-blur-sm"
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <ClipLoader
            color="#34d7b7"
            loading={isLoading}
            size={45}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      </div>
    </>
  )
}

export default Spinners
