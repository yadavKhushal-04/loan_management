import { authenticateUser, requireRole } from '../middlewares/auth.middleware.js';
import express from "express"
import {
    createBorrower,
    addLoanToBorrower,
    getAllBorrowers,
    getBorrowerById,
    getOverdueBorrowers,
    updateBorrowerStatus
} from '../controllers/borrower.controller.js';

const router = express.Router()

router.post('/create', authenticateUser, requireRole('admin'), createBorrower);
router.post('/:id/add-loan', authenticateUser, requireRole('admin'), addLoanToBorrower);

router.get('/', authenticateUser, getAllBorrowers); // any logged-in user
router.get('/status/overdue', authenticateUser, requireRole('admin'), getOverdueBorrowers);
router.get('/:id', authenticateUser, getBorrowerById);
router.patch('/:id/status', authenticateUser, requireRole('admin'), updateBorrowerStatus)

export default router
 