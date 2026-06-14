import express from "express"
import { getDashboardStats } from "../controllers/stats.controller.js"
import { authenticateUser } from "../middlewares/auth.middleware.js"

const router = express.Router()

router.get('/', authenticateUser, getDashboardStats)

export default router