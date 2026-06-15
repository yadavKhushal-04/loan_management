import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import api from "../api/axios"
import { useAuthStore } from "../store/authStore"
import toast from "react-hot-toast"

const Register = () => {
    const navigate = useNavigate()
    const { setAuth, isAuthenticated } = useAuthStore()

    const [form, setForm] = useState({
        fullName: "",
        userName: "",
        password: "",
        confirmPassword: ""
    })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard')
        }
    }, [isAuthenticated])
    

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!form.fullName || !form.userName || !form.password || !form.confirmPassword) {
            toast.error('All fields are required')
            return
        }

        if (form.password !== form.confirmPassword) {
            toast.error('Passwords do not match')
            return
        }

        if (form.password.length < 6) {
            toast.error('Password must be at least 6 characters')
            return
        }

        setLoading(true)
        try {
            const { data } = await api.post('/auth/register', {
                fullName: form.fullName,
                userName: form.userName,
                password: form.password
            })

            setAuth({
                user: data.user,
                accessToken: data.accessToken,
                refreshToken: data.refreshToken
            })

            toast.success('Account created successfully!')
            navigate('/dashboard')
        }
        catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed')
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md">

                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-blue-600">LoanManager</h1>
                    <p className="text-gray-500 mt-2 text-sm">Create your account</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="fullName"
                            value={form.fullName}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Username <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="userName"
                            value={form.userName}
                            onChange={handleChange}
                            placeholder="Choose a username"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Min. 6 characters"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm Password <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            placeholder="Re-enter your password"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-2.5 rounded-lg transition-colors mt-2"
                    >
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>

                    <p className="text-center text-sm text-gray-500">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-600 hover:underline font-medium">
                            Sign in
                        </Link>
                    </p>

                </form>
            </div>
        </div>
    )
}

export default Register