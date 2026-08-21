import { describe, it, expect, vi, beforeEach } from "vitest"
import { AxiosError } from "axios"
import axiosInstance from "../Helpers/AxiosInstance"
import { handleError } from "../Helpers/ErrorHandler"
import { commentPostAPI, commentGetAPI } from "./CommentService"

vi.mock("../Helpers/AxiosInstance", () => ({
    default: { get: vi.fn(), post: vi.fn() },
}))
vi.mock("../Helpers/ErrorHandler", () => ({ handleError: vi.fn() }))

const post = vi.mocked(axiosInstance.post)
const get = vi.mocked(axiosInstance.get)

describe("CommentService", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        post.mockResolvedValue({ data: { title: "t", content: "c" } })
        get.mockResolvedValue({ data: [] })
    })

    describe("commentPostAPI", () => {
        it("posts to the stock's nested comment route", async () => {
            await commentPostAPI("Great quarter", "Revenue beat guidance.", 7)

            expect(post).toHaveBeenCalledWith("comment/7", {
                title: "Great quarter",
                content: "Revenue beat guidance.",
            })
        })

        it("resolves to undefined and reports when the request fails", async () => {
            const error = new AxiosError("403")
            post.mockRejectedValue(error)

            await expect(commentPostAPI("t", "c", 1)).resolves.toBeUndefined()
            expect(handleError).toHaveBeenCalledWith(error)
        })
    })

    describe("commentGetAPI", () => {
        it("filters by symbol when one is given", async () => {
            await commentGetAPI("AAPL")

            expect(get).toHaveBeenCalledWith("comment", {
                params: { Symbol: "AAPL", PageSize: 100 },
            })
        })

        it("omits the symbol filter entirely when none is given", async () => {
            await commentGetAPI()

            expect(get).toHaveBeenCalledWith("comment", {
                params: { PageSize: 100 },
            })
        })

        // An empty string is falsy, so it takes the unfiltered branch rather
        // than asking the API for comments on a stock named "".
        it("treats an empty symbol as no filter", async () => {
            await commentGetAPI("")

            expect(get).toHaveBeenCalledWith("comment", {
                params: { PageSize: 100 },
            })
        })

        it("honours a caller-supplied page size", async () => {
            await commentGetAPI("TSLA", 5)

            expect(get).toHaveBeenCalledWith("comment", {
                params: { Symbol: "TSLA", PageSize: 5 },
            })
        })

        it("resolves to undefined and reports when the request fails", async () => {
            const error = new AxiosError("500")
            get.mockRejectedValue(error)

            await expect(commentGetAPI("AAPL")).resolves.toBeUndefined()
            expect(handleError).toHaveBeenCalledWith(error)
        })
    })
})
