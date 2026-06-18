import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import api from "../api/axios"
import Navbar from "../components/Navbar"
import toast from "react-hot-toast"

const AddPayment = () => {
    const { id, loanId } = useParams()
    const navigate = useNavigate()

    const [loan, setLoan] = useState(null)
    const [unpaidMonths, setUnpaidMonths] = useState([])
    const [form, setForm] = useState({
        amount: "",
        monthFor: "",
        paidDate: new Date().toISOString().split('T')[0],
        method: "",
        note: ""
    })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchLoan = async () => {
            try {
                const { data } = await api.get(`/loans/${id}`)
                const loan = data.loans.find(l => l._id === loanId)
                if (!loan) {
                    toast.error('Loan not found')
                    navigate(`/borrowers/${id}`)
                    return
                }
                setLoan(loan)

                // generate all months for this loan
                const start = new Date(loan.startDate || loan.createdAt)
                const currentMonth = new Date().toISOString().substring(0, 7)
                const paidMonths = new Set((loan.payments || []).map(p => p.monthFor))

                const months = []
                for (let i = 0; i < loan.durationMonths; i++) {
                    const d = new Date(start.getFullYear(), start.getMonth() + i, 1)
                    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
                    const label = d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })

                    // only show months that are due and not yet paid
                    if (!paidMonths.has(key)) {
                        months.push({ key, label })
                    }
                }

                setUnpaidMonths(months)

                // pre-select first unpaid month
                if (months.length > 0) {
                    setForm(prev => ({
                        ...prev,
                        monthFor: months[0].key,
                        amount: loan.emiAmount?.toFixed(2) || ""
                    }))
                }
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

        if (!form.amount || !form.monthFor || !form.paidDate) {
            toast.error('All fields are required')
            return
        }

        setLoading(true)
        try {
            await api.post(`/payments/${loanId}`, {
                amount: Number(form.amount),
                monthFor: form.monthFor,
                paidDate: form.paidDate,
                method: form.method,
                note: form.note || undefined
            })

            toast.success(data.message)

            // check if more unpaid months remain
            const remaining = unpaidMonths.filter(m => m.key !== form.monthFor)
            if (remaining.length > 0) {
                // stay on form to record next month's payment
                setUnpaidMonths(remaining)
                setForm({
                    amount: loan.emiAmount?.toFixed(2) || "",
                    monthFor: remaining[0].key,
                    paidDate: new Date().toISOString().split('T')[0]
                })
                toast('You can record the next month\'s payment now', { icon: '📋' })
            } else {
                navigate(`/borrowers/${id}`)
            }
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

            <div className="max-w-lg mx-auto px-4 sm:px-6 py-8 sm:py-10">

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
                                <p className="text-blue-400 text-xs">Remaining</p>
                                <p className="text-blue-800 font-semibold">{unpaidMonths.length} months</p>
                            </div>
                        </div>
                    </div>
                )}

                {unpaidMonths.length === 0 && loan ? (
                    <div className="bg-white rounded-xl shadow p-6 text-center">
                        <p className="text-green-600 font-semibold text-lg">✓ All payments are up to date</p>
                        <p className="text-gray-400 text-sm mt-1">No pending months to record</p>
                        <button
                            onClick={() => navigate(`/borrowers/${id}`)}
                            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium"
                        >
                            Back to Profile
                        </button>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-6">Record Payment</h2>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                            {/* month selector */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Payment For <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="monthFor"
                                    value={form.monthFor}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {unpaidMonths.map(({ key, label }) => (
                                        <option key={key} value={key}>{label}</option>
                                    ))}
                                </select>
                                <p className="text-xs text-gray-400 mt-1">
                                    {unpaidMonths.length} unpaid month{unpaidMonths.length !== 1 ? 's' : ''} remaining
                                </p>
                            </div>

                            {/* amount */}
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
                                        min="1"
                                        className="w-full border border-gray-300 rounded-lg pl-7 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                {loan && (
                                    <p className="text-xs text-gray-400 mt-1">
                                        EMI amount: ₹{loan.emiAmount?.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Payment Method <span className="text-red-500">*</span>
                                </label>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setForm(prev => ({ ...prev, method: 'cash' }))}
                                        className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                                            form.method === 'cash'
                                                ? 'bg-blue-600 text-white border-blue-600'
                                                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        💵 Cash
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setForm(prev => ({ ...prev, method: 'upi' }))}
                                        className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                                            form.method === 'upi'
                                                ? 'bg-blue-600 text-white border-blue-600'
                                                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        📱 UPI
                                    </button>
                                </div>
                            </div>

                            {/* paid date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Date Paid <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="paidDate"
                                    value={form.paidDate}
                                    onChange={handleChange}
                                    max={new Date().toISOString().split('T')[0]}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Note
                                    <span className="text-gray-400 text-xs ml-1">(optional)</span>
                                </label>
                                <textarea
                                    name="note"
                                    value={form.note}
                                    onChange={handleChange}
                                    placeholder="e.g. paid via GPay, partial payment, etc."
                                    rows={2}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                />
                            </div>

                            <div className="flex gap-3 mt-2">
                                <button
                                    type="button"
                                    onClick={() => navigate(`/borrowers/${id}`)}
                                    className="flex-1 border border-gray-300 text-gray-600 hover:bg-gray-50 font-medium py-2.5 rounded-lg transition-colors text-sm"
                                >
                                    Done
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
                )}
            </div>
        </div>
    )
}

export default AddPayment