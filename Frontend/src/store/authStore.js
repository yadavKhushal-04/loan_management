import { create } from "zustand"
import { persist } from "zustand/middleware"

// why persist: without it, refreshing the page clears the store and
// logs the user out. persist saves the store to localStorage automatically
// so the user stays logged in across page refreshes.
export const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,

            // called after successful login/register
            setAuth: ({ user, accessToken, refreshToken }) => set({
                user,
                accessToken,
                refreshToken,
                isAuthenticated: true
            }),

            // only updates access token (used by interceptor after refresh)
            setAccessToken: (accessToken) => set({ accessToken }),

            // clears everything on logout
            logout: () => set({
                user: null,
                accessToken: null,
                refreshToken: null,
                isAuthenticated: false
            })
        }),
        {
            name: "auth-storage",  // key used in localStorage
        }
    )
)