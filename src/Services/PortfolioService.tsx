import axios from "axios"
import type { PortfolioGet } from "../Models/Portfolio"
import { handleError } from "../Helpers/ErrorHandler"

const api = `${import.meta.env.VITE_API_URL}/api/portfolio/`

export const portfolioAddAPI = async (symbol: string, quantity: number) => {
    try {
        const data = await axios.post<{ message: string; newBalance: number }>(
            api,
            null,
            {
                params: {
                    symbol: symbol,
                    quantity: quantity
                }
            }
        )
        return data
    } catch (error) {
        handleError(error)
    }
}

export const portfolioSellAPI = async (symbol: string, quantity: number) => {
    try {
        const data = await axios.post<{ message: string; newBalance: number }>(
            api + "sell",
            null,
            {
                params: {
                    symbol: symbol,
                    quantity: quantity
                }
            }
        )
        return data
    } catch (error) {
        handleError(error)
    }
}

export const portfolioGetAPI = async () => {
    try {
        const data = await axios.get<PortfolioGet[]>(api)
        return data
    } catch (error) {
        handleError(error)
    }
}

export const portfolioDepositAPI = async (amount: number) => {
    try {
        const data = await axios.post<{ message: string; newBalance: number }>(
            api + "deposit",
            null,
            {
                params: {
                    amount: amount
                }
            }
        )
        return data
    } catch (error) {
        handleError(error)
    }
}

export const portfolioWithdrawAPI = async (amount: number) => {
    try {
        const data = await axios.post<{ message: string; newBalance: number }>(
            api + "withdraw",
            null,
            {
                params: {
                    amount: amount
                }
            }
        )
        return data
    } catch (error) {
        handleError(error)
    }
}

export const marketTrendsAPI = async () => {
    try {
        const token = localStorage.getItem("token")
        const data = await axios.get<any[]>(`${import.meta.env.VITE_API_URL}/api/stock/trends`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        return data
    } catch (error) {
        handleError(error)
    }
}