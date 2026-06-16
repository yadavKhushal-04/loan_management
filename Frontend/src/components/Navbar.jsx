import { Link, useNavigate } from "react-router-dom"
import { useAuthStore } from "../store/authStore"
import api from "../api/axios"
import toast from "react-hot-toast"

const Navbar = () => {
    const { user, logout } = useAuthStore()
    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            // tell backend to clear refresh token from DB
            await api.post('/auth/logout')
        }
        catch (err) {
            // even if backend call fails, clear frontend state
            console.error(err)
        }
        finally {
            logout()             // clear zustand store
            toast.success('Logged out successfully')
            navigate('/login')
        }
    }

    return (
        <nav className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-8">
                <span className="text-xl font-bold text-blue-600">LoanManager</span>
                <div className="flex gap-6">
                    <Link
                        to="/dashboard"
                        className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                        Dashboard
                    </Link>
                    <Link
                        to="/borrowers"
                        className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                        Borrowers
                    </Link>
                    <Link
                        to="/defaulters"
                        className="text-red-500 hover:text-red-700 font-medium transition-colors">
                        Defaulters
                    </Link>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">
                    {user?.fullName}
                    <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                        {user?.role}
                    </span>
                </span>
                <button
                    onClick={handleLogout}
                    className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
                >
                    Logout
                </button>
            </div>
        </nav>
    )
}

export default Navbar