import mongoose from "mongoose"
const userschema=new mongoose.Schema({
    name:{
      type:String,
      required:true
    },
    email:{
       type:String,
      required:true,
      unique: true,
    },
    password:{
        type:String,
      required:true
    },
},
{timestamps:true}
)
const User=mongoose.model("user",userschema)
export default User
