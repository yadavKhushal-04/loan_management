import { create } from "zustand"
import api from "../api/axios"

// why: keeps borrower list, pagination meta, and loading/error
// states all in one place so any component can access them
// without prop drilling or repeated API calls
export const useBorrowerStore = create((set) => ({
    borrowers: [],
    meta: null,
    loading: false,
    error: null,

    fetchBorrowers: async ({ search = "", status = "", page = 1, limit = 10 } = {}) => {
        set({ loading: true, error: null })
        try {
            const params = new URLSearchParams()
            if (search) params.append("search", search)
            if (status) params.append("status", status)
            params.append("page", page)
            params.append("limit", limit)

            const { data } = await api.get(`/borrowers?${params.toString()}`)
            set({ borrowers: data.borrowers, meta: data.meta, loading: false })
        }
        catch (err) {
            set({ error: err.response?.data?.message || "Failed to fetch borrowers", loading: false })
        }
    },

    clearBorrowers: () => set({ borrowers: [], meta: null })
}))