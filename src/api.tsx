import {
    testBalanceSheetData,
    testCashFlowData,
    testCompanyPeers,
    testIncomeStatementData,
    testKeyMetricsData,
    testTenKData,
} from "./Components/Table/TestData"

import { mockSearchData, mockProfileData } from "./Components/Table/TestData"

export const searchCompanies = async (query: string) => {
    const filtered = mockSearchData.filter(
        (c) =>
            c.symbol.toLowerCase().includes(query.toLowerCase()) ||
            c.name.toLowerCase().includes(query.toLowerCase()),
    )

    return { data: filtered }
}

export const getCompanyProfile = async (query: string) => {
    const profile = mockProfileData[query.toUpperCase()]

    return profile ? { data: [profile] } : { data: [] }
}

export const getKeyMetrics = async (query: string) => {
    try {
        const data = testKeyMetricsData[query.toUpperCase()] || []

        return { data: data }
    } catch (error: any) {
        console.log("Key Metrics API error: ", error.message)

        return "Unable to connect API"
    }
}

export const getIncomeStatement = async (query: string) => {
    try {
        const data = testIncomeStatementData.filter(
            (item) => item.symbol.toLowerCase() === query.toLowerCase(),
        )

        return { data: data }
    } catch (error: any) {
        console.log("Key Metrics API error: ", error.message)

        return "Unable to connect API"
    }
}

export const getBalanceSheet = async (query: string) => {
    try {
        const data = testBalanceSheetData.filter(
            (item) => item.symbol.toLowerCase() === query.toLowerCase(),
        )

        return { data: data }
    } catch (error: any) {
        console.log("Key Metrics API error: ", error.message)

        return "Unable to connect API"
    }
}

export const getCashFlowStatement = async (query: string) => {
    try {
        const data = testCashFlowData.filter(
            (item) => item.symbol.toLowerCase() === query.toLowerCase(),
        )

        return { data: data }
    } catch (error: any) {
        console.log("Key Metrics API error: ", error.message)

        return "Unable to connect API"
    }
}

export const getCompanyPeers = async (query: string) => {
    try {
        const peers = testCompanyPeers[query.toUpperCase()]

        const response = {
            data: peers,
        }

        return response
    } catch (error: any) {
        console.log("Key Metrics API error: ", error.message)

        return "Unable to connect API"
    }
}

export const getTenK = async (query: string) => {
    try {
        const tenKData = testTenKData[query.toUpperCase()]

        const response = {
            data: tenKData ? tenKData : [],
        }

        return response
    } catch (error: any) {
        console.log("TenK Finder API error: ", error.message)

        return "Unable to connect API"
    }
}
