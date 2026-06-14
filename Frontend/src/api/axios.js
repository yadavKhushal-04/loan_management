import axios from "axios"
import { useAuthStore } from "../store/authStore"

// why: instead of typing the full URL every time you make a request,
// you create one axios instance with the base URL set.
// every request made through this instance automatically gets the base URL prepended.
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
    headers: {
        "Content-Type": "application/json"
    }
})

// REQUEST INTERCEPTOR
// why: will attach autherization header with access token to every request if user is logged in.
api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().accessToken
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

// RESPONSE INTERCEPTOR
// in case of access token expiry, it will help assign a new access token using the refresh token and retry the original request.
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true  // prevent infinite retry loop

            try {
                const refreshToken = useAuthStore.getState().refreshToken
                const { data } = await axios.post(
                    `${import.meta.env.VITE_API_URL || "http://localhost:8000/api"}/auth/refresh`,
                    { refreshToken }
                )

                // save new access token to store
                useAuthStore.getState().setAccessToken(data.accessToken)

                // retry original request with new token
                originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
                return api(originalRequest)
            }
            catch (err) {
                // refresh token also expired — force logout
                useAuthStore.getState().logout()
                return Promise.reject(err)
            }
        }

        return Promise.reject(error)
    }
)

export default api