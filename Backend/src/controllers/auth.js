import {User} from "../models/users.model.js"

const registerUser = async (req,res) => {
    try{
        const {userName, fullName, password} = req.body

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

export {registerUser, loginUser}