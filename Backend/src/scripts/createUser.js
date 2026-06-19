// Run this locally whenever you need to create a new account.
// Usage: node scripts/createUser.js

import mongoose from "mongoose"
import dotenv from "dotenv"
import { User } from "../src/models/users.model.js"

dotenv.config()

const createUser = async () => {
    await mongoose.connect(process.env.MONGODB_URI)

    // ---- edit these before running ----
    const userName = "newusername"
    const fullName = "New User Full Name"
    const password = "choose_a_strong_password"
    const role = "viewer"   // or "admin"
    // ------------------------------------

    const existing = await User.findOne({ userName })
    if (existing) {
        console.log(`User "${userName}" already exists`)
        process.exit(0)
    }

    const user = new User({ userName, fullName, password, role })
    await user.save()   // password gets hashed automatically by the pre-save hook

    console.log(`User "${userName}" created successfully with role "${role}"`)
    process.exit(0)
}

createUser().catch(err => {
    console.error("Failed to create user:", err.message)
    process.exit(1)
})