import {Loan} from "../models/loan.model.js"
import {Borrower} from "../models/borrower.model.js"
import {Payment} from "../models/payment.model.js"

const createLoan = async (req,res) => {
    try{
        const {borrowerId} = req.params
        const {
                amount,
                interestRate,
                emiAmount,
                totalMonths,
                startDate
            } = req.body

        const loan = new Loan({
            borrower: borrowerId,
            amount,
            interestRate,
            emiAmount,
            totalMonths,
            startDate: startDate || new Date()
        })

        await loan.save()

        await Borrower.findByIdAndUpdate(borrowerId, {$push: {loans: loan._id}})

        res.status(201).json({
            success: true,
            loan
        })
    }
    catch(err){
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

        // delete all payments for this loan
        await Payment.deleteMany({ loanId })

        // remove loan reference from borrower
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



// const getLoansByBorrower = async (req,res) => {

//     try {
//         const { borrowerId } = req.params
//         const { status } = req.query

//         const borrower = await Borrower.findById(borrowerId)
//         if (!borrower) {
//             return res.status(404).json({
//                 success: false,
//                 message: `Borrower not found`
//             })
//         }

//         const filter = { borrowerId }

//         if (status) {
//             const validStatuses = ["active", "completed", "defaulter"]
//             if (!validStatuses.includes(status)) {
//                 return res.status(400).json({
//                     success: false,
//                     message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`
//                 })
//             }
//             filter.status = status
//         }

//         const loans = await Loan.find(filter).populate('payments')

//         res.status(200).json({
//             success: true,
//             count: loans.length,
//             loans
//         })
//     }
//     catch (err) {
//         res.status(500).json({
//             success: false,
//             message: `Failed to get borrower's loan details: ${err.message}`
//         })
//     }
// }


const updateLoanWitness = async (req,res) => {
    try{
        const {loanId} = req.params
        const {witness} = req.body

        const loan = await Loan.findByIdAndUpdate(
            loanId,
            {witness},
            {new: true}
        )

        if(!loan){
            return res.status(404).json({
                success: false,
                message: 'Loan not found'
            })
        }

        res.status(201).json({
            success: true,
            message: `Loan witness updated successfully`
        })
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: `Failed to update Loan Witness`
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

        // auto-update borrower status based on loan status
        if (status === "defaulter") {
            await Borrower.findByIdAndUpdate(loan.borrowerId, { status: "defaulter" })
        }

        else if (status === "completed" || status === "active") {
            // check if ALL loans of this borrower are completed
            const allLoans = await Loan.find({ borrowerId: loan.borrowerId })
            const allCompleted = allLoans.every(l => l.status === "completed")

            if (allCompleted) {
                await Borrower.findByIdAndUpdate(loan.borrowerId, { status: "cleared" })
            } else {
                // if a loan is moved back to active/completed, make sure
                // borrower isn't stuck as defaulter if no defaulter loans remain
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


export {createLoan, deleteLoan, getLoansByBorrower, updateLoanWitness, updateLoanStatus}