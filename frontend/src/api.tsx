import {
    testBalanceSheetData,
    testCashFlowData,
    testCompanyPeers,
    testIncomeStatementData,
    testKeyMetricsData,
    testTenKData,
} from "./Components/Table/TestData"

import { mockSearchData, mockProfileData } from "./Components/Table/TestData"

// The demo runs on the local data set in TestData.tsx rather than a live
// market data provider, so these read like API calls (async, {data} shaped)
// to keep the calling components unchanged if a real backend is swapped in.
// On failure they log and fall back to an empty result -- never a differently
// shaped value, so callers only ever handle {data}.
const empty = <T,>(label: string, error: unknown): { data: T[] } => {
    console.error(`${label} error: `, error instanceof Error ? error.message : error)

    return { data: [] }
}

export const searchCompanies = async (query: string) => {
    try {
        const filtered = mockSearchData.filter(
            (c) =>
                c.symbol.toLowerCase().includes(query.toLowerCase()) ||
                c.name.toLowerCase().includes(query.toLowerCase()),
        )

        return { data: filtered }
    } catch (error) {
        return empty<(typeof mockSearchData)[number]>("Company Search", error)
    }
}

export const getCompanyProfile = async (query: string) => {
    try {
        const profile = mockProfileData[query.toUpperCase()]

        return { data: profile ? [profile] : [] }
    } catch (error) {
        return empty<(typeof mockProfileData)[string]>("Company Profile", error)
    }
}

export const getKeyMetrics = async (query: string) => {
    try {
        return { data: testKeyMetricsData[query.toUpperCase()] ?? [] }
    } catch (error) {
        return empty<(typeof testKeyMetricsData)[string][number]>("Key Metrics", error)
    }
}

export const getIncomeStatement = async (query: string) => {
    try {
        const data = testIncomeStatementData.filter(
            (item) => item.symbol.toLowerCase() === query.toLowerCase(),
        )

        return { data }
    } catch (error) {
        return empty<(typeof testIncomeStatementData)[number]>("Income Statement", error)
    }
}

export const getBalanceSheet = async (query: string) => {
    try {
        const data = testBalanceSheetData.filter(
            (item) => item.symbol.toLowerCase() === query.toLowerCase(),
        )

        return { data }
    } catch (error) {
        return empty<(typeof testBalanceSheetData)[number]>("Balance Sheet", error)
    }
}

export const getCashFlowStatement = async (query: string) => {
    try {
        const data = testCashFlowData.filter(
            (item) => item.symbol.toLowerCase() === query.toLowerCase(),
        )

        return { data }
    } catch (error) {
        return empty<(typeof testCashFlowData)[number]>("Cash Flow Statement", error)
    }
}

export const getCompanyPeers = async (query: string) => {
    try {
        return { data: testCompanyPeers[query.toUpperCase()] ?? [] }
    } catch (error) {
        return empty<(typeof testCompanyPeers)[string][number]>("Company Peers", error)
    }
}

export const getTenK = async (query: string) => {
    try {
        return { data: testTenKData[query.toUpperCase()] ?? [] }
    } catch (error) {
        return empty<(typeof testTenKData)[string][number]>("TenK Finder", error)
    }
}
