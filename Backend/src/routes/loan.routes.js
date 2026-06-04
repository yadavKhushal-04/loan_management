import express from "express"

import {
    createLoan,
    getLoansByBorrower,
    updateLoanWitness,
    updateLoanStatus
} from "../controllers/loan.controller.js"

import {
    authenticateUser,
    requireRole
} from "../middlewares/auth.middleware.js"

import {createLoanValidator} from "../middlewares/validator.js"

const router = express.Router()

router.route('/:borrowerId')
                            .post(authenticateUser, requireRole('admin'), createLoanValidator , createLoan)
                            .get(authenticateUser, getLoansByBorrower)

router.route('/:loanId/witness').patch(authenticateUser, requireRole('admin'), updateLoanWitness)

router.route('/:loanId/status').patch(authenticateUser, requireRole('admin'), updateLoanStatus)

export default router