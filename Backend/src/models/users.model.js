import mongoose, {Schema as schema} from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new schema(
    {
        userName: {
            type: String,
            unique: true,
            required: true
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["admin", "viewer"],
            default: "admin",
            createdAt: {
                type: Date,
                dafault: Date.now
            }
        }
    }
)

userSchema.pre("save", function(next){
    if(!this.isModified(password)){
        return next()
    }

    this.password = bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.validatePassword = async function(password){
    return await bcrypt.compare(password, this.password)
}



export const User = new mongoose.model("User", userSchema)