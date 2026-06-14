import express from "express"

import {
    addPayment,
    deletePayment,
    getPaymentsByLoan,
    getLoanSummary
} from "../controllers/payment.controller.js"

import {
    authenticateUser,
    requireRole
} from "../middlewares/auth.middleware.js"

import { addPaymentValidator } from "../middlewares/validator.js"

const router = express.Router()

// router.post('/:loanId', authenticateUser, requireRole('admin'), addPayment)
router.route('/:loanId')
    .post(authenticateUser, requireRole('admin'), addPaymentValidator, addPayment)
    .get(authenticateUser, getPaymentsByLoan)

router.route('/:loanId/summary')
    .get(authenticateUser, getLoanSummary)

router.route('/:paymentId/delete')
    .delete(authenticateUser, requireRole('admin'), deletePayment)
                       
export default router