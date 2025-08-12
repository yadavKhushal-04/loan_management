import {Payment} from "../models/payment.model.js"
import {Loan} from "../models/loan.model.js"
import asyncHandler from "../utils/asyncHandle.js"

//addPayment function is still async
// const addPayment = asyncHandler(async (req,res) => {
const addPayment = async (req,res) => {
    try{
        const {loanId} = req.params
        const {
            amount,
            paymentDate,
            monthFor,
            method,
            note
        } = req.body

        const loan = await Loan.findById(loanId)

        if(!loan){
            return res.status(404).json({
                success: false,
                message: `Failed to find such loan`
            })
        }
    
        const payment = new Payment({
            loan: loanId,
            amount,
            paymentDate: paymentDate || new Date(),
            monthFor,
            method,
            note
        })
    
        await payment.save()
        
        loan.payments = loan.payments || []
        loan.payments.push(payment._id)

        await loan.save()
        // await Loan.findByIdAndUpdate(loanId, {$push: {payments: payment._id}})
    
        res.status(201).json({
            succesS: true,
            payment
        })
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: `Failed to update payment: ${err.message}`
        })
    }
}


const getPaymentsByLoan = async (req,res) => {
    try{
        const {loanId} = req.params
        const payments = await Payment.find({loan: loanId}).sort({paymentDate: 1})
        
        res.status(200).json({
            success: true,
            payments
        })
    }
    catch(err){
        res.status(500).json({
            success: false,
            messahe: `Failed to get payment details for this loan`
        })
    }
}


const getLoanSummary = async (req,res) => {
    try{
        const {loanId} = req.params
        const loan = await Loan.findById(loanId).populate('payments')

        if(!loan){
            return res.status(404).json({
                success: false,
                message: `Loan not found`
            })
        }

        const totalPaid = loan.payments.reduce((acc, payment) => acc + payment.amount, 0)
        const remainingAmount = loan.totalAmount - totalPaid

        res.status(200).json({
            success: true,
            summary: {
                loanId: loan._id,
                principalAmount: loan.principalAmount,
                totalAmount: loan.totalAmount,
                emiAmount: loan.emiAmount,
                totalPaid,
                remainingAmount,
                payments: loan.payments
            }
        })
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: `Failed to get loan summary: ${err.message}`
        })
    }
}

// asyncHandler(addPayment)

export {addPayment, getPaymentsByLoan, getLoanSummary}