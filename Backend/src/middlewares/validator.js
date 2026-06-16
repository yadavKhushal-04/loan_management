// middlewares/validators.js
import { body, validationResult } from 'express-validator';


const validate = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map(e => ({
                field: e.path,
                message: e.msg
            }))
        })
    }
    next()
}



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
    body('principalAmount')
        .notEmpty().withMessage('Principal amount is required')
        .isNumeric().withMessage('Principal amount must be a number')
        .custom(val => val > 0).withMessage('Principal amount must be greater than 0'),
    body('interestRate')
        .notEmpty().withMessage('Interest rate is required')
        .isNumeric().withMessage('Interest rate must be a number'),
    body('durationMonths')
        .notEmpty().withMessage('Duration is required')
        .isInt({ min: 1 }).withMessage('Duration must be at least 1 month'),
    body('witness.name')
        .optional()
        .isString().withMessage('Witness name must be a string')
        .trim(),
    body('witness.phone')
        .optional()
        .isMobilePhone().withMessage('Witness phone must be a valid number'),
    body('witness.address')
        .optional()
        .isString().withMessage('Witness address must be a string')
        .trim(),
    validate
]

const addPaymentValidator = [
    body('amount')
        .notEmpty().withMessage('Amount is required')
        .isNumeric().withMessage('Amount must be a number')
        .custom(val => val > 0).withMessage('Amount must be greater than 0'),
    body('paidDate')
        .notEmpty().withMessage('Payment date is required')
        .isISO8601().withMessage('Payment date must be a valid date'),
    body('monthFor')
        .notEmpty().withMessage('Month is required')
        .matches(/^\d{4}-(0[1-9]|1[0-2])$/).withMessage('monthFor must be in YYYY-MM format'),
    body('method')
        .notEmpty().withMessage('Payment method is required')
        .isIn(['cash', 'upi']).withMessage('Method must be either cash or upi'),
    validate
]


const createBorrowerValidator = [
    body('name')
        .notEmpty().withMessage('Name is required')
        .isString().withMessage('Name must be a string')
        .trim(),
    body('phone')
        .notEmpty().withMessage('Phone is required')
        .isMobilePhone().withMessage('Phone must be a valid mobile number'),
    body('address')
        .optional()
        .isString().withMessage('Address must be a string')
        .trim(),
    validate
]

const updateBorrowerValidator = [
    body('name')
        .optional()
        .isString().withMessage('Name must be a string')
        .trim(),
    body('phone')
        .optional()
        .isMobilePhone().withMessage('Phone must be a valid mobile number'),
    body('address')
        .optional()
        .isString().withMessage('Address must be a string')
        .trim(),
    body()
        .custom((_, { req }) => {
            const { name, phone, address } = req.body
            if (!name && !phone && !address) {
                throw new Error('Provide at least one field to update')
            }
            return true
        }),
    validate
]

const updateBorrowerStatusValidator = [
    body('status')
        .notEmpty().withMessage('Status is required')
        .isIn(['active', 'defaulter', 'cleared'])
        .withMessage('Status must be one of: active, defaulter, cleared'),
    validate
]

const updateMeValidator = [
    body('fullName')
        .optional()
        .isString().withMessage('Full name must be a string')
        .trim(),
    body('password')
        .optional()
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body()
        .custom((_, { req }) => {
            const { fullName, password } = req.body
            if (!fullName && !password) {
                throw new Error('Provide at least one field to update')
            }
            return true
        }),
    validate
]


export {registerValidator, createLoanValidator, addPaymentValidator, createBorrowerValidator, updateBorrowerValidator, updateBorrowerStatusValidator, updateMeValidator};