import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import api from "../api/axios"
import Navbar from "../components/Navbar"
import toast from "react-hot-toast"

const AddLoan = () => {
    const { id } = useParams()  // borrower id from URL
    const navigate = useNavigate()

    const [borrower, setBorrower] = useState(null)
    const [form, setForm] = useState({
        principalAmount: "",
        interestRate: "",
        durationMonths: "",
        startDate: new Date().toISOString().split('T')[0],
        witness: {
            name: "",
            phone: "",
            adress: ""
        }
    })
    const [loading, setLoading] = useState(false)

    // fetch borrower name to show in the heading
    useEffect(() => {
        const fetchBorrower = async () => {
            try {
                const { data } = await api.get(`/borrowers/${id}`)
                setBorrower(data.borrower)
            }
            catch (err) {
                toast.error('Failed to load borrower details')
                navigate('/borrowers')
            }
        }
        fetchBorrower()
    }, [id])

    const handleChange = (e) => {
        const { name, value } = e.target
        if (name.startsWith('witness.')) {
            const field = name.split('.')[1]
            setForm(prev => ({...prev, witness: { ...prev.witness, [field]: value }}))
        } else {
            setForm(prev => ({ ...prev, [name]: value }))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!form.principalAmount || !form.interestRate || !form.durationMonths) {
            toast.error('Principal amount, interest rate and duration are required')
            return
        }

        setLoading(true)
        try {
            await api.post(`/loans/${id}`, {
                principalAmount: Number(form.principalAmount),
                interestRate: Number(form.interestRate),
                durationMonths: Number(form.durationMonths),
                startDate: form.startDate,
                // only send witness if name is filled
                witness: form.witness.name ? form.witness : undefined
            })

            toast.success('Loan added successfully')
            navigate(`/borrowers/${id}`)
        }
        catch (err) {
            toast.error(err.response?.data?.message || 'Failed to add loan')
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-lg mx-auto px-4 sm:px-6 py-8 sm:py-10">

                {/* back button */}
                <button
                    onClick={() => navigate(`/borrowers/${id}`)}
                    className="text-sm text-gray-500 hover:text-gray-700 mb-6 flex items-center gap-1 transition-colors"
                >
                    ← Back to Profile
                </button>

                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-xl font-bold text-gray-800">Add New Loan</h2>
                    {borrower && (
                        <p className="text-sm text-gray-500 mt-1">
                            For <span className="text-blue-600 font-medium capitalize">{borrower.name}</span>
                        </p>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-6">

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Principal Amount <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                                <input
                                    type="number"
                                    name="principalAmount"
                                    value={form.principalAmount}
                                    onChange={handleChange}
                                    placeholder="0"
                                    min="1"
                                    className="w-full border border-gray-300 rounded-lg pl-7 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Interest Rate <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    name="interestRate"
                                    value={form.interestRate}
                                    onChange={handleChange}
                                    placeholder="0"
                                    min="0"
                                    step="0.1"
                                    className="w-full border border-gray-300 rounded-lg px-4 pr-8 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Duration <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    name="durationMonths"
                                    value={form.durationMonths}
                                    onChange={handleChange}
                                    placeholder="0"
                                    min="1"
                                    className="w-full border border-gray-300 rounded-lg px-4 pr-16 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">months</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Loan Start Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                name="startDate"
                                value={form.startDate}
                                onChange={handleChange}
                                max={new Date().toISOString().split('T')[0]}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Witness
                                <span className="text-gray-400 text-xs ml-1">(optional)</span>
                            </label>
                            <input
                                type="text"
                                name="witness"
                                value={form.witness}
                                onChange={handleChange}
                                placeholder="Enter witness name"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div> */}
                        <div className="border-t border-gray-100 pt-4 mt-1">
                            <p className="text-sm font-medium text-gray-700 mb-3">
                                Witness Details
                                <span className="text-gray-400 text-xs ml-1">(optional)</span>
                            </p>

                            <div className="flex flex-col gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        name="witness.name"
                                        value={form.witness.name}
                                        onChange={handleChange}
                                        placeholder="Witness name"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring"/>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone
                                    </label>
                                    <input
                                        type="text"
                                        name="witness.phone"
                                        value={form.witness.phone}
                                        onChange={handleChange}
                                        placeholder="Witness phone number"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Address
                                    </label>
                                    <textarea
                                        name="witness.address"
                                        value={form.witness.address}
                                        onChange={handleChange}
                                        placeholder="Witness address"
                                        rows={2}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"/>
                                </div>
                            </div>
                        </div>

                        {/* summary preview */}
                        {form.principalAmount && form.interestRate && form.durationMonths && (
                            <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 text-sm text-blue-800">
                                <p className="font-semibold mb-1">Loan Summary</p>
                                <p>Principal: <span className="font-medium">₹{Number(form.principalAmount).toLocaleString()}</span></p>
                                <p>Total Interest: <span className="font-medium">
                                    ₹{(Number(form.principalAmount) * Number(form.interestRate) / 100 * Number(form.durationMonths) / 12).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                </span></p>
                                <p>EMI: <span className="font-medium">
                                    ₹{((Number(form.principalAmount) + (Number(form.principalAmount) * Number(form.interestRate) / 100 * Number(form.durationMonths) / 12)) / Number(form.durationMonths)).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                </span></p>
                            </div>
                        )}

                        <div className="flex gap-3 mt-2">
                            <button
                                type="button"
                                onClick={() => navigate(`/borrowers/${id}`)}
                                className="flex-1 border border-gray-300 text-gray-600 hover:bg-gray-50 font-medium py-2.5 rounded-lg transition-colors text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
                            >
                                {loading ? 'Adding...' : 'Add Loan'}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddLoan