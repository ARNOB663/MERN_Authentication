import { verifyMail } from "../emailVerify/verifyMail.js"
import { User } from "../models/userModel.js"
import { Session } from "../models/sessionModel.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
export const registerUser = async (req,res) =>{
 try{
      const {username,email,password} = req.body
      if(!username || !email || !password){
        return res.status(400).json({
            success:false,
            message:"All fields are required"
        })
      }
      const existingUser = await User.findOne({email})
      if(existingUser){
         return res.status(400).json({
            success:false,
            message:"User already exists"
          })
      }
      
      const hashedPassword= await bcrypt.hash(password,10)

      const newUser = await User.create({
        username,
        email,
        password:hashedPassword
      })
      const token = jwt.sign({id:newUser._id,},
        process.env.SECRET_KEY,{expiresIn:"10m"}
    )
      verifyMail(token,email)
      newUser.token=token
      await newUser.save()
      return res.status(201).json({
        success:true,
        message:"User registered successfully",
        data:newUser
      })
 }
 catch(error){
   return res.status(500).json({
    success:false,
    message:error.message
   })
 }

}

export const verification =async (req,res) =>{
  
  try{
       const authHeader = req.headers.authorization;
       if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({
            success:false,
            message:"Authorization token missing or invalid"
        })
       }

       const token = authHeader.split(' ')[1];

       let decoded;
       try{
          decoded = jwt.verify(token,process.env.SECRET_KEY)
       }
       catch(error){
        if(error.name === 'TokenExpiredError'){
            return res.status(401).json({
                success:false,
                message:"Token has expired"
            })
        }
        return res.status(401).json({
            success:false,
            message:"Token verification failed"
        })
       }
       const user = await User.findById(decoded.id)
       if(!user){
        return res.status(404).json({
            success:false,
            message:"User not found"
        })
       }

        user.token = null
        user.isVerified = true
        await user.save()

        return res.status(200).json({
            success:true,
            message:"Email verified successfully"
        })
  }
  catch(error){
    return res.status(500).json({
     success:false,
     message:error.message
    })
  }

}

//login 
export const loginUser = async(req,res) =>{
   try{

    const {email,password} = req.body;
      if(!email || !password){
        return res.status(400).json({
            success:false,
            message:"All fields are required"
        })
      }

      const user = await User.findOne({email})
      if(!user){
        return res.status(404).json({
            success:false,
            message:"Unregistered access"
        })
      }

      const passwordCheck = await bcrypt.compare(password,user.password)

      if(!passwordCheck){
        return res.status(402).json({
            success:false,
            message:"Incorrect password"
        })
      }
      //check if user is verified
      if(user.isVerified !== true){
        return res.status(403).json({
            success:false,
            message:"Verify your email to login"
        })
      }
      //check for existing session and delete it
      const existingSession = await Session.findOne({userId:user._id})
      if(existingSession){
        await Session.deleteOne({userId:user._id})
      }

      //create new session
      await Session.create({userId:user._id})

      //generate token
      const accessToken = jwt.sign({id:user._id},
        process.env.SECRET_KEY,{expiresIn:"10d"})

      const refreshSecret = process.env.REFRESH_SECRET_KEY || process.env.SECRET_KEY
      if(!refreshSecret){
        return res.status(500).json({ success:false, message: 'Server JWT secret not configured' })
      }
      const refreshToken = jwt.sign({id:user._id}, refreshSecret, {expiresIn:"30d"})

      user.isLoggedIn = true
      await user.save()
      return res.status(200).json({
        success:true,
        message:`Welcome back ${user.username}`,
        accessToken,
        refreshToken,
        user
      })
   }
    catch(error){
        return res.status(500).json({
          success:false,
          message:error.message
        })
      
    }

}
//logout
export const logoutUser = async (req, res) => {
  try {
    const userId = req.userId || (req.user && (req.user.id || req.user._id));
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized: user id missing' });
    }
    await Session.deleteOne({ userId: userId });
    await User.findByIdAndUpdate(userId, { isLoggedIn: false });
  return res.status(200).json({
    success:true,
    message:"Logged out successfully"
  })

 }
  catch(error){
    return res.status(500).json({
      success:false,
      message:error.message
    })
  }

}