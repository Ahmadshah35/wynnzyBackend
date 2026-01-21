const mongoose=require("mongoose")

const reviewSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    managerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    stars:{
        type:Number,
        enum:[1,2,3,4,5],
        required:true
    },
    satisfaction:{
        type: String,
        enum: ["Poor", "Excellent", "Good", "Bad"],
        required: true
    },
    responsiveness:{
        type: String,
        enum: ["Poor", "Excellent", "Good", "Bad"],
        required: true
    },
    amenities:{
        type: String,
        enum: ["Poor", "Excellent", "Good", "Bad"],
        required: true
    },
    comment:{
        type:String,
        required:true
    },

},{timestamps:true})
const reviewModel=mongoose.model("review",reviewSchema)
module.exports=reviewModel
