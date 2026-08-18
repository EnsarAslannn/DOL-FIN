import axiosInstance from "../Helpers/AxiosInstance"

export const searchStocksBySymbolAPI = (symbol: string) => {
    return axiosInstance.get("stock", { params: { Symbol: symbol } })
}

export const searchStocksByCompanyNameAPI = (companyName: string) => {
    return axiosInstance.get("stock", { params: { CompanyName: companyName } })
}

/**
 * Every stock the local database knows about.
 *
 * The discussion board needs this twice over: to populate the ticker picker
 * on the form, and to resolve a comment's `stockId` back into the symbol its
 * row displays. Page size is the server's maximum, so a growing stock table
 * does not quietly truncate the picker.
 */
export const getAllStocksAPI = () => {
    return axiosInstance.get("stock", { params: { PageSize: 100, SortBy: "Symbol" } })
}
