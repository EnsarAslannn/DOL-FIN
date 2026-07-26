import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import type { AxiosResponse } from "axios"
import { MemoryRouter } from "react-router"
import { UserProvider, useAuth } from "./useAuth"
import * as AuthService from "../Services/AuthService"
import type { UserProfileToken } from "../Models/User"

vi.mock("../Services/AuthService")
vi.mock("react-toastify", () => ({
    toast: { success: vi.fn(), warning: vi.fn() },
}))

function TestConsumer() {
    const { loginUser, logout, user, isLoggedIn } = useAuth()
    return (
        <div>
            <button onClick={() => loginUser("bob", "pw")}>login</button>
            <button onClick={logout}>logout</button>
            <span data-testid="status">{isLoggedIn() ? "in" : "out"}</span>
            <span data-testid="username">{user?.userName ?? ""}</span>
        </div>
    )
}

const renderWithProvider = () =>
    render(
        <MemoryRouter>
            <UserProvider>
                <TestConsumer />
            </UserProvider>
        </MemoryRouter>,
    )

describe("useAuth", () => {
    beforeEach(() => {
        localStorage.clear()
        vi.clearAllMocks()
    })

    it("stores token and user in localStorage after a successful login", async () => {
        vi.mocked(AuthService.loginAPI).mockResolvedValue({
            data: {
                userName: "bob",
                email: "bob@test.com",
                token: "tok123",
                walletBalance: 100,
            },
            status: 200,
            statusText: "OK",
            headers: {},
            config: {} as AxiosResponse<UserProfileToken>["config"],
        })

        renderWithProvider()

        await userEvent.click(await screen.findByText("login"))

        await waitFor(() => expect(localStorage.getItem("token")).toBe("tok123"))
        expect(JSON.parse(localStorage.getItem("user")!).userName).toBe("bob")
        expect(screen.getByTestId("status").textContent).toBe("in")
    })

    it("does not store credentials when login fails", async () => {
        vi.mocked(AuthService.loginAPI).mockResolvedValue(undefined)

        renderWithProvider()

        await userEvent.click(await screen.findByText("login"))

        expect(localStorage.getItem("token")).toBeNull()
        expect(screen.getByTestId("status").textContent).toBe("out")
    })

    it("clears localStorage and auth state on logout", async () => {
        localStorage.setItem("token", "tok123")
        localStorage.setItem(
            "user",
            JSON.stringify({ userName: "bob", email: "bob@test.com", walletBalance: 0 }),
        )

        renderWithProvider()

        await waitFor(() =>
            expect(screen.getByTestId("status").textContent).toBe("in"),
        )

        await userEvent.click(screen.getByText("logout"))

        expect(localStorage.getItem("token")).toBeNull()
        expect(localStorage.getItem("user")).toBeNull()
        expect(screen.getByTestId("status").textContent).toBe("out")
    })
})
