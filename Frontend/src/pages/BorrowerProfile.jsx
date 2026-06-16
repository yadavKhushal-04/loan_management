import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../api/axios"
import Navbar from "../components/Navbar"
import Loader from "../components/Loader"
import PaymentHistoryGrid from "../components/PaymentHistoryGrid"
import { useAuthStore } from "../store/authStore"
import toast from "react-hot-toast"

const statusColors = {
    active:   "bg-green-100 text-green-700 border-green-200",
    defaulter: "bg-red-100 text-red-700 border-red-200",
    cleared:  "bg-yellow-100 text-yellow-700 border-yellow-200"
}

const loanStatusColors = {
    active:    "bg-green-100 text-green-700",
    completed: "bg-yellow-100 text-yellow-700",
    defaulter: "bg-red-100 text-red-700"
}

const BorrowerProfile = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user } = useAuthStore()

    const [borrower, setBorrower] = useState(null)
    const [activeLoan, setActiveLoan] = useState(null)
    const [previousLoans, setPreviousLoans] = useState([])
    const [loading, setLoading] = useState(true)
    const [expandedLoan, setExpandedLoan] = useState(null)  // for toggling previous loan history

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: borrowerData } = await api.get(`/borrowers/${id}`)
                setBorrower(borrowerData.borrower)

                // fetch all loans, not just active
                const { data: loanData } = await api.get(`/loans/${id}`)
                const active = loanData.loans.find(l => l.status === 'active')
                const previous = loanData.loans.filter(l => l.status !== 'active')

                setActiveLoan(active || null)
                setPreviousLoans(previous)
            }
            catch (err) {
                toast.error(err.response?.data?.message || 'Failed to load borrower')
                navigate('/borrowers')
            }
            finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [id])

    if (loading || !borrower) return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Loader />
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-3xl mx-auto px-6 py-10">

                <button
                    onClick={() => navigate('/borrowers')}
                    className="text-sm text-gray-500 hover:text-gray-700 mb-6 flex items-center gap-1 transition-colors"
                >
                    ← Back to Borrowers
                </button>

                {/* defaulter alert */}
                {borrower.status === "defaulter" && (
                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4 mb-6 flex items-center gap-3">
                        <span className="text-xl">⚠️</span>
                        <div>
                            <p className="font-semibold">Defaulter Alert</p>
                            <p className="text-sm">This borrower has been marked as a defaulter.</p>
                        </div>
                    </div>
                )}

                {/* borrower details */}
                <div className="bg-white rounded-xl shadow p-6 mb-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 capitalize">{borrower.name}</h2>
                            <p className="text-gray-500 text-sm mt-1">
                                Member since {new Date(borrower.createdAt).toLocaleDateString('en-IN', {
                                    year: 'numeric', month: 'long', day: 'numeric'
                                })}
                            </p>
                        </div>
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full border capitalize ${statusColors[borrower.status]}`}>
                            {borrower.status}
                        </span>
                    </div>
                    
                    <div>
                        <p className="text-xs text-gray-400 uppercase font-medium">Father's Name</p>
                        <p className="text-gray-800 font-medium mt-1">{borrower.fatherName || '—'}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-6">
                        <div>
                            <p className="text-xs text-gray-400 uppercase font-medium">Phone</p>
                            <p className="text-gray-800 font-medium mt-1">{borrower.phone}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 uppercase font-medium">Address</p>
                            <p className="text-gray-800 font-medium mt-1">{borrower.address || '—'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 uppercase font-medium">Total Loans</p>
                            <p className="text-gray-800 font-medium mt-1">{borrower.loans?.length || 0}</p>
                        </div>
                    </div>
                </div>

                {/* active loan */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Current Loan</h3>
                        {!activeLoan && user?.role === 'admin' && (
                            <button
                                onClick={() => navigate(`/borrowers/${id}/add-loan`)}
                                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition-colors"
                            >
                                + Add Loan
                            </button>
                        )}
                    </div>

                    {!activeLoan ? (
                        <div className="bg-white rounded-xl shadow p-6 text-center text-gray-400 text-sm">
                            No active loan for this borrower
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow p-6">
                            <div className="flex items-center justify-between mb-5">
                                <p className="text-xs text-gray-400 font-medium">
                                    Loan ID: <span className="text-gray-600">{activeLoan._id}</span>
                                </p>
                                <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${loanStatusColors[activeLoan.status]}`}>
                                    {activeLoan.status}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-5 mb-6">
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-medium">Principal Amount</p>
                                    <p className="text-gray-800 font-semibold text-lg mt-1">₹{activeLoan.principalAmount?.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-medium">Interest Rate</p>
                                    <p className="text-gray-800 font-semibold text-lg mt-1">{activeLoan.interestRate}%</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-medium">Duration</p>
                                    <p className="text-gray-800 font-semibold mt-1">{activeLoan.durationMonths} months</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-medium">EMI Amount</p>
                                    <p className="text-gray-800 font-semibold mt-1">₹{activeLoan.emiAmount?.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-medium">Payments Made</p>
                                    <p className="text-gray-800 font-semibold mt-1">{activeLoan.payments?.length || 0} / {activeLoan.durationMonths}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-medium">Started</p>
                                    <p className="text-gray-800 font-semibold mt-1">
                                        {new Date(activeLoan.createdAt).toLocaleDateString('en-IN', {
                                            year: 'numeric', month: 'long', day: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-xs text-gray-400 uppercase font-medium">Witness</p>
                                    {activeLoan.witness?.name ? (
                                        <div className="mt-1">
                                            <p className="text-gray-800 font-semibold">{activeLoan.witness.name}</p>
                                            {activeLoan.witness.phone && <p className="text-gray-500 text-sm">{activeLoan.witness.phone}</p>}
                                            {activeLoan.witness.address && <p className="text-gray-500 text-sm">{activeLoan.witness.address}</p>}
                                        </div>
                                    ) : (
                                        <p className="text-gray-800 font-semibold mt-1">—</p>
                                    )}
                                </div>
                            </div>

                            {/* payment history grid */}
                            <div className="border-t border-gray-100 pt-5">
                                <p className="text-xs text-gray-400 uppercase font-medium mb-3">Payment History</p>
                                <PaymentHistoryGrid loan={activeLoan} />
                            </div>

                            {/* record payment button */}
                            {user?.role === 'admin' && (
                                <button
                                    onClick={() => navigate(`/borrowers/${id}/add-payment/${activeLoan._id}`)}
                                    className="w-full mt-5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
                                >
                                    + Record Payment
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* previous loans */}
                {previousLoans.length > 0 && (
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                            Previous Loans ({previousLoans.length})
                        </h3>
                        <div className="flex flex-col gap-4">
                            {previousLoans.map(loan => (
                                <div key={loan._id} className="bg-white rounded-xl shadow p-5">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-semibold text-gray-700">
                                                ₹{loan.principalAmount?.toLocaleString()}
                                                <span className="text-gray-400 font-normal ml-2">
                                                    @ {loan.interestRate}% for {loan.durationMonths} months
                                                </span>
                                            </p>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                {new Date(loan.createdAt).toLocaleDateString('en-IN', {
                                                    year: 'numeric', month: 'long'
                                                })}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${loanStatusColors[loan.status]}`}>
                                                {loan.status}
                                            </span>
                                            <button
                                                onClick={() => setExpandedLoan(expandedLoan === loan._id ? null : loan._id)}
                                                className="text-xs text-blue-600 hover:underline"
                                            >
                                                {expandedLoan === loan._id ? 'Hide history' : 'View history'}
                                            </button>
                                        </div>
                                    </div>

                                    {/* expandable payment history */}
                                    {expandedLoan === loan._id && (
                                        <div className="mt-4 border-t border-gray-100 pt-4">
                                            <PaymentHistoryGrid loan={loan} />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}

export default BorrowerProfile