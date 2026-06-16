import mongoose, {Schema as schema} from "mongoose"

const paymentSchema = new schema(
    {
        loanId: {
            type: schema.Types.ObjectId,
            ref: "Loan",
            required: true
        },
        amount: {
            type: Number,
            required: true,
        },
        paidDate: {
            type: Date,
            default: Date.now
        },
        monthFor: {
            type: String,
            required: true
        },
        method: {
            type: String,
            enum: ["cash", "upi"],
            required: true,
            default: "cash"
        },
        note: {
            type: String,
            default: null
        }
    }
)

export const Payment = new mongoose.model("Payment", paymentSchema)