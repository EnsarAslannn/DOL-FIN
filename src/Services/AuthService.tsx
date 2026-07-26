import axiosInstance from "../Helpers/AxiosInstance"
import { handleError } from "../Helpers/ErrorHandler"
import type { UserProfile } from "../Models/User"

export const loginAPI = async (username: string, password: string) => {
  try {
    const data = await axiosInstance.post<UserProfile>("account/login", {
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
    const data = await axiosInstance.post<UserProfile>("account/register", {
      username: username,
      password: password,
      email: email,
    })
    return data
  } catch (error) {
    handleError(error)
  }
}

export const logoutAPI = async () => {
  try {
    await axiosInstance.post("account/logout")
  } catch (error) {
    console.error(error)
  }
}

// Silent auth check used on app mount — a 401 here just means "not logged
// in yet", not an error, so it deliberately skips handleError's toast/redirect.
export const getProfileAPI = async () => {
  try {
    const data = await axiosInstance.get<UserProfile>("account/profile")
    return data
  } catch {
    return undefined
  }
}