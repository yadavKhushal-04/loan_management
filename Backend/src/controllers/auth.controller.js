import {User} from "../models/users.model.js"
import jwt from "jsonwebtoken"

//no more new user needed
// const registerUser = async (req,res) => {
//     try{
//         // const {userName, fullName, password} = req.body
//         const { userName, fullName, password, role } = req.body;

//         if(!userName || !fullName || !password){
//             return res.status(400).json({
//                 success: false,
//                 message: `All the fields are required`
//             })
//         }

//         const existingUser = await User.findOne({userName})
//         if(existingUser){
//             return res.status(409).json({
//                 success: false,
//                 message: `UserName already exists.`
//             })
//         }

//         const user = new User({
//                             userName,
//                             fullName,
//                             password
//         })

//         await user.save()

//         const accessToken = user.generateAccessToken()
//         const refreshToken = user.generateRefreshToken()

//         res.status(201).json({
//             success: true,
//             message: `User successfully registered...`,
//             user,
//             accessToken,
//             refreshToken
//         })

//         // In register route:

//         // if (role && role !== 'viewer') {
//         //     // Only allow role elevation if the current user is admin (or skip role assignment entirely)
//         //     return res.status(403).json({ success: false, message: "You can't assign admin role directly" });
//         // }

//         // const newUser = new User({ userName, fullName, password, role: 'viewer' }); // force viewer


//     }
//     catch(error){
    
//         res.status(500).json({
//             success: false,
//             message: `Registration failed, ${error.message}`
            
//         })
//     }
// }


const loginUser = async (req,res) => {
    try{
        const {userName, password} = req.body

        const user = await User.findOne({userName})

        if(!user){
            return res.status(404).json({
                success: false,
                message: `invalid username or password!!`
            })
        }
        
        const isMatch = await user.validatePassword(password)
        if(!isMatch){
            return res.status(401).json({
                success: false,
                message: `invalid username or password!!`
            })
        }

        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        res.status(200).json({
            success: true,
            message: `Welcome ${user.fullName}`,
            user,
            accessToken,
            refreshToken
        })
    }
    catch(error){
        res.status(500).json({
            success: false,
            message: `Login failed... ${error.message}`
        })
    }
}

const refreshAccessToken = async (req, res) => {
    try {
        const { refreshToken } = req.body

        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: `Refresh token is required`
            })
        }

        let payload
        try {
            payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        }
        catch (err) {
            return res.status(401).json({
                success: false,
                message: `Invalid or expired refresh token: ${err.message}`
            })
        }

        const user = await User.findById(payload._id)
        if (!user) {
            return res.status(404).json({
                success: false,
                message: `User not found`
            })
        }

        if (user.refreshToken !== refreshToken) {
            return res.status(401).json({
                success: false,
                message: `Refresh token is invalid or has been revoked`
            })
        }

        const newAccessToken = user.generateAccessToken()

        res.status(200).json({
            success: true,
            accessToken: newAccessToken
        })
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: `Could not refresh access token: ${err.message}`
        })
    }
}

const logoutUser = async (req, res) => {
    try {
        // req.user is available because authenticateUser middleware runs first
        await User.findByIdAndUpdate(req.user._id, { refreshToken: null })

        res.status(200).json({
            success: true,
            message: `Logged out successfully`
        })
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: `Logout failed: ${err.message}`
        })
    }
}

const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: `User not found`
            })
        }

        res.status(200).json({
            success: true,
            user
        })
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: `Failed to get user: ${err.message}`
        })
    }
}

const updateMe = async (req, res) => {
    try {
        const { fullName, password } = req.body

        if (!fullName && !password) {
            return res.status(400).json({
                success: false,
                message: `Provide at least one field to update`
            })
        }

        const user = await User.findById(req.user._id)
        if (!user) {
            return res.status(404).json({
                success: false,
                message: `User not found`
            })
        }

        if (fullName) user.fullName = fullName
        if (password) user.password = password  // pre-save hook will hash it

        await user.save()

        res.status(200).json({
            success: true,
            message: `Profile updated successfully`,
            user
        })
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: `Failed to update profile: ${err.message}`
        })
    }
}


export {loginUser, refreshAccessToken, logoutUser, getMe, updateMe}