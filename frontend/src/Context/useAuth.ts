import { useContext } from "react"
import { UserContext } from "./UserContext"

export const useAuth = () => useContext(UserContext)
