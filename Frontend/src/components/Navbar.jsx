import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuthStore } from "../store/authStore"
import api from "../api/axios"
import toast from "react-hot-toast"

const Navbar = () => {
    const navigate = useNavigate()
    const { user, logout } = useAuthStore()
    const [menuOpen, setMenuOpen] = useState(false)

    const handleLogout = async () => {
        try {
            await api.post('/auth/logout')
        } catch (err) {
            console.error(err)
        } finally {
            logout()
            toast.success('Logged out successfully')
            navigate('/login')
        }
    }

    return (
        <nav className="bg-white shadow-sm px-6 py-4">
            <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-blue-600">LoanManager</span>

                {/* desktop links */}
                <div className="hidden md:flex items-center gap-8">
                    <div className="flex gap-6">
                        <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Dashboard</Link>
                        <Link to="/borrowers" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Borrowers</Link>
                        <Link to="/defaulters" className="text-red-500 hover:text-red-700 font-medium transition-colors">Defaulters</Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">
                            {user?.fullName}
                            <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium">{user?.role}</span>
                        </span>
                        <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors">
                            Logout
                        </button>
                    </div>
                </div>

                {/* hamburger button — mobile only */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="md:hidden flex flex-col gap-1.5 p-1"
                >
                    <span className={`block w-6 h-0.5 bg-gray-600 transition-transform ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                    <span className={`block w-6 h-0.5 bg-gray-600 transition-opacity ${menuOpen ? 'opacity-0' : ''}`}></span>
                    <span className={`block w-6 h-0.5 bg-gray-600 transition-transform ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                </button>
            </div>

            {/* mobile menu */}
            {menuOpen && (
                <div className="md:hidden mt-4 border-t border-gray-100 pt-4 flex flex-col gap-3">
                    <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="text-gray-600 hover:text-blue-600 font-medium py-1">Dashboard</Link>
                    <Link to="/borrowers" onClick={() => setMenuOpen(false)} className="text-gray-600 hover:text-blue-600 font-medium py-1">Borrowers</Link>
                    <Link to="/defaulters" onClick={() => setMenuOpen(false)} className="text-red-500 hover:text-red-700 font-medium py-1">Defaulters</Link>
                    <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                            {user?.fullName}
                            <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">{user?.role}</span>
                        </span>
                        <button onClick={handleLogout} className="text-sm text-red-500 font-medium">Logout</button>
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Navbar