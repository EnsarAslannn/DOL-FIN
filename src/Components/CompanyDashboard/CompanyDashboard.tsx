import React from 'react'

type Props = {
  children: React.ReactNode
}

const CompanyDashboard = ({children}: Props) => {
  return (
    // `w-full` here meant 100% of the viewport *plus* the 16rem sidebar offset,
    // pushing the tiles and statement tables under the clipped right edge.
    // Sizing to the remaining track keeps every column on screen.
    <div className="relative md:ml-64 flex-1 min-w-0 bg-abyss min-h-screen">
      <div className="relative pt-6 pb-12">
        <div className="px-4 md:px-8 mx-auto w-full">
          <div className="flex flex-col space-y-4 w-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompanyDashboard