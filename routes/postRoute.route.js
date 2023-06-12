const express=require("express")
const {PostModel}=require("../models/postModel.model")
const { auth } = require("../middleware/auth.middleware")
const postRoute=express()

postRoute.use(auth)

postRoute.get("/",async(req,res)=>{
    try {
        let q={userID:req.body.userID}
        const {page,min,max,device}=req.query
    
        if(device){
            q.device=device
        }
        if(min){
            q.no_of_comments={$gte:min}
        }
        if(max){
            q.no_of_comments={...q.no_of_comments,$lte:max}
        }
        const post=await PostModel.find(q)
        .skip((+page-1)*3)
        .limit(3)
        .sort({no_of_comments:1})

        res.status(200).json({msg:"here are the post",post})
    } catch (error) {
        res.status(400).json({msg:error})
    }
})


postRoute.post("/add",async(req,res)=>{
    try {
        const post=new PostModel(req.body)
        await post.save()
        console.log(post)
        res.status(200).json({msg:"post added successfully",post})
    } catch (error) {
        console.log(error)
        res.status(400).json({msg:error})
    }
})

postRoute.patch("/edit/:id",async(req,res)=>{
    const userIDinDoc=req.body.userID
    const {id}=req.params
    try {
        const data=await PostModel.findOne({_id:id})
        if(data.userID===userIDinDoc){
            const post=await PostModel.findByIdAndUpdate({_id:id},req.body)
            res.status(200).json({msg:"post updated successfully",post})
        }
        else{
            res.status(200).json({msg:"you don't have access",post})
        }
    } catch (error) {
        console.log(error)
        res.status(400).json({msg:error})
    }
})

postRoute.delete("/delete/:id",async(req,res)=>{
    const {id}=req.params
    try {
        const data=await PostModel.findOne({_id:id})
        if(data.userID===req.body.userID){
            const post=await PostModel.findByIdAndDelete({_id:id})
            res.status(200).json({msg:"post deleted successfully",post})
        }
        else{
            res.status(200).json({msg:"you don't have access"})
        }
    } catch (error) {
        console.log(error)
        res.status(400).json({msg:error})
    }
})


module.exports={
    postRoute
}