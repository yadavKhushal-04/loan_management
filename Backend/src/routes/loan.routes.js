import express from "express"

import {
    createLoan,
    getLoansByBorrower,
    updateLoanWitness
} from "../controllers/loan.controller.js"

import {
    authenticateUser,
    requireRole
} from "../middlewares/auth.middleware.js"

import {createLoanValidator} from "../middlewares/validators.js"

const router = express.Router()

router.route('/:borrowerId')
                            .post(authenticateUser, requireRole('admin'), createLoan)
                            .get(authenticateUser, getLoansByBorrower)

router.route('/:loanId/witness').patch(authenticateUser, requireRole('admin'), updateLoanWitness)

export default router