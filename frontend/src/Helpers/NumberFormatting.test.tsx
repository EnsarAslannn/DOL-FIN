import { describe, it, expect } from "vitest"
import {
    formatLargeMonetaryNumber,
    formatLargeNonMonetaryNumber,
    formatRatio,
} from "./NumberFormatting"

describe("formatLargeMonetaryNumber", () => {
    it.each([
        [0, "$0"],
        [1, "$1"],
        [999, "$999"],
    ])("prints %s under a thousand as %s", (input, expected) => {
        expect(formatLargeMonetaryNumber(input)).toBe(expected)
    })

    it.each([
        [1_000, "$1.0K"],
        [1_500, "$1.5K"],
        [999_999, "$1000.0K"],
        [1_000_000, "$1.0M"],
        [2_500_000, "$2.5M"],
        [1_000_000_000, "$1.0B"],
        [3_400_000_000, "$3.4B"],
        [1_000_000_000_000, "$1.0T"],
        [2_950_000_000_000, "$3.0T"],
    ])("abbreviates %s as %s", (input, expected) => {
        expect(formatLargeMonetaryNumber(input)).toBe(expected)
    })

    it.each([
        [-500, "-$500"],
        [-1_500, "-$1.5K"],
        [-2_500_000, "-$2.5M"],
        [-3_400_000_000, "-$3.4B"],
    ])("moves the sign outside the currency symbol: %s -> %s", (input, expected) => {
        expect(formatLargeMonetaryNumber(input)).toBe(expected)
    })

    it("rounds to a single decimal place", () => {
        expect(formatLargeMonetaryNumber(1_234_567)).toBe("$1.2M")
        expect(formatLargeMonetaryNumber(1_250_000)).toBe("$1.3M")
    })

    // Documented limits rather than endorsements: the branch chain stops at
    // one quadrillion and has no NaN guard, so both fall through to
    // undefined. Card.tsx and CompanyPage.tsx already render `?? "—"` for
    // exactly this reason; table cells elsewhere would come out blank.
    it("returns undefined above its largest unit", () => {
        expect(formatLargeMonetaryNumber(1e15)).toBeUndefined()
    })

    it("returns undefined for NaN rather than printing it", () => {
        expect(formatLargeMonetaryNumber(NaN)).toBeUndefined()
    })
})

describe("formatLargeNonMonetaryNumber", () => {
    it("returns small values as an unformatted number, not a string", () => {
        expect(formatLargeNonMonetaryNumber(42)).toBe(42)
    })

    it.each([
        [1_000, "1.0K"],
        [2_500_000, "2.5M"],
        [3_400_000_000, "3.4B"],
        [1_000_000_000_000, "1.0T"],
    ])("abbreviates %s as %s without a currency symbol", (input, expected) => {
        expect(formatLargeNonMonetaryNumber(input)).toBe(expected)
    })

    it("keeps the sign in front for negatives", () => {
        expect(formatLargeNonMonetaryNumber(-2_500_000)).toBe("-2.5M")
    })

    it("returns undefined above its largest unit", () => {
        expect(formatLargeNonMonetaryNumber(1e15)).toBeUndefined()
    })
})

describe("formatRatio", () => {
    it.each([
        [1, "1.00"],
        [2.5, "2.50"],
        [0, "0.00"],
    ])("always shows two decimal places: %s -> %s", (input, expected) => {
        expect(formatRatio(input)).toBe(expected)
    })

    it("rounds to two decimal places", () => {
        expect(formatRatio(3.14159)).toBe("3.14")
        expect(formatRatio(2.675)).toBe("2.68")
        expect(formatRatio(1.004)).toBe("1.00")
    })

    // 1.005 * 100 is 100.49999999999999 in IEEE-754, so Math.round takes it
    // down rather than up. Pinned because it looks like an off-by-one bug on
    // sight and is really just binary floating point.
    it("rounds a x.xx5 ratio down where the binary representation falls short", () => {
        expect(formatRatio(1.005)).toBe("1.00")
    })

    it("keeps negative ratios negative", () => {
        expect(formatRatio(-0.25)).toBe("-0.25")
    })
})
