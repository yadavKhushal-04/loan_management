import mongoose, {Schema as schema} from "mongoose"

const paymentSchema = new schema(
    {
        loadId: {
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
        },
        note: {
            type: String
        }
    }
)

export const Payment = new mongoose.model("Payment", paymentSchema)