import { Navigate } from "react-router-dom"
import { useAuthStore } from "../store/authStore"

// some pages (Dashboard, Borrowers etc.) should only be accessible to authenticated users, it will checks if the user is authenticated if not will return to login page.
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuthStore()

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    return children
}

export default ProtectedRoute