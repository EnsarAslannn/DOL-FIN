import React from 'react'

type Props = {
  children: React.ReactNode
}

/**
 * The company layout's content column.
 *
 * Deliberately carries no horizontal padding and no inner container: its
 * children are full-bleed bands now, and each one supplies its own content
 * grid. A wrapper with `px-8` here would inset every band's *background*, so
 * the alternating grounds would stop meeting the edge and read as a stack of
 * wide cards instead of as bands.
 *
 * `md:ml-64` mirrors the sidebar's `w-64`. The bands run edge to edge inside
 * this column rather than across the whole viewport — the 256px to the left
 * belongs to the sidebar, which paints its own ground over anything beneath
 * it, so extending them further would change nothing you can see.
 *
 * `pt-16` clears the fixed navbar; vertical rhythm below that is each band's
 * own business.
 */
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
