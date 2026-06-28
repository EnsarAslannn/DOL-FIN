import axios from "axios"
import { handleError } from "../Helpers/ErrorHandler"
import type { UserProfileToken } from "../Models/User"

const getApiURL = () => {
  let url = import.meta.env.VITE_API_URL || "https://localhost:7109"
  if (url.endsWith("/")) {
    url = url.slice(0, -1)
  }
  return `${url}/api/`
}

export const loginAPI = async (username: string, password: string) => {
  try {
    const data = await axios.post<UserProfileToken>(getApiURL() + "account/login", {
      username: username,
      password: password,
    })
    return data
  } catch (error) {
    handleError(error)
  }
}

export const registerAPI = async (
  email: string,
  username: string,
  password: string,
) => {
  try {
    const data = await axios.post<UserProfileToken>(getApiURL() + "account/register", {
      username: username,
      password: password,
      email: email,
    })
    return data
  } catch (error) {
    handleError(error)
  }
}