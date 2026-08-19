import { test, expect } from "@playwright/test"

test.describe("portfolio flow", () => {
    test("user can buy a stock and see it in portfolio", async ({ page }) => {
        const user = { userName: "e2e_test_user", email: "e2e@test.com", walletBalance: 10000 }
        let bought = false

        await page.route("**/api/account/profile", (route) =>
            route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(user) }),
        )
        await page.route("**/api/stock/trends", (route) =>
            route.fulfill({ status: 404, body: "" }),
        )
        await page.route("**/api/stock?**", (route) =>
            route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify([
                    { symbol: "TSLA", companyName: "Tesla Inc", purchase: 250, industry: "Automotive", marketCap: 800000000000 },
                ]),
            }),
        )
        await page.route("**/api/portfolio", (route) => {
            if (route.request().method() === "POST") {
                bought = true
                return route.fulfill({
                    status: 200,
                    contentType: "application/json",
                    body: JSON.stringify({ message: "Purchased", newBalance: 9750 }),
                })
            }

            return route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify(
                    bought
                        ? [{ id: 1, symbol: "TSLA", companyName: "Tesla Inc", purchase: 250, lastDiv: 0, industry: "Automotive", marketCap: 800000000000, quantity: 1, averagePrice: 250 }]
                        : [],
                ),
            })
        })

        await page.goto("/search")
        await page.getByPlaceholder(/search companies/i).fill("TSLA")
        await page.getByRole("button", { name: /^search$/i }).click()

        await page.getByRole("button", { name: /^add$/i }).click()
        await page.getByRole("button", { name: /confirm buy/i }).click()

        await expect(page.getByText(/1 shares/i)).toBeVisible()
        await expect(page.getByText("$9750.00")).toBeVisible()
    })

    test("user can sell a stock from portfolio", async ({ page }) => {
        const user = { userName: "e2e_test_user", email: "e2e@test.com", walletBalance: 5000 }
        let sold = false

        await page.route("**/api/account/profile", (route) =>
            route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(user) }),
        )
        await page.route("**/api/portfolio/sell", (route) => {
            sold = true
            return route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify({ message: "Sold", newBalance: 5250 }),
            })
        })
        await page.route("**/api/portfolio", (route) => {
            if (route.request().method() !== "GET") return route.continue()

            return route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify([
                    { id: 1, symbol: "TSLA", companyName: "Tesla Inc", purchase: 250, lastDiv: 0, industry: "Automotive", marketCap: 800000000000, quantity: sold ? 1 : 2, averagePrice: 250 },
                ]),
            })
        })

        await page.goto("/wallet")

        const tslaRow = page.getByRole("row", { name: /tsla/i })
        await expect(tslaRow.getByText("$500.00")).toBeVisible()
        await tslaRow.getByRole("button", { name: /^sell$/i }).click()

        await page.getByRole("button", { name: /confirm sell/i }).click()

        await expect(page.getByText(/asset converted to cash successfully/i)).toBeVisible()
        await expect(tslaRow.getByText("$250.00").last()).toBeVisible()
    })

    test("user can add a comment on a stock", async ({ page }) => {
        const user = { userName: "e2e_test_user", email: "e2e@test.com", walletBalance: 5000 }
        let posted = false

        await page.route("**/api/account/profile", (route) =>
            route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(user) }),
        )
        await page.route("**/api/stock?**", (route) =>
            route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify([
                    { id: 42, symbol: "TSLA", companyName: "Tesla Inc", purchase: 250, industry: "Automotive", marketCap: 800000000000 },
                ]),
            }),
        )
        await page.route("**/api/comment/*", (route) => {
            posted = true
            return route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify({ title: "Bullish", content: "Great stock!" }),
            })
        })
        await page.route("**/api/comment?**", (route) =>
            route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify(
                    posted
                        ? [{ id: 1, title: "Bullish", content: "Great stock!", createdBy: "e2e_test_user", stockId: 42 }]
                        : [],
                ),
            }),
        )
        await page.route("**/api/stock/trends", (route) => route.fulfill({ status: 404, body: "" }))
        await page.route("**/api/portfolio", (route) =>
            route.fulfill({ status: 200, contentType: "application/json", body: "[]" }),
        )

        await page.goto("/search")

        await page.selectOption("#comment-stock", "42")
        await page.getByPlaceholder(/sum it up in a line/i).fill("Bullish")
        await page.getByPlaceholder(/what are you seeing in this name/i).fill("Great stock!")
        await page.getByRole("button", { name: /post comment/i }).click()

        await expect(page.getByText("Great stock!")).toBeVisible()
        await expect(page.getByText(/@e2e_test_user/i)).toBeVisible()
    })

    test("shows error when stock API fails", async ({ page }) => {
        const user = { userName: "e2e_test_user", email: "e2e@test.com", walletBalance: 5000 }

        await page.route("**/api/account/profile", (route) =>
            route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(user) }),
        )
        await page.route("**/api/stock/trends", (route) =>
            route.fulfill({ status: 404, body: "" }),
        )
        await page.route("**/api/portfolio", (route) =>
            route.fulfill({ status: 200, contentType: "application/json", body: "[]" }),
        )
        await page.route("**/api/stock?**", (route) =>
            route.fulfill({ status: 500, body: "" }),
        )

        await page.goto("/search")
        await page.getByPlaceholder(/search companies/i).fill("AAPL")
        await page.getByRole("button", { name: /^search$/i }).click()

        await expect(page.getByText(/unable to connect to local api server/i)).toBeVisible()
    })
})
