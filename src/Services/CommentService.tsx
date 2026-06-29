import axiosInstance from "../Helpers/AxiosInstance"
import type { CommentGet, CommentPost } from "../Models/Comment"
import { handleError } from "../Helpers/ErrorHandler"

export const commentPostAPI = async (
    title: string,
    content: string,
    stockId: number,
) => {
    try {
        const data = await axiosInstance.post<CommentPost>(`comment/${stockId}`, {
            title: title,
            content: content,
        })
        return data
    } catch (error) {
        handleError(error)
    }
}

export const commentGetAPI = async (symbol: string) => {
    try {
        const data = await axiosInstance.get<CommentGet[]>(`comment?Symbol=${symbol}`)
        return data
    } catch (error) {
        handleError(error)
    }
}
