const express=require("express")
const { connection } = require("./db")
const { userRoute } = require("./routes/userRoute.route")
const { postRoute } = require("./routes/postRoute.route")
var cors = require('cors')

const app=express()
app.use(cors())
require("dotenv").config()

app.use(express.json())

app.use("/users",userRoute)
app.use("/posts",postRoute)

//checking for deploy
//-----------------------------------------------------------------//
app.get("/home",(req,res)=>{
    try {
        res.json({mag:"this is the home page"})
    } catch (error) {
        res.json({msg:error})
    }
})
//--------------------------------------------------------//

app.listen(process.env.port,async()=>{
    try {
        await connection
        console.log(`server run at ${process.env.port}`)
    } catch (error) {
        console.log(error)
    }
})