import mongoose, {Schema as schema} from "mongoose"

const loanSchema = new schema(
    {
        borrowerId: {
            type: schema.Types.ObjectId,
            ref: "Borrower",
            required: true
        },
        principleAmount: {
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
            required: true
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
                type: string
            }
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }
)

export const Loan = new mongoose.model("Loan", loanSchema)