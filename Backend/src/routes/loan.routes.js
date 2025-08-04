import express from "express"

import {
    createLoan,
    getLoansByBorrower
} from "../controllers/loan.controller.js"

import {
    authenticateUser,
    requireRole
} from "../middlewares/auth.middleware.js"

const router = express.Router()

router.route('/:borrowerId')
                            .post(authenticateUser, requireRole('admin', createLoan))
                            .get(authenticateUser, getLoansByBorrower)

export default router