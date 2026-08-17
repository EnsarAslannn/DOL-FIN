import React from 'react'

type Props = {
  children: React.ReactNode
}

const CompanyDashboard = ({children}: Props) => {
  return (
    <div className="relative md:ml-64 flex-1 min-w-0 bg-onyx-canvas min-h-screen">
      {/* pt clears the floating nav pill (top-4 + h-14). */}
      <div className="relative pt-28 pb-section">
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