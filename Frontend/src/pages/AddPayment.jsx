import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import api from "../api/axios"
import Navbar from "../components/Navbar"
import toast from "react-hot-toast"

const AddPayment = () => {
    const { id, loanId } = useParams()  // borrower id + loan id from URL
    const navigate = useNavigate()

    const [loan, setLoan] = useState(null)
    const [form, setForm] = useState({
        amount: "",
        paidDate: new Date().toISOString().split('T')[0]  // default to today
    })
    const [loading, setLoading] = useState(false)

    // fetch loan details to show summary at top
    useEffect(() => {
        const fetchLoan = async () => {
            try {
                const { data } = await api.get(`/loans/${id}?status=active`)
                const activeLoan = data.loans.find(l => l._id === loanId)
                if (!activeLoan) {
                    toast.error('Loan not found')
                    navigate(`/borrowers/${id}`)
                }
                setLoan(activeLoan)
            }
            catch (err) {
                toast.error('Failed to load loan details')
                navigate(`/borrowers/${id}`)
            }
        }
        fetchLoan()
    }, [loanId])

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!form.amount || !form.paidDate) {
            toast.error('Amount and date are required')
            return
        }

        if (Number(form.amount) <= 0) {
            toast.error('Amount must be greater than 0')
            return
        }

        setLoading(true)
        try {
            await api.post(`/payments/${loanId}`, {
                amount: Number(form.amount),
                paidDate: form.paidDate
            })

            toast.success('Payment recorded successfully')
            navigate(`/borrowers/${id}`)
        }
        catch (err) {
            toast.error(err.response?.data?.message || 'Failed to record payment')
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
                    onClick={() => navigate(`/borrowers/${id}`)}
                    className="text-sm text-gray-500 hover:text-gray-700 mb-6 flex items-center gap-1 transition-colors"
                >
                    ← Back to Profile
                </button>

                {/* loan summary */}
                {loan && (
                    <div className="bg-blue-50 border border-blue-100 rounded-xl px-5 py-4 mb-6">
                        <p className="text-xs text-blue-500 uppercase font-semibold mb-2">Loan Summary</p>
                        <div className="grid grid-cols-3 gap-3 text-sm">
                            <div>
                                <p className="text-blue-400 text-xs">Principal</p>
                                <p className="text-blue-800 font-semibold">₹{loan.principalAmount?.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-blue-400 text-xs">EMI</p>
                                <p className="text-blue-800 font-semibold">₹{loan.emiAmount?.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                            </div>
                            <div>
                                <p className="text-blue-400 text-xs">Payments</p>
                                <p className="text-blue-800 font-semibold">{loan.payments?.length || 0} / {loan.durationMonths}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">Record Payment</h2>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Amount <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                                <input
                                    type="number"
                                    name="amount"
                                    value={form.amount}
                                    onChange={handleChange}
                                    placeholder={loan ? loan.emiAmount?.toFixed(2) : "0"}
                                    min="1"
                                    className="w-full border border-gray-300 rounded-lg pl-7 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            {/* show EMI as hint */}
                            {loan && (
                                <p className="text-xs text-gray-400 mt-1">
                                    EMI amount: ₹{loan.emiAmount?.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Payment Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                name="paidDate"
                                value={form.paidDate}
                                onChange={handleChange}
                                max={new Date().toISOString().split('T')[0]}  // can't be future date
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

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
                                {loading ? 'Recording...' : 'Record Payment'}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddPayment