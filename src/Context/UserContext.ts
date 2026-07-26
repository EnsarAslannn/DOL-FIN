import { createContext } from "react"
import type { UserProfile } from "../Models/User"

export type UserContextType = {
    user: UserProfile | null
    registerUser: (email: string, username: string, password: string) => void
    loginUser: (username: string, password: string) => void
    logout: () => void
    isLoggedIn: () => boolean
    updateWalletBalance: (newBalance: number) => void
}

export const UserContext = createContext<UserContextType>({} as UserContextType)
