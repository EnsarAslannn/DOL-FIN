type Props = {
    config: any
    data: any
}

const Table = ({ config, data }: Props) => {
    const renderedRows = data.map((company: any, rowIndex: number) => {
        const rowKey = `row-${company.symbol || "stock"}-${rowIndex}`

        return (
            <tr
                key={rowKey}
                className="hover:bg-[#1c2331] transition-colors duration-100"
            >
                {config.map((val: any, idx: number) => {
                    return (
                        <td
                            key={`cell-${rowIndex}-${idx}`}
                            className="p-4 text-xs font-semibold text-gray-200 font-mono whitespace-nowrap border-b border-gray-800/30"
                        >
                            {val.render(company)}
                        </td>
                    )
                })}
            </tr>
        )
    })

    const renderedHeaders = config.map((configItem: any, index: number) => {
        return (
            <th
                className="p-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-800/60"
                key={`header-${index}`}
            >
                {configItem.label}
            </th>
        )
    })

    return (
        <div className="bg-[#141a26] shadow-xl rounded-2xl p-4 sm:p-6 border border-gray-800/60 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-800/40 text-left font-sans">
                    <thead className="bg-[#111622]">
                        <tr>{renderedHeaders}</tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/20">{renderedRows}</tbody>
                </table>
            </div>
        </div>
    )
}

export default Table
