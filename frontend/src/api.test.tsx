import { describe, it, expect, vi, afterEach } from "vitest"
import {
    searchCompanies,
    getCompanyProfile,
    getKeyMetrics,
    getIncomeStatement,
    getBalanceSheet,
    getCashFlowStatement,
    getCompanyPeers,
    getTenK,
} from "./api"

// Every reader here must resolve to the same { data: [...] } shape. An earlier
// version returned the string "Unable to connect API" on failure, which forced
// each calling component to carry a `typeof result !== "string"` guard before
// touching .data. These tests pin the shape so that never comes back.
const readers = [
    ["searchCompanies", searchCompanies],
    ["getCompanyProfile", getCompanyProfile],
    ["getKeyMetrics", getKeyMetrics],
    ["getIncomeStatement", getIncomeStatement],
    ["getBalanceSheet", getBalanceSheet],
    ["getCashFlowStatement", getCashFlowStatement],
    ["getCompanyPeers", getCompanyPeers],
    ["getTenK", getTenK],
] as const

describe("demo data API", () => {
    afterEach(() => {
        vi.restoreAllMocks()
    })

    describe.each(readers)("%s", (_name, read) => {
        it("returns an object with a data array for a known ticker", async () => {
            const result = await read("AAPL")

            expect(result).toHaveProperty("data")
            expect(Array.isArray(result.data)).toBe(true)
        })

        it("returns an empty array rather than throwing for an unknown ticker", async () => {
            const result = await read("NOPE")

            expect(Array.isArray(result.data)).toBe(true)
            expect(result.data).toHaveLength(0)
        })

        it("never resolves to a bare string", async () => {
            const result = await read("AAPL")

            expect(typeof result).not.toBe("string")
        })
    })

    describe("ticker casing", () => {
        it.each(["aapl", "AAPL", "AaPl"])(
            "resolves key metrics for %s regardless of case",
            async (ticker) => {
                const result = await getKeyMetrics(ticker)

                expect(result.data.length).toBeGreaterThan(0)
            },
        )

        it("resolves statements filed under a lower-case ticker", async () => {
            const upper = await getIncomeStatement("AAPL")
            const lower = await getIncomeStatement("aapl")

            expect(lower.data).toHaveLength(upper.data.length)
            expect(upper.data.length).toBeGreaterThan(0)
        })
    })

    describe("searchCompanies", () => {
        it("matches on ticker symbol", async () => {
            const result = await searchCompanies("AAPL")

            expect(result.data.map((c) => c.symbol)).toContain("AAPL")
        })

        it("matches on company name, case-insensitively", async () => {
            const result = await searchCompanies("apple")

            expect(result.data.map((c) => c.symbol)).toContain("AAPL")
        })

        it("returns every company for an empty query", async () => {
            const result = await searchCompanies("")

            expect(result.data.length).toBeGreaterThan(0)
        })

        it("returns an empty list when nothing matches", async () => {
            const result = await searchCompanies("zzzzzzz")

            expect(result.data).toHaveLength(0)
        })
    })

    describe("getCompanyProfile", () => {
        it("wraps a single profile in an array", async () => {
            const result = await getCompanyProfile("AAPL")

            expect(result.data).toHaveLength(1)
            expect(result.data[0]).toBeTruthy()
        })

        it("returns an empty array for a company it does not carry", async () => {
            const result = await getCompanyProfile("NOPE")

            expect(result.data).toHaveLength(0)
        })
    })

    describe("getCompanyPeers", () => {
        it("lists peers for a demo ticker", async () => {
            const result = await getCompanyPeers("AAPL")

            expect(result.data.length).toBeGreaterThan(0)
            expect(result.data).not.toContain("AAPL")
        })
    })

    describe("failure handling", () => {
        it("logs and falls back to an empty result instead of rejecting", async () => {
            const consoleError = vi
                .spyOn(console, "error")
                .mockImplementation(() => {})

            // A non-string argument makes the internal .toUpperCase() throw,
            // standing in for whatever a real transport failure would be.
            const result = await getKeyMetrics(
                undefined as unknown as string,
            )

            expect(result.data).toHaveLength(0)
            expect(consoleError).toHaveBeenCalledOnce()
        })

        it("names the failing reader in the log line", async () => {
            const consoleError = vi
                .spyOn(console, "error")
                .mockImplementation(() => {})

            await getBalanceSheet(undefined as unknown as string)

            expect(consoleError.mock.calls[0][0]).toContain("Balance Sheet")
        })
    })
})
