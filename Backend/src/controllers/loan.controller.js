import {Loan} from "../models/loan.model.js"
import {Borrower} from "../models/borrower.model.js"

const createLoan = async (req,res) => {
    try{
        const {borrowerId} = req.params
        const {amount, interestRate, emiAmount, totalMonth, startDate} = req.body

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

    }
    catch(err){
        res.status(500).json({
            success: false,
            message: `Failed to get borrower's loan details- ${err.message}`
        })
    }
}


export {createLoan, getLoansByBorrower}