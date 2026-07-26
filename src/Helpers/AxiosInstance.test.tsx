import { describe, it, expect } from "vitest"
import type { InternalAxiosRequestConfig, AxiosResponse } from "axios"
import axiosInstance from "./AxiosInstance"

describe("axiosInstance", () => {
    it("sends credentials (cookies) with every request", () => {
        expect(axiosInstance.defaults.withCredentials).toBe(true)
    })

    it("does not attach a manual Authorization header (auth is cookie-based)", async () => {
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

        await axiosInstance.get("/ping")

        expect(captured?.headers.Authorization).toBeUndefined()
    })
})
