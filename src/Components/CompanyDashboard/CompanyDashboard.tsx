import React from 'react'

type Props = {
  children: React.ReactNode
}

const CompanyDashboard = ({ children }: Props) => {
  return (
    <div className="relative md:ml-64 flex-1 min-w-0 bg-onyx-canvas min-h-screen">
      <div className="relative flex w-full flex-col pt-16">
        {children}
      </div>
    </div>
  )
}

export default CompanyDashboard
