import express from "express"

import {
    addPayment
} from "../controllers/payment.controller.js"

import {
    authenticateUser,
    requireRole
} from "../middlewares/auth.middleware.js"

const router = express.Router()

router.post('/:loanId', authenticateUser, requireRole('admin'), addPayment)

export default router