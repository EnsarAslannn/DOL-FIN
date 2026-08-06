import axios from "axios"

const getApiURL = () => {
    let url = import.meta.env.VITE_API_URL || "https://localhost:7109"
    if (url.endsWith("/")) {
        url = url.slice(0, -1)
    }
    return `${url}/api/`
}

const axiosInstance = axios.create({
    baseURL: getApiURL(),
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
})

const readCookie = (name: string) => {
    const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
    return match ? decodeURIComponent(match[1]) : undefined
}

const mutatingMethods = new Set(["post", "put", "delete", "patch"])

axiosInstance.interceptors.request.use(
    (config) => {
        if (config.method && mutatingMethods.has(config.method.toLowerCase())) {
            const csrfToken = readCookie("XSRF-TOKEN")
            if (csrfToken) {
                config.headers["X-CSRF-TOKEN"] = csrfToken
            }
        }

        return config
    },
    (error) => {
        return Promise.reject(error)
    },
)

export default axiosInstance
