import {Payment} from "../models/payment.model.js"
import {Loan} from "../models/loan.model.js"
import asyncHandler from "../utils/asyncHandle.js"

//addPayment function is still async
const addPayment = asyncHandler(async (req,res) => {
    const {loanId} = req.params
    const {amount, paymentDate} = req.body

    const payment = new Payment({
        loan: loanId,
        amount,
        paymentDate: paymentDate || new Date()
    })

    await payment.save()

    await Loan.findByIdAndUpdate(loanId, {$push: {payments: payment._id}})

    res.status(202).json({
        succesS: true,
        payment
    })
})

// asyncHandler(addPayment)

export default addPayment