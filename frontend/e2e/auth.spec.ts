import { test, expect } from "@playwright/test"

test.describe("authentication flow", () => {
    test("redirects an unauthenticated visitor from a protected page to login", async ({ page }) => {
        await page.route("**/api/account/profile", (route) =>
            route.fulfill({ status: 401, body: "" }),
        )

        await page.goto("/search")

        await expect(page).toHaveURL(/\/login$/)
    })

    test("shows validation errors when submitting the login form empty", async ({ page }) => {
        await page.route("**/api/account/profile", (route) =>
            route.fulfill({ status: 401, body: "" }),
        )

        await page.goto("/login")
        await page.getByRole("button", { name: "Sign In" }).click()

        await expect(page.getByText("Username is required")).toBeVisible()
        await expect(page.getByText("Password is required")).toBeVisible()
    })

    test("logs in successfully and lands on the search page", async ({ page }) => {
        const user = { userName: "e2e_test_user", email: "e2e@test.com", walletBalance: 0 }

        await page.route("**/api/account/profile", (route) =>
            route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(user) }),
        )
        await page.route("**/api/account/login", (route) =>
            route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(user) }),
        )
        await page.route("**/api/stock/trends", (route) =>
            route.fulfill({ status: 404, body: "" }),
        )
        await page.route("**/api/portfolio", (route) =>
            route.fulfill({ status: 200, contentType: "application/json", body: "[]" }),
        )

        await page.goto("/login")
        await page.getByLabel("Username").fill("e2e_test_user")
        await page.getByLabel("Password").fill("TestPassword1234!@#")
        await page.getByRole("button", { name: "Sign In" }).click()

        await expect(page).toHaveURL(/\/search$/)
    })
})
