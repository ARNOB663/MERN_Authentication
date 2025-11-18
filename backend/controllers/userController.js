import { User } from "../models/userModel.js"

export const registerUser = async (req,res) =>{
 try{
      const {username,email,password} = req.body
      if(!username || !email || !password){
        return res.status(400).json({
            success:false,
            message:"All fields are required"
        })
      }
      const existingUser = await User
 }
 catch(error){
   return res.status(500).json({
    success:false,
    message:error.message
   })
 }

}