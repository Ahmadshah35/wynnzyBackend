const mongoose=require("mongoose")

const adminSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    otp:{
        type:Number
    },
    isVerified:{
        type:Boolean,
        default:false
    }
})

const adminModel=mongoose.model("admin",adminSchema)
module.exports=adminModel
