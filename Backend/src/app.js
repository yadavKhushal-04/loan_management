import express, { urlencoded } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"


import authRoutes from "./routes/auth.routes.js"
import borrowerRoutes from "./routes/borrower.routes.js"
import loanRoutes from "./routes/loan.routes.js"
import paymentRoutes from "./routes/payment.routes.js"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "100kb"}))
app.use(express.urlencoded({extended:true, limit: "100kb"}))
app.use(express.static("public"))
app.use(cookieParser())

app.use('/api/auth', authRoutes)
app.use('/api/borrowers', borrowerRoutes)
app.use('/api/loans', loanRoutes)
app.use('/api/payments', paymentRoutes)

// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/borrowers', require('./routes/borrowers'));


export {app}