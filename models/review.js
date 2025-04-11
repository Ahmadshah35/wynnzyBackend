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
    comment:{
        type:String,
        required:true
    },
    rating:{
        type:Number,
        enum:[0,1,2,3,4,5],
        required:true
    }

},{timestamps:true})
const reviewModel=mongoose.model("review",reviewSchema)
module.exports=reviewModel
