import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter, Routes, Route } from "react-router-dom"
import ProtectedRoute from "./ProtectedRoute"
import { useAuth } from "../Context/useAuth"

vi.mock("../Context/useAuth")

const Secret = () => <div>account balance</div>
const Login = () => <div>login form</div>

const renderAt = (path: string) =>
    render(
        <MemoryRouter initialEntries={[path]}>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                    path="/wallet"
                    element={
                        <ProtectedRoute>
                            <Secret />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </MemoryRouter>,
    )

const mockLoggedIn = (value: boolean) => {
    vi.mocked(useAuth).mockReturnValue({
        isLoggedIn: () => value,
    } as unknown as ReturnType<typeof useAuth>)
}

describe("ProtectedRoute", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("renders the guarded page for a signed-in user", () => {
        mockLoggedIn(true)

        renderAt("/wallet")

        expect(screen.getByText("account balance")).toBeInTheDocument()
    })

    it("redirects an anonymous visitor to the login page", () => {
        mockLoggedIn(false)

        renderAt("/wallet")

        expect(screen.getByText("login form")).toBeInTheDocument()
    })

    it("does not leak the guarded content while redirecting", () => {
        mockLoggedIn(false)

        renderAt("/wallet")

        expect(screen.queryByText("account balance")).not.toBeInTheDocument()
    })
})
