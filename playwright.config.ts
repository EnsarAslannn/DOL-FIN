import { defineConfig, devices } from "@playwright/test"

// These are true end-to-end browser tests, distinct from the Vitest unit
// suite in src/ -- they drive a real Chromium instance against the built
// app and assert on rendered UI/navigation, with backend calls intercepted
// via Playwright's network mocking so CI doesn't need a live API + database.
export default defineConfig({
    testDir: "./e2e",
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    reporter: "list",
    use: {
        baseURL: "http://localhost:4173",
        trace: "on-first-retry",
    },
    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] },
        },
    ],
    webServer: {
        command: "npm run preview -- --port 4173",
        url: "http://localhost:4173",
        reuseExistingServer: !process.env.CI,
        timeout: 30_000,
    },
})
