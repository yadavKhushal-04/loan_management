import { useNavigate } from "react-router-dom"

const NotFound = () => {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
            <h1 className="text-6xl font-bold text-blue-600">404</h1>
            <p className="text-gray-500 text-lg">Page not found</p>
            <button
                onClick={() => navigate('/dashboard')}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
            >
                Go to Dashboard
            </button>
        </div>
    )
}

export default NotFound