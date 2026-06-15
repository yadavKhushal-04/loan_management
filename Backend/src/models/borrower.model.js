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
        loans: [{
            type: schema.Types.ObjectId,
            ref: "Loan"
        }],
        status: {
            type: String,
            enum: ["active", "defaulter", "cleared"],
            default: "active"
        }
    },
    {
        timestamps: true
    }
)
export const Borrower = mongoose.model("Borrower", borrowerSchema);