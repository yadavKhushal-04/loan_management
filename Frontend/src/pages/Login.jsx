import { useState , useEffect} from "react"
// import { useNavigate, Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../store/authStore"
import api from "../api/axios"
import toast from "react-hot-toast"

const Login = () => {
    const navigate = useNavigate()
    const { setAuth, isAuthenticated } = useAuthStore()

    const [form, setForm] = useState({ userName: "", password: "" })
    const [loading, setLoading] = useState(false)

    // if already logged in, redirect to dashboard
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard')
        }
    }, [isAuthenticated])

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()  // prevent page reload on form submit

        if (!form.userName || !form.password) {
            toast.error('All fields are required')
            return
        }

        setLoading(true)
        try {
            const { data } = await api.post('/auth/login', form)

            // save user + tokens to zustand store (persisted to localStorage)
            setAuth({
                user: data.user,
                accessToken: data.accessToken,
                refreshToken: data.refreshToken
            })

            toast.success(`Welcome back, ${data.user.fullName}!`)
            navigate('/dashboard')
        }
        catch (err) {
            toast.error(err.response?.data?.message || 'Login failed')
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
                    <p className="text-gray-500 mt-2 text-sm">Sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Username
                        </label>
                        <input
                            type="text"
                            name="userName"
                            value={form.userName}
                            onChange={handleChange}
                            placeholder="Enter your username"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-2.5 rounded-lg transition-colors mt-2"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>

                    {/* <p className="text-center text-sm text-gray-500">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-blue-600 hover:underline font-medium">
                            Register
                        </Link>
                    </p> */}
                </form>
            </div>
        </div>
    )
}

export default Login