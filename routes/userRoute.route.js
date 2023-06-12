const express=require("express")
const {UserModel}=require("../models/userModel.model")
const userRoute=express.Router()
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const { BlacklistModel } = require("../models/Blacklist.model");
//const { blacklist } = require("../../../../../sprint-3/day-4/assignments/blacklist");

userRoute.post("/register",async(req,res)=>{
    const {email,name,pass,gender,age,city,is_married}=req.body
    try {
        const user=await UserModel.findOne({email})
        if(user){
            res.status(200).json({msg:"user already exist, please Login!! "})
        }
        else{
            bcrypt.hash(pass, 6, async(err, hash)=> {
                if(hash){
                    const data=new UserModel({name,email,gender,pass:hash,age,city,is_married})
                    await data.save()
                    res.status(200).json({msg:"user registered successfully!!",data})
                }
                else{
                    res.status(200).json({msg:"password not hash",err})
                }
            });
        }
    } catch (error) {
        res.status(400).json({msg:error})
    }
})

userRoute.post("/login",async(req,res)=>{
    const {name,email,pass}=req.body
    try {
        const user=await UserModel.findOne({email})
        if(user){
            bcrypt.compare(pass, user.pass, async(err, result)=> {
                if(result){
                    var token = jwt.sign({userID:user._id,user:user.name}, 'eval_practice',{
                        expiresIn: 120
                    });

                    const refreshtoken=jwt.sign({userID:user._id,user:user.name},"eval_practice",{
                        expiresIn: 300
                    })
                    console.log(user._id)
                    res.status(200).json({msg:"Login successfully",token,user,refreshtoken})
                }
            });
        }
        else{
            res.status(200).json({msg:"user not found, register first!!"})
        }
    } catch (error) {
        res.status(400).json({msg:error})
    }
})

userRoute.get("/logout",async(req,res)=>{
    try {
        const token=req.headers.authorization?.split(" ")[1]
        if(token){
            await BlacklistModel.updateMany({}, { $push: {blacklist:[token]}})
            res.status(200).json({msg:"Logout successfully!!"})
        }
    } catch (error) {
        res.status(400).json({msg:error})
    }
})

userRoute.get("/refreshtoken", async(req,res)=>{
    try {
        const token=req.headers.authorization?.split(" ")[1]
        const decoded=jwt.verify(token,"eval_practice")
        const newToken= jwt.sign({userID:decoded.userID,user:decoded.user},"eval_practice",{
            expiresIn: 120
        })
        res.status(200).json({msg:"token generated", newToken})
    } catch (error) {
        res.status(400).json({msg:error})
    }
})
module.exports={
    userRoute
}