import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useBorrowerStore } from "../store/borrowerStore"
import Navbar from "../components/Navbar"
import Loader from "../components/Loader"
import api from "../api/axios"
import toast from "react-hot-toast"

const statusColors = {
    active: "bg-green-100 text-green-700",
    defaulter: "bg-red-100 text-red-700",
    cleared: "bg-yellow-100 text-yellow-700"
}

const Borrowers = () => {
    const navigate = useNavigate()
    const { borrowers, meta, loading, fetchBorrowers } = useBorrowerStore()

    const [search, setSearch] = useState("")
    const [status, setStatus] = useState("")
    const [page, setPage] = useState(1)

    // why this pattern: whenever search, status or page changes,
    // re-fetch borrowers with the updated filters
    useEffect(() => {
        fetchBorrowers({ search, status, page })
    }, [search, status, page])

    const handleSearchChange = (e) => {
        setSearch(e.target.value)
        setPage(1)  // reset to page 1 on new search
    }

    const handleStatusChange = (e) => {
        setStatus(e.target.value)
        setPage(1)
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-6xl mx-auto px-6 py-10">

                {/* header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Borrowers</h2>
                    <button
                        onClick={() => navigate('/borrowers/new')}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                    >
                        + Add Borrower
                    </button>
                </div>

                {/* search + filter */}
                <div className="flex gap-3 mb-6">
                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={search}
                        onChange={handleSearchChange}
                        className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                        value={status}
                        onChange={handleStatusChange}
                        className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="defaulter">Defaulter</option>
                        <option value="cleared">Cleared</option>
                    </select>
                </div>

                {/* table */}
                {loading ? <Loader /> : (
                    <>
                        <div className="bg-white rounded-xl shadow overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                                    <tr>
                                        <th className="px-6 py-3 text-left">Name</th>
                                        <th className="px-6 py-3 text-left">Phone</th>
                                        <th className="px-6 py-3 text-left">Address</th>
                                        <th className="px-6 py-3 text-left">Status</th>
                                        <th className="px-6 py-3 text-left">Loans</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {borrowers.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="text-center py-10 text-gray-400">
                                                No borrowers found
                                            </td>
                                        </tr>
                                    ) : (
                                        borrowers.map(borrower => (
                                            <tr
                                                key={borrower._id}
                                                onClick={() => navigate(`/borrowers/${borrower._id}`)}
                                                className="hover:bg-gray-50 cursor-pointer transition-colors"
                                            >
                                                <td className="px-6 py-4 font-medium text-gray-800 capitalize">
                                                    {borrower.name}
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">{borrower.phone}</td>
                                                <td className="px-6 py-4 text-gray-600">{borrower.address || '—'}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[borrower.status]}`}>
                                                        {borrower.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">
                                                    {borrower.loans?.length || 0}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* pagination */}
                        {meta && meta.totalPages > 1 && (
                            <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
                                <span>
                                    Page {meta.page} of {meta.totalPages} — {meta.total} borrowers
                                </span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setPage(p => p - 1)}
                                        disabled={!meta.hasPrevPage}
                                        className="px-3 py-1.5 border rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
                                    >
                                        Prev
                                    </button>
                                    <button
                                        onClick={() => setPage(p => p + 1)}
                                        disabled={!meta.hasNextPage}
                                        className="px-3 py-1.5 border rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default Borrowers