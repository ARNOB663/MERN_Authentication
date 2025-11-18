import mongoose from "mongoose"

const connectDB = async () =>{
    try {
   await  mongoose.connect(`${process.env.MONGO_URI}/note_app`)
   console.log("mongoDB connected successfully")
    }
    catch (error){
        console.log("MongoDB connection error",error)
    }
   
}
export default connectDB