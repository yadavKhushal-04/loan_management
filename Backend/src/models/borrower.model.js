import mongoose, {Schema as schema} from "mongoose"

const borrowerSchema = new schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            index: true,
        },
        phone: {
            type: String,
            required: true,
        },
        address: {
            type: String,
        },
        loans: {
            type: Schema.Types.ObjectId,
            ref: "Loan"
        }
    },
    {
        timestamps: true
    }
)
export const Borrower = mongoose.model("Borrower", borrowerSchema);