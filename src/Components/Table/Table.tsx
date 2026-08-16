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
                            className="whitespace-nowrap border-b border-mist-gray p-4 font-mono text-body font-normal text-carbon-black"
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
                className="border-b border-mist-gray p-4 text-left font-mono text-caption font-bold uppercase tracking-[0.16em] text-zinc-gray"
                key={`header-${index}`}
            >
                {col.label}
            </th>
        )
    })

    return (
        <div className="overflow-hidden rounded-card border border-mist-gray bg-paper-white p-4 sm:p-6">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-mist-gray text-left font-sans">
                    <thead className="bg-fog-gray">
                        <tr>{renderedHeaders}</tr>
                    </thead>
                    <tbody className="divide-y divide-mist-gray">{renderedRows}</tbody>
                </table>
            </div>
        </div>
    )
}

export default Table
