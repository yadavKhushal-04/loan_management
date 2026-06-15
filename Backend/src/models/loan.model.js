import mongoose, {Schema as schema} from "mongoose"

const loanSchema = new schema(
    {
        borrowerId: {
            type: schema.Types.ObjectId,
            ref: "Borrower",
            required: true
        },
        principalAmount: {
            type: Number,
            required: true
        },
        interestRate: {
            type: Number,
            required: true
        },
        totalAmount: {
            type: Number,
            required: true
        },
        emiAmount: {
            type: Number,
            required: true
        },
        durationMonths: {
            type: Number,
            required: true
        },
        startDate: {
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            enum: ["active", "completed", "defaulter"],
            default: "active"
        },
        temporaryFlag: {
            type: Boolean,
            default: false
        },
        witness: {
            name: {
                type: String,
                required: true
            },
            phone: {
                type: String,
            },
            address: {
                type: String
            }
        },
        payments: [{
            type: schema.Types.ObjectId,
            ref: 'Payment'
        }],
        createdAt: {
            type: Date,
            default: Date.now
        }
    }
)

export const Loan = new mongoose.model("Loan", loanSchema)