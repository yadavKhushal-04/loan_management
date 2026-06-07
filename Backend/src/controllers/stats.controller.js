import { Borrower } from "../models/borrower.model.js"
import { Loan } from "../models/loan.model.js"
import { Payment } from "../models/payment.model.js"

const getDashboardStats = async (req, res) => {
    try {

        const [
            totalBorrowers,
            activeBorrowers,
            defaulterBorrowers,
            clearedBorrowers,
            totalLoans,
            activeLoans,
            completedLoans,
            defaulterLoans,
            amountLentResult,
            amountCollectedResult
        ] = await Promise.all([
            Borrower.countDocuments(),
            Borrower.countDocuments({ status: "active" }),
            Borrower.countDocuments({ status: "defaulter" }),
            Borrower.countDocuments({ status: "cleared" }),

            Loan.countDocuments(),
            Loan.countDocuments({ status: "active" }),
            Loan.countDocuments({ status: "completed" }),
            Loan.countDocuments({ status: "defaulter" }),

            // sum of all principal amounts
            Loan.aggregate([
                { $group: { _id: null, total: { $sum: "$principalAmount" } } }
            ]),

            // sum of all payments made
            Payment.aggregate([
                { $group: { _id: null, total: { $sum: "$amount" } } }
            ])
        ])

        const totalAmountLent = amountLentResult[0]?.total || 0
        const totalAmountCollected = amountCollectedResult[0]?.total || 0
        const totalAmountPending = totalAmountLent - totalAmountCollected

        res.status(200).json({
            success: true,
            stats: {
                borrowers: {
                    total: totalBorrowers,
                    active: activeBorrowers,
                    defaulters: defaulterBorrowers,
                    cleared: clearedBorrowers
                },
                loans: {
                    total: totalLoans,
                    active: activeLoans,
                    completed: completedLoans,
                    defaulters: defaulterLoans
                },
                financials: {
                    totalAmountLent,
                    totalAmountCollected,
                    totalAmountPending
                }
            }
        })
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: `Failed to fetch stats: ${err.message}`
        })
    }
}

export { getDashboardStats }