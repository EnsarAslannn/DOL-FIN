import { describe, it, expect, beforeEach } from "vitest"
import axios, { type InternalAxiosRequestConfig, type AxiosResponse } from "axios"
import axiosInstance from "./AxiosInstance"

const capture = async (method: "get" | "post") => {
    let captured: InternalAxiosRequestConfig | undefined
    axiosInstance.defaults.adapter = async (config) => {
        captured = config
        return {
            data: {},
            status: 200,
            statusText: "OK",
            headers: {},
            config,
        } as AxiosResponse
    }

    await axiosInstance[method]("/ping")
    return captured
}

describe("axiosInstance", () => {
    beforeEach(() => {
        document.cookie = "XSRF-TOKEN=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/"
    })

    it("sends credentials (cookies) with every request", () => {
        expect(axiosInstance.defaults.withCredentials).toBe(true)
    })

    it("does not attach a manual Authorization header (auth is cookie-based)", async () => {
        const captured = await capture("get")

        expect(captured?.headers.Authorization).toBeUndefined()
    })

    it("echoes the XSRF-TOKEN cookie as a header on mutating requests", async () => {
        document.cookie = "XSRF-TOKEN=abc123"

        const captured = await capture("post")

        expect(captured?.headers["X-CSRF-TOKEN"]).toBe("abc123")
    })

    it("does not attach a CSRF header on GET requests", async () => {
        document.cookie = "XSRF-TOKEN=abc123"

        const captured = await capture("get")

        expect(captured?.headers["X-CSRF-TOKEN"]).toBeUndefined()
    })

    it("does not attach a CSRF header when no cookie is present", async () => {
        const captured = await capture("post")

        expect(captured?.headers["X-CSRF-TOKEN"]).toBeUndefined()
    })

    it("never resolves a bare service path (e.g. 'portfolio') to a double /api/api/ prefix", async () => {
        let config: InternalAxiosRequestConfig | undefined
        axiosInstance.defaults.adapter = async (c) => {
            config = c
            return { data: {}, status: 200, statusText: "OK", headers: {}, config: c } as AxiosResponse
        }

        await axiosInstance.get("portfolio")

        const fullUrl = axios.getUri(config)
        expect(fullUrl).not.toContain("/api/api/")
        expect(fullUrl).toContain("/api/portfolio")
    })
})
