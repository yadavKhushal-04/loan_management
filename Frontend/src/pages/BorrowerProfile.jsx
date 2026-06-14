import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../api/axios"
import Navbar from "../components/Navbar"
import Loader from "../components/Loader"
import { useAuthStore } from "../store/authStore"
import toast from "react-hot-toast"

const statusColors = {
    active: "bg-green-100 text-green-700 border-green-200",
    defaulter: "bg-red-100 text-red-700 border-red-200",
    cleared: "bg-yellow-100 text-yellow-700 border-yellow-200"
}

const loanStatusColors = {
    active: "bg-green-100 text-green-700",
    completed: "bg-yellow-100 text-yellow-700",
    defaulter: "bg-red-100 text-red-700"
}

const BorrowerProfile = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user } = useAuthStore()  // to check if user is admin

    const [borrower, setBorrower] = useState(null)
    const [activeLoan, setActiveLoan] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: borrowerData } = await api.get(`/borrowers/${id}`)
                setBorrower(borrowerData.borrower)

                const { data: loanData } = await api.get(`/loans/${id}?status=active`)
                setActiveLoan(loanData.loans[0] || null)
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

    if (loading) return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Loader />
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-3xl mx-auto px-6 py-10">

                {/* back button */}
                <button
                    onClick={() => navigate('/borrowers')}
                    className="text-sm text-gray-500 hover:text-gray-700 mb-6 flex items-center gap-1 transition-colors"
                >
                    ← Back to Borrowers
                </button>

                {/* defaulter alert banner */}
                {borrower.status === "defaulter" && (
                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4 mb-6 flex items-center gap-3">
                        <span className="text-xl">⚠️</span>
                        <div>
                            <p className="font-semibold">Defaulter Alert</p>
                            <p className="text-sm">This borrower has been marked as a defaulter.</p>
                        </div>
                    </div>
                )}

                {/* borrower details card */}
                <div className="bg-white rounded-xl shadow p-6 mb-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 capitalize">
                                {borrower.name}
                            </h2>
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

                    <div className="grid grid-cols-2 gap-4 mt-6">
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

                {/* active loan section */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                            Current Loan
                        </h3>

                        {/* only show Add Loan button to admins when no active loan exists */}
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
                                <p className="text-xs text-gray-400 uppercase font-medium">
                                    Loan ID: <span className="text-gray-600">{activeLoan._id}</span>
                                </p>
                                <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${loanStatusColors[activeLoan.status]}`}>
                                    {activeLoan.status}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-medium">Principal Amount</p>
                                    <p className="text-gray-800 font-semibold text-lg mt-1">
                                        ₹{activeLoan.principalAmount?.toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-medium">Interest Rate</p>
                                    <p className="text-gray-800 font-semibold text-lg mt-1">
                                        {activeLoan.interestRate}%
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-medium">Duration</p>
                                    <p className="text-gray-800 font-semibold mt-1">
                                        {activeLoan.durationMonths} months
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-medium">Payments Made</p>
                                    <p className="text-gray-800 font-semibold mt-1">
                                        {activeLoan.payments?.length || 0} / {activeLoan.durationMonths}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-medium">Witness</p>
                                    <p className="text-gray-800 font-semibold mt-1">
                                        {activeLoan.witness || '—'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-medium">Started</p>
                                    <p className="text-gray-800 font-semibold mt-1">
                                        {new Date(activeLoan.createdAt).toLocaleDateString('en-IN', {
                                            year: 'numeric', month: 'long', day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}

export default BorrowerProfile