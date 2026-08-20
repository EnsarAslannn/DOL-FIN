import axiosInstance from "../Helpers/AxiosInstance"

export const searchStocksBySymbolAPI = (symbol: string) => {
    return axiosInstance.get("stock", { params: { Symbol: symbol } })
}

export const searchStocksByCompanyNameAPI = (companyName: string) => {
    return axiosInstance.get("stock", { params: { CompanyName: companyName } })
}

export const getAllStocksAPI = () => {
    return axiosInstance.get("stock", { params: { PageSize: 100, SortBy: "Symbol" } })
}
