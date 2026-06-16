import cron from "node-cron"
import { Loan } from "../models/loan.model.js"
import { Borrower } from "../models/borrower.model.js"
import { Payment } from "../models/payment.model.js"

const getPreviousMonth = () => {
    const now = new Date()
    const year = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear()
    const month = now.getMonth() === 0 ? 12 : now.getMonth()
    return `${year}-${String(month).padStart(2, '0')}`
}

export const runDefaulterCheck = async () => {
    try {
        const previousMonth = getPreviousMonth()
        console.log(`[DefaulterCheck] Running check for month: ${previousMonth}`)

        // get all active loans where loan started on or before previous month
        const activeLoans = await Loan.find({ status: 'active' })

        const defaulterBorrowerIds = new Set()
        const activeAgainBorrowerIds = new Set()

        for (const loan of activeLoans) {
            const loanStartMonth = new Date(loan.startDate)
                .toISOString().substring(0, 7)

            // skip loans that started this month — no payment due yet
            if (loanStartMonth >= getPreviousMonth()) continue

            // check if payment exists for previous month
            const payment = await Payment.findOne({
                loanId: loan._id,
                monthFor: previousMonth
            })

            if (!payment) {
                // no payment for last month → defaulter
                defaulterBorrowerIds.add(loan.borrowerId.toString())
            } else {
                // payment exists → potentially active again
                activeAgainBorrowerIds.add(loan.borrowerId.toString())
            }
        }

        // mark defaulters
        if (defaulterBorrowerIds.size > 0) {
            await Borrower.updateMany(
                { _id: { $in: [...defaulterBorrowerIds] } },
                { status: 'defaulter' }
            )
            console.log(`[DefaulterCheck] Marked ${defaulterBorrowerIds.size} borrower(s) as defaulter`)
        }

        // revert to active if they paid last month
        // only revert if they're not in the defaulter list
        const paidAndClean = [...activeAgainBorrowerIds].filter(
            id => !defaulterBorrowerIds.has(id)
        )

        if (paidAndClean.length > 0) {
            await Borrower.updateMany(
                {
                    _id: { $in: paidAndClean },
                    status: 'defaulter'  // only update if they were defaulter
                },
                { status: 'active' }
            )
            console.log(`[DefaulterCheck] Reverted ${paidAndClean.length} borrower(s) to active`)
        }

        console.log(`[DefaulterCheck] Done`)
    }
    catch (err) {
        console.error(`[DefaulterCheck] Failed: ${err.message}`)
    }
}

// runs every day at midnight
const scheduleDefaulterCheck = () => {
    cron.schedule('0 0 * * *', () => {
        console.log(`[DefaulterCheck] Scheduled job triggered`)
        runDefaulterCheck()
    })
    console.log(`[DefaulterCheck] Job scheduled — runs daily at midnight`)
}

export default scheduleDefaulterCheck