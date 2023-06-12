const mongoose=require("mongoose")

const postSchema=mongoose.Schema({
    title:String,
    body:String,
    device:{type:String,enum:["Laptop","Mobile","Tab"]},
    no_of_comments:Number,
    userID:String,
    user:String
},{
    versionKey:false
})

const PostModel=mongoose.model("post",postSchema)

module.exports={
    PostModel
}