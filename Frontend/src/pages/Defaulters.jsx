import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/axios"
import Navbar from "../components/Navbar"
import Loader from "../components/Loader"
import toast from "react-hot-toast"

const getPreviousMonth = () => {
    const now = new Date()
    const year = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear()
    const month = now.getMonth() === 0 ? 12 : now.getMonth()
    return `${year}-${String(month).padStart(2, '0')}`
}

const Defaulters = () => {
    const navigate = useNavigate()
    const [defaulters, setDefaulters] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchDefaulters = async () => {
            try {
                const { data } = await api.get('/borrowers?status=defaulter&limit=100')
                
                // fetch active loan for each defaulter
                const withLoans = await Promise.all(
                    data.borrowers.map(async (borrower) => {
                        try {
                            const { data: loanData } = await api.get(`/loans/${borrower._id}?status=active`)
                            return {
                                ...borrower,
                                activeLoan: loanData.loans[0] || null
                            }
                        }
                        catch {
                            return { ...borrower, activeLoan: null }
                        }
                    })
                )
                setDefaulters(withLoans)
            }
            catch (err) {
                toast.error('Failed to load defaulters')
            }
            finally {
                setLoading(false)
            }
        }
        fetchDefaulters()
    }, [])

    const previousMonth = getPreviousMonth()
    const previousMonthLabel = new Date(previousMonth + '-01')
        .toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-5xl mx-auto px-6 py-10">

                {/* header */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800">Defaulters</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Borrowers who missed their payment for{' '}
                        <span className="text-red-600 font-medium">{previousMonthLabel}</span>
                    </p>
                </div>

                {loading ? <Loader /> : (
                    <>
                        {defaulters.length === 0 ? (
                            <div className="bg-white rounded-xl shadow p-12 text-center">
                                <p className="text-4xl mb-3">🎉</p>
                                <p className="text-gray-700 font-semibold text-lg">No defaulters this month</p>
                                <p className="text-gray-400 text-sm mt-1">All borrowers are up to date with their payments</p>
                            </div>
                        ) : (
                            <>
                                {/* summary bar */}
                                <div className="bg-red-50 border border-red-100 rounded-xl px-5 py-4 mb-6 flex items-center gap-3">
                                    <span className="text-2xl">⚠️</span>
                                    <div>
                                        <p className="text-red-700 font-semibold">
                                            {defaulters.length} borrower{defaulters.length !== 1 ? 's' : ''} need{defaulters.length === 1 ? 's' : ''} to be reminded
                                        </p>
                                        <p className="text-red-500 text-sm">
                                            Total pending: ₹{defaulters.reduce((acc, d) => acc + (d.activeLoan?.emiAmount || 0), 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                        </p>
                                    </div>
                                </div>

                                {/* defaulters list */}
                                <div className="flex flex-col gap-4">
                                    {defaulters.map((borrower, index) => (
                                        <div
                                            key={borrower._id}
                                            className="bg-white rounded-xl shadow p-5"
                                        >
                                            <div className="flex items-start justify-between gap-4">

                                                {/* left — borrower info */}
                                                <div className="flex items-start gap-4">
                                                    {/* index number */}
                                                    <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 text-sm font-bold flex items-center justify-center flex-shrink-0">
                                                        {index + 1}
                                                    </div>

                                                    <div>
                                                        <h3 className="font-semibold text-gray-800 capitalize text-lg">
                                                            {borrower.name}
                                                        </h3>

                                                        {/* contact details */}
                                                        <div className="flex flex-wrap gap-4 mt-2">
                                                            <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                                                <span>📞</span>
                                                                <span className="font-medium">{borrower.phone}</span>
                                                            </div>
                                                            {borrower.address && (
                                                                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                                                    <span>📍</span>
                                                                    <span>{borrower.address}</span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* loan info */}
                                                        {borrower.activeLoan && (
                                                            <div className="flex flex-wrap gap-4 mt-3">
                                                                <div className="bg-gray-50 rounded-lg px-3 py-1.5 text-xs">
                                                                    <span className="text-gray-400">Principal </span>
                                                                    <span className="font-semibold text-gray-700">
                                                                        ₹{borrower.activeLoan.principalAmount?.toLocaleString()}
                                                                    </span>
                                                                </div>
                                                                <div className="bg-red-50 rounded-lg px-3 py-1.5 text-xs">
                                                                    <span className="text-red-400">EMI Due </span>
                                                                    <span className="font-semibold text-red-700">
                                                                        ₹{borrower.activeLoan.emiAmount?.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                                                    </span>
                                                                </div>
                                                                <div className="bg-gray-50 rounded-lg px-3 py-1.5 text-xs">
                                                                    <span className="text-gray-400">Payments </span>
                                                                    <span className="font-semibold text-gray-700">
                                                                        {borrower.activeLoan.payments?.length || 0} / {borrower.activeLoan.durationMonths}
                                                                    </span>
                                                                </div>
                                                                {borrower.activeLoan.witness?.name && (
                                                                    <div className="bg-gray-50 rounded-lg px-3 py-1.5 text-xs">
                                                                        <span className="text-gray-400">Witness </span>
                                                                        <span className="font-semibold text-gray-700">
                                                                            {borrower.activeLoan.witness.name}
                                                                        </span>
                                                                        {borrower.activeLoan.witness.phone && (
                                                                            <span className="text-gray-500"> · {borrower.activeLoan.witness.phone}</span>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* right — action buttons */}
                                                <div className="flex flex-col gap-2 flex-shrink-0">
                                                    <button
                                                        onClick={() => navigate(`/borrowers/${borrower._id}`)}
                                                        className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg transition-colors font-medium"
                                                    >
                                                        View Profile
                                                    </button>
                                                    
                                                    <a
                                                        href={`tel:${borrower.phone}`}
                                                        className="text-sm border border-green-500 text-green-600 hover:bg-green-50 px-4 py-1.5 rounded-lg transition-colors font-medium text-center"
                                                    >
                                                        📞 Call
                                                    </a>
                                                </div>

                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default Defaulters