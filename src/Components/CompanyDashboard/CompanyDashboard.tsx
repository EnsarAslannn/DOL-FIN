import React from 'react'

type Props = {
  children: React.ReactNode
}

const CompanyDashboard = ({children}: Props) => {
  return (
    <div className="relative md:ml-64 w-full bg-[#0b0f19] min-h-screen">
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