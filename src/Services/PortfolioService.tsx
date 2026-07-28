import axiosInstance from "../Helpers/AxiosInstance"
import type { PortfolioGet } from "../Models/Portfolio"
import type { StockSearchResult } from "../Models/StockSearchResult"
import { handleError } from "../Helpers/ErrorHandler"

export const portfolioAddAPI = async (symbol: string, quantity: number) => {
    try {
        const data = await axiosInstance.post<{ message: string; newBalance: number }>(
            "portfolio",
            { symbol, quantity }
        )
        return data
    } catch (error) {
        handleError(error)
    }
}

export const portfolioSellAPI = async (symbol: string, quantity: number) => {
    try {
        const data = await axiosInstance.post<{ message: string; newBalance: number }>(
            "portfolio/sell",
            { symbol, quantity }
        )
        return data
    } catch (error) {
        handleError(error)
    }
}

export const portfolioGetAPI = async () => {
    try {
        const data = await axiosInstance.get<PortfolioGet[]>("portfolio")
        return data
    } catch (error) {
        handleError(error)
    }
}

export const portfolioDepositAPI = async (amount: number) => {
    try {
        const data = await axiosInstance.post<{ message: string; newBalance: number }>(
            "portfolio/deposit",
            { amount }
        )
        return data
    } catch (error) {
        handleError(error)
    }
}

export const portfolioWithdrawAPI = async (amount: number) => {
    try {
        const data = await axiosInstance.post<{ message: string; newBalance: number }>(
            "portfolio/withdraw",
            { amount }
        )
        return data
    } catch (error) {
        handleError(error)
    }
}

export const marketTrendsAPI = async () => {
    try {
        const data = await axiosInstance.get<StockSearchResult[]>("stock/trends")
        return data
    } catch (error) {
        handleError(error)
    }
}