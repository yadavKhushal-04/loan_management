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