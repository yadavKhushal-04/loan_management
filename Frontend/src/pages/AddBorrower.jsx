import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/axios"
import Navbar from "../components/Navbar"
import toast from "react-hot-toast"

const AddBorrower = () => {
    const navigate = useNavigate()

    const [form, setForm] = useState({ name: "", fatherName: "", phone: "", address: "" })
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!form.name || !form.phone) {
            toast.error('Name and phone are required')
            return
        }

        setLoading(true)
        try {
            await api.post('/borrowers/create', form)
            toast.success('Borrower added successfully')
            navigate('/borrowers')
        }
        catch (err) {
            toast.error(err.response?.data?.message || 'Failed to add borrower')
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-lg mx-auto px-6 py-10">

                {/* back button */}
                <button
                    onClick={() => navigate('/borrowers')}
                    className="text-sm text-gray-500 hover:text-gray-700 mb-6 flex items-center gap-1 transition-colors"
                >
                    ← Back to Borrowers
                </button>

                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">Add New Borrower</h2>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Enter borrower's name"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Father's Name
                                <span className="text-gray-400 text-xs ml-1">(optional)</span>
                            </label>
                            <input
                                type="text"
                                name="fatherName"
                                value={form.fatherName}
                                onChange={handleChange}
                                placeholder="Enter father's name"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Phone <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                placeholder="Enter phone number"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Address
                                <span className="text-gray-400 text-xs ml-1">(optional)</span>
                            </label>
                            <textarea
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                placeholder="Enter address"
                                rows={3}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            />
                        </div>

                        <div className="flex gap-3 mt-2">
                            <button
                                type="button"
                                onClick={() => navigate('/borrowers')}
                                className="flex-1 border border-gray-300 text-gray-600 hover:bg-gray-50 font-medium py-2.5 rounded-lg transition-colors text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
                            >
                                {loading ? 'Adding...' : 'Add Borrower'}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddBorrower