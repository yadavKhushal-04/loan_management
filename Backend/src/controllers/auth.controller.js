import {User} from "../models/users.model.js"
import jwt from "jsonwebtoken"

const registerUser = async (req,res) => {
    try{
        // const {userName, fullName, password} = req.body
        const { userName, fullName, password, role } = req.body;

        if(!userName || !fullName || !password){
            return res.status(400).json({
                success: false,
                message: `All the fields are required`
            })
        }

        const existingUser = await User.findOne({userName})
        if(existingUser){
            return res.status(409).json({
                success: false,
                message: `UserName already exists.`
            })
        }

        const user = new User({
                            userName,
                            fullName,
                            password
        })

        await user.save()

        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        res.status(200).json({
            success: true,
            message: `User successfully registered...`,
            user,
            accessToken,
            refreshToken
        })

        // In register route:

        if (role && role !== 'viewer') {
            // Only allow role elevation if the current user is admin (or skip role assignment entirely)
            return res.status(403).json({ success: false, message: "You can't assign admin role directly" });
        }

        const newUser = new User({ userName, fullName, password, role: 'viewer' }); // force viewer


    }
    catch(error){
    
        res.status(500).json({
            success: false,
            message: `Registration failed, ${error.message}`
            
        })
    }
}


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


const refreshAccessToken = async (req,res) => {
    try{
        const {refreshToken} = req.body

        if(!refreshToken){
            return res.status(400).json({
                success: false,
                message: `Refresh Token is required`
            })
        }

        let payload;

        try{
            payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        }
        catch(err){
            return res.status(500).json({
                success: false,
                message: `Invalid or expired refresh token, ${err.message}`
            })
        }

        const user = await User.findById(payload._id)
        if(!user){
            return res.status(400).json({
                success: false,
                message
            })
        }
    }
    catch(err){
        res.send(500).json({
            success: false,
            message: `Could not refresh access token, ${err.message}`
        })
    }
}

export {registerUser, loginUser, refreshAccessToken}