import type { ReactNode } from "react"

export type TableColumn<T> = {
    label: ReactNode
    render: (row: T) => ReactNode
}

type Props<T> = {
    config: TableColumn<T>[]
    data: T[]
}

const Table = <T extends { symbol?: string }>({ config, data }: Props<T>) => {
    const renderedRows = data.map((company, rowIndex) => {
        const rowKey = `row-${company.symbol || "stock"}-${rowIndex}`

        return (
            <tr
                key={rowKey}
                className="hover:bg-fog-gray transition-colors duration-100"
            >
                {config.map((col, idx) => {
                    return (
                        <td
                            key={`cell-${rowIndex}-${idx}`}
                            className="whitespace-nowrap border-b border-mist-gray px-4 py-4 font-mono text-body font-normal text-carbon-black first:pl-0 last:pr-0"
                        >
                            {col.render(company)}
                        </td>
                    )
                })}
            </tr>
        )
    })

    const renderedHeaders = config.map((col, index) => {
        return (
            <th
                className="whitespace-nowrap border-b border-carbon-black px-4 pb-4 text-left font-mono text-caption font-bold uppercase tracking-label-lg text-carbon-black first:pl-0 last:pr-0"
                key={`header-${index}`}
            >
                {col.label}
            </th>
        )
    })

    return (
        // No card, no fill. A heavy rule under the header and hairlines between
        // rows — the ledger reads as a ledger rather than as a widget in a box.
        <div className="w-full overflow-x-auto">
            <table className="min-w-full text-left font-sans">
                <thead>
                    <tr>{renderedHeaders}</tr>
                </thead>
                <tbody>{renderedRows}</tbody>
            </table>
        </div>
    )
}

export default Table
