import express from "express"
import {
    registerUser,
    loginUser,
    refreshAccessToken,
    logoutUser,
    getMe,
    updateMe
} from "../controllers/auth.controller.js"

const router = express.Router()


router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/refresh', refreshAccessToken)
router.post('/logout', authenticateUser, logoutUser)
router.get('/me', authenticateUser, getMe)
router.patch('/me', authenticateUser, updateMe)

export default router