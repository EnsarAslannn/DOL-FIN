import { createContext, useEffect, useState } from "react"
import type { UserProfile } from "../Models/User"
import { useNavigate } from "react-router"
import { getProfileAPI, loginAPI, logoutAPI, registerAPI } from "../Services/AuthService"
import { toast } from "react-toastify"
import React from "react"

type UserContextType = {
    user: UserProfile | null
    registerUser: (email: string, username: string, password: string) => void
    loginUser: (username: string, password: string) => void
    logout: () => void
    isLoggedIn: () => boolean
    updateWalletBalance: (newBalance: number) => void
}

type Props = { children: React.ReactNode }

const UserContext = createContext<UserContextType>({} as UserContextType)

export const UserProvider = ({ children }: Props) => {
    const navigate = useNavigate()
    const [user, setUser] = useState<UserProfile | null>(null)
    const [isReady, setIsReady] = useState(false)

    useEffect(() => {
        // The JWT lives in an httpOnly cookie, invisible to JS, so the only
        // way to know whether a session is active is to ask the server.
        const restoreSession = async () => {
            const res = await getProfileAPI()
            if (res?.data) {
                setUser(res.data)
                localStorage.setItem("user", JSON.stringify(res.data))
            } else {
                localStorage.removeItem("user")
            }
            setIsReady(true)
        }
        restoreSession()
    }, [])

    const updateWalletBalance = (newBalance: number) => {
        setUser((prev) => {
            if (!prev || prev.walletBalance === newBalance) return prev
            const updated = { ...prev, walletBalance: newBalance }
            localStorage.setItem("user", JSON.stringify(updated))
            return updated
        })
    }

    const registerUser = async (email: string, username: string, password: string) => {
        await registerAPI(email, username, password)
            .then((res) => {
                if (res && res.data) {
                    setUser(res.data)
                    localStorage.setItem("user", JSON.stringify(res.data))
                    toast.success("Registration Success!")

                    setTimeout(() => {
                        navigate("/search")
                    }, 50)
                }
            })
            .catch((e) => {
                console.error(e)
                toast.warning("Server error occurred")
            })
    }

    const loginUser = async (username: string, password: string) => {
        await loginAPI(username, password)
            .then((res) => {
                if (res && res.data) {
                    setUser(res.data)
                    localStorage.setItem("user", JSON.stringify(res.data))
                    toast.success("Login Success!")

                    setTimeout(() => {
                        navigate("/search")
                    }, 50)
                }
            })
            .catch((e) => {
                console.error(e)
                toast.warning("Server error occurred")
            })
    }

    const isLoggedIn = () => {
        return !!user
    }

    const logout = () => {
        logoutAPI().finally(() => {
            localStorage.removeItem("user")
            setUser(null)
            navigate("/")
        })
    }

    return (
        <UserContext.Provider
            value={{ loginUser, user, logout, isLoggedIn, registerUser, updateWalletBalance }}
        >
            {isReady ? children : null}
        </UserContext.Provider>
    )
}

export const useAuth = () => React.useContext(UserContext)
