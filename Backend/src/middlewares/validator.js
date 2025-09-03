// middlewares/validators.js
import { body, validationResult } from 'express-validator';

const registerValidator = [
  body('userName').isString().notEmpty(),
  body('fullName').isString().notEmpty(),
  body('password').isLength({ min: 6 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
    next();
  }
];

const createLoanValidator = [
  body('principalAmount').isNumeric(),
  body('interestRate').isNumeric(),
  body('emiAmount').isNumeric(),
  body('totalMonths').isInt({ min: 1 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
    next();
  }
];

const addPaymentValidator = [
  body('amount').isNumeric(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
    next();
  }
];


export {registerValidator, createLoanValidator, addPaymentValidator};