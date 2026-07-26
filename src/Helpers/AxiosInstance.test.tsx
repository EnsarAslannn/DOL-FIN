import { describe, it, expect, beforeEach } from "vitest"
import type { InternalAxiosRequestConfig, AxiosResponse } from "axios"
import axiosInstance from "./AxiosInstance"

describe("axiosInstance request interceptor", () => {
    beforeEach(() => {
        localStorage.clear()
    })

    const stubAdapter = () => {
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
        return () => captured
    }

    it("attaches Authorization header from localStorage token", async () => {
        localStorage.setItem("token", "abc123")
        const getCaptured = stubAdapter()

        await axiosInstance.get("/ping")

        expect(getCaptured()?.headers.Authorization).toBe("Bearer abc123")
    })

    it("does not attach Authorization header when no token is stored", async () => {
        const getCaptured = stubAdapter()

        await axiosInstance.get("/ping")

        expect(getCaptured()?.headers.Authorization).toBeUndefined()
    })

    it("uses the freshest token on each request", async () => {
        localStorage.setItem("token", "first")
        const getCaptured = stubAdapter()

        await axiosInstance.get("/ping")
        expect(getCaptured()?.headers.Authorization).toBe("Bearer first")

        localStorage.setItem("token", "second")
        await axiosInstance.get("/ping")
        expect(getCaptured()?.headers.Authorization).toBe("Bearer second")
    })
})
