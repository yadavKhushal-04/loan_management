import { useEffect, useState } from "react"
import api from "../api/axios"
import Navbar from "../components/Navbar"
import StatCard from "../components/StatCard"
import Loader from "../components/Loader"
import toast from "react-hot-toast"

const Dashboard = () => {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // why useEffect: fetch stats when the component first mounts
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/stats')
                setStats(data.stats)
            }
            catch (err) {
                toast.error(err.response?.data?.message || 'Failed to load stats')
            }
            finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [])  // empty array = run once on mount only

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-6xl mx-auto px-6 py-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-8">Dashboard</h2>

                {loading ? <Loader /> : (
                    <div className="flex flex-col gap-10">

                        {/* borrower stats */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                                Borrowers
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <StatCard title="Total Borrowers" value={stats.borrowers.total} accent="blue" />
                                <StatCard title="Active" value={stats.borrowers.active} accent="green" />
                                <StatCard title="Defaulters" value={stats.borrowers.defaulters} accent="red" />
                                <StatCard title="Cleared" value={stats.borrowers.cleared} accent="yellow" />
                            </div>
                        </div>

                        {/* loan stats */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                                Loans
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <StatCard title="Total Loans" value={stats.loans.total} accent="blue" />
                                <StatCard title="Active" value={stats.loans.active} accent="green" />
                                <StatCard title="Completed" value={stats.loans.completed} accent="yellow" />
                                <StatCard title="Defaulters" value={stats.loans.defaulters} accent="red" />
                            </div>
                        </div>

                        {/* financial stats */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                                Financials
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <StatCard
                                    title="Total Amount Lent"
                                    value={`₹${stats.financials.totalAmountLent.toLocaleString()}`}
                                    accent="blue"
                                />
                                <StatCard
                                    title="Total Collected"
                                    value={`₹${stats.financials.totalAmountCollected.toLocaleString()}`}
                                    accent="green"
                                />
                                <StatCard
                                    title="Total Pending"
                                    value={`₹${stats.financials.totalAmountPending.toLocaleString()}`}
                                    accent="red"
                                />
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    )
}

export default Dashboard