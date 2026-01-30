const mongoose=require("mongoose")

const reviewProductSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:true
    },
    variationId:{
        type:mongoose.Schema.Types.ObjectId
    },
    rating:{
        type:Number,
        enum:[1,2,3,4,5],
        required:true
    },
    comment:{
        type:String,
        required:true
    }
},{timestamps:true})
const reviewProductModel=mongoose.model("reviewProduct",reviewProductSchema)
module.exports=reviewProductModel