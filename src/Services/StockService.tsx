import axiosInstance from "../Helpers/AxiosInstance"

export const searchStocksBySymbolAPI = (symbol: string) => {
    return axiosInstance.get("stock", { params: { Symbol: symbol } })
}

export const searchStocksByCompanyNameAPI = (companyName: string) => {
    return axiosInstance.get("stock", { params: { CompanyName: companyName } })
}
