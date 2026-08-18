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

/**
 * Comments for the discussion board.
 *
 * `symbol` is optional because the board now spans every stock and filters
 * on the client — the API returns the whole feed when the parameter is
 * omitted, which is what lets the filter show a count per ticker instead of
 * a round trip per selection.
 *
 * `pageSize` is capped at 100 by the server's own validator; asking for the
 * maximum keeps the single fetch honest rather than silently showing the
 * first 20 comments as if they were all of them.
 */
export const commentGetAPI = async (symbol?: string, pageSize = 100) => {
    try {
        const data = await axiosInstance.get<CommentGet[]>("comment", {
            params: symbol ? { Symbol: symbol, PageSize: pageSize } : { PageSize: pageSize },
        })
        return data
    } catch (error) {
        handleError(error)
    }
}
