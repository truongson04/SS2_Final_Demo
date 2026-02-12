import mongoose from "mongoose";

const forgotPasswordSchema = new mongoose.Schema({
    email:String,
    otp:String,
      expireAt:{
        type:Date,
        expires:180
    }
},
    {
        timestamps:true
    }
)
const Forgot = mongoose.model('Forgot', forgotPasswordSchema, 'forgotpasswords');
export default Forgot