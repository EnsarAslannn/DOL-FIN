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
                className="hover:bg-white/4 transition-colors duration-100"
            >
                {config.map((col, idx) => {
                    return (
                        <td
                            key={`cell-${rowIndex}-${idx}`}
                            className="p-4 text-xs font-semibold text-foam font-mono whitespace-nowrap border-b border-white/6"
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
                className="p-4 text-left text-[10px] font-bold text-mist uppercase tracking-[0.16em] border-b border-white/10 font-mono"
                key={`header-${index}`}
            >
                {col.label}
            </th>
        )
    })

    return (
        <div className="bg-depth rounded-2xl p-4 sm:p-6 border border-white/8 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-white/6 text-left font-sans">
                    <thead className="bg-black/25">
                        <tr>{renderedHeaders}</tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">{renderedRows}</tbody>
                </table>
            </div>
        </div>
    )
}

export default Table
