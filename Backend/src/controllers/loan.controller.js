import { Loan } from "../models/loan.model.js"
import { Borrower } from "../models/borrower.model.js"
import { Payment } from "../models/payment.model.js"

const createLoan = async (req, res) => {
    try {
        const { borrowerId } = req.params
        const {
            principalAmount,
            interestRate,
            durationMonths,
            witness,
            startDate
        } = req.body

        // calculate totalAmount and emiAmount
        const totalInterest = (principalAmount * interestRate / 100) * (durationMonths / 12)
        const totalAmount = principalAmount + totalInterest
        const emiAmount = totalAmount / durationMonths

        const loan = new Loan({
            borrowerId,
            principalAmount,
            interestRate,
            durationMonths,
            totalAmount,
            emiAmount,
            stratDate: startDate || new Date(),
            witness: witness?.name ? witness : null
        })

        await loan.save()

        await Borrower.findByIdAndUpdate(borrowerId, { $push: { loans: loan._id } })

        res.status(201).json({
            success: true,
            loan
        })
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: `Failed to create a loan: ${err.message}`
        })
    }
}


const deleteLoan = async (req, res) => {
    try {
        const { loanId } = req.params

        const loan = await Loan.findById(loanId)
        if (!loan) {
            return res.status(404).json({
                success: false,
                message: `Loan not found`
            })
        }

        await Payment.deleteMany({ loanId })

        await Borrower.findByIdAndUpdate(
            loan.borrowerId,
            { $pull: { loans: loan._id } }
        )

        await Loan.findByIdAndDelete(loanId)

        res.status(200).json({
            success: true,
            message: `Loan and all associated payments deleted successfully`
        })
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: `Failed to delete loan: ${err.message}`
        })
    }
}


const getLoansByBorrower = async (req, res) => {
    try {
        const { borrowerId } = req.params
        const { status } = req.query

        const borrower = await Borrower.findById(borrowerId)
        if (!borrower) {
            return res.status(404).json({
                success: false,
                message: `Borrower not found`
            })
        }

        const filter = { borrowerId }

        if (status) {
            const validStatuses = ["active", "completed", "defaulter"]
            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`
                })
            }
            filter.status = status
        }

        const loans = await Loan.find(filter).populate('payments')

        res.status(200).json({
            success: true,
            count: loans.length,
            loans
        })
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: `Failed to get borrower's loans: ${err.message}`
        })
    }
}


const updateLoanWitness = async (req, res) => {
    try {
        const { loanId } = req.params
        const { witness } = req.body

        const loan = await Loan.findByIdAndUpdate(
            loanId,
            { witness },
            { new: true }
        )

        if (!loan) {
            return res.status(404).json({
                success: false,
                message: 'Loan not found'
            })
        }

        res.status(200).json({
            success: true,
            message: `Loan witness updated successfully`
        })
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: `Failed to update loan witness: ${err.message}`
        })
    }
}


const updateLoanStatus = async (req, res) => {
    try {
        const { loanId } = req.params
        const { status } = req.body

        const validStatuses = ["active", "completed", "defaulter"]
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`
            })
        }

        const loan = await Loan.findByIdAndUpdate(
            loanId,
            { status },
            { new: true }
        )

        if (!loan) {
            return res.status(404).json({
                success: false,
                message: `Loan not found`
            })
        }

        if (status === "defaulter") {
            await Borrower.findByIdAndUpdate(loan.borrowerId, { status: "defaulter" })
        }
        else if (status === "completed" || status === "active") {
            const allLoans = await Loan.find({ borrowerId: loan.borrowerId })
            const allCompleted = allLoans.every(l => l.status === "completed")

            if (allCompleted) {
                await Borrower.findByIdAndUpdate(loan.borrowerId, { status: "cleared" })
            } else {
                const hasDefaulter = allLoans.some(l => l.status === "defaulter")
                if (!hasDefaulter) {
                    await Borrower.findByIdAndUpdate(loan.borrowerId, { status: "active" })
                }
            }
        }

        res.status(200).json({
            success: true,
            message: `Loan status updated to "${status}"`,
            loan
        })
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: `Failed to update loan status: ${err.message}`
        })
    }
}


export { createLoan, deleteLoan, getLoansByBorrower, updateLoanWitness, updateLoanStatus }