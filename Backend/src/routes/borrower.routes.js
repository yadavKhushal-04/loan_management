import { authenticateUser, requireRole } from '../middlewares/auth.middleware.js';
import express from "express"
import {
    createBorrower,
    updateBorrower,
    deleteBorrower,
    getAllBorrowers,
    getBorrowerById,
    getOverdueBorrowers,
    updateBorrowerStatus
} from '../controllers/borrower.controller.js';

const router = express.Router()

router.get('/status/overdue', authenticateUser, requireRole('admin'), getOverdueBorrowers)

router.get('/', authenticateUser, getAllBorrowers)
router.post('/create', authenticateUser, requireRole('admin'), createBorrower)

router.get('/:id', authenticateUser, getBorrowerById)
router.patch('/:id', authenticateUser, requireRole('admin'), updateBorrower)
router.patch('/:id/status', authenticateUser, requireRole('admin'), updateBorrowerStatus)
router.delete('/:id', authenticateUser, requireRole('admin'), deleteBorrower)

//removed the function from controller.
// router.post('/:id/add-loan', authenticateUser, requireRole('admin'), addLoanToBorrower)

export default router
 