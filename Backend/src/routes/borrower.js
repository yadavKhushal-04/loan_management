import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import {
    getBorrowers,
    createBorrower
} from '../controllers/borrowers.js';

const router = express.Router();

router.route('/')
    .get(authenticateToken, getBorrowers)
    .post(authenticateToken, createBorrower);

export default router;
