import {Loan} from "../models/loan.model.js"
import {Borrower} from "../models/borrower.model.js"

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

const getLoansByBorrower = async (req,res) => {
    try{
        const { borrowerId } = req.params

        const borrower = await Borrower.findById(borrowerId)
        if (!borrower) {
            return res.status(404).json({
                success: false,
                message: `Borrower not found`
            })
        }

        const loans = await Loan.find({ borrowerId }).populate('payments')

        res.status(200).json({
            success: true,
            count: loans.length,
            loans
        })
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: `Failed to get borrower's loan details- ${err.message}`
        })
    }
}


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


export {createLoan, getLoansByBorrower, updateLoanWitness}