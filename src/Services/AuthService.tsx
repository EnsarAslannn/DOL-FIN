import axiosInstance from "../Helpers/AxiosInstance"
import { handleError } from "../Helpers/ErrorHandler"
import type { UserProfileToken } from "../Models/User"

export const loginAPI = async (username: string, password: string) => {
  try {
    const data = await axiosInstance.post<UserProfileToken>("account/login", {
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
    const data = await axiosInstance.post<UserProfileToken>("account/register", {
      username: username,
      password: password,
      email: email,
    })
    return data
  } catch (error) {
    handleError(error)
  }
}