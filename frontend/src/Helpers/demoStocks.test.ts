import { describe, it, expect } from "vitest"
import { DEMO_TICKERS, isDemoTicker } from "./demoStocks"

// isDemoTicker gates whether a page renders financial statements or the
// "not available in this demo" panel, so a false negative silently hides
// data that the app actually carries.
describe("isDemoTicker", () => {
    it.each(DEMO_TICKERS)("accepts %s", (ticker) => {
        expect(isDemoTicker(ticker)).toBe(true)
    })

    it.each(["aapl", "Aapl", "tSLa"])("is case-insensitive for %s", (ticker) => {
        expect(isDemoTicker(ticker)).toBe(true)
    })

    it.each([" AAPL", "AAPL ", "  MSFT  "])(
        "ignores surrounding whitespace in %s",
        (ticker) => {
            expect(isDemoTicker(ticker)).toBe(true)
        },
    )

    it.each(["AMZN", "META", "NFLX", "ZZZZ"])(
        "rejects %s, which the demo data set does not carry",
        (ticker) => {
            expect(isDemoTicker(ticker)).toBe(false)
        },
    )

    it.each([undefined, null, ""])("rejects %s without throwing", (ticker) => {
        expect(isDemoTicker(ticker)).toBe(false)
    })

    it("covers exactly the five companies the README advertises", () => {
        expect([...DEMO_TICKERS].sort()).toEqual(
            ["AAPL", "GOOGL", "MSFT", "NVDA", "TSLA"].sort(),
        )
    })
})
