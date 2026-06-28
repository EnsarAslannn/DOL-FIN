import axios from "axios"
import type { PortfolioGet } from "../Models/Portfolio"
import { handleError } from "../Helpers/ErrorHandler"

const getApiURL = () => {
    let url = import.meta.env.VITE_API_URL || "https://localhost:7109"
    if (url.endsWith("/")) {
        url = url.slice(0, -1)
    }
    return `${url}/api/portfolio/`
}

export const portfolioAddAPI = async (symbol: string, quantity: number) => {
    try {
        const token = localStorage.getItem("token")
        const headers: Record<string, string> = {}
        if (token) headers["Authorization"] = `Bearer ${token.trim()}`

        const data = await axios.post<{ message: string; newBalance: number }>(
            getApiURL(),
            null,
            {
                params: { symbol, quantity },
                headers: Object.keys(headers).length ? headers : undefined
            }
        )
        return data
    } catch (error) {
        handleError(error)
    }
}

export const portfolioSellAPI = async (symbol: string, quantity: number) => {
    try {
        const token = localStorage.getItem("token")
        const headers: Record<string, string> = {}
        if (token) headers["Authorization"] = `Bearer ${token.trim()}`

        const data = await axios.post<{ message: string; newBalance: number }>(
            getApiURL() + "sell",
            null,
            {
                params: { symbol, quantity },
                headers: Object.keys(headers).length ? headers : undefined
            }
        )
        return data
    } catch (error) {
        handleError(error)
    }
}

export const portfolioGetAPI = async () => {
    try {
        const token = localStorage.getItem("token")
        const headers: Record<string, string> = {}
        if (token) headers["Authorization"] = `Bearer ${token.trim()}`

        const data = await axios.get<PortfolioGet[]>(getApiURL(), {
            headers: Object.keys(headers).length ? headers : undefined
        })
        return data
    } catch (error) {
        handleError(error)
    }
}

export const portfolioDepositAPI = async (amount: number) => {
    try {
        const token = localStorage.getItem("token")
        const headers: Record<string, string> = {}
        if (token) headers["Authorization"] = `Bearer ${token.trim()}`

        const data = await axios.post<{ message: string; newBalance: number }>(
            getApiURL() + "deposit",
            null,
            {
                params: { amount },
                headers: Object.keys(headers).length ? headers : undefined
            }
        )
        return data
    } catch (error) {
        handleError(error)
    }
}

export const portfolioWithdrawAPI = async (amount: number) => {
    try {
        const token = localStorage.getItem("token")
        const headers: Record<string, string> = {}
        if (token) headers["Authorization"] = `Bearer ${token.trim()}`

        const data = await axios.post<{ message: string; newBalance: number }>(
            getApiURL() + "withdraw",
            null,
            {
                params: { amount },
                headers: Object.keys(headers).length ? headers : undefined
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
        const headers: Record<string, string> = {}
        if (token) headers["Authorization"] = `Bearer ${token.trim()}`

        const data = await axios.get<any[]>(`${import.meta.env.VITE_API_URL}/api/stock/trends`, {
            headers: Object.keys(headers).length ? headers : undefined
        })
        return data
    } catch (error) {
        handleError(error)
    }
}