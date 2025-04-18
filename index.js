const express=require("express")
const dotEnv=require("dotenv")
const mongoose=require("mongoose")
const bodyparser=require("body-parser")

const axios=require("axios")
const vendorRoutes=require('./routes/vendorRoutes')
const firmRoutes=require('./routes/firmRoutes')
const productRoutes=require('./routes/productRoutes')
const path=require('path')
const cors=require('cors')



const app=express()

app.use(cors())
const PORT=process.env.PORT ||4000

dotEnv.config();//access the Info in dotenv

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("MongoDB connected successfully")
})
.catch((err)=>console.log(err))


app.use(express.json())
app.use('/vendor',vendorRoutes)
app.use('/firm',firmRoutes)
app.use('/product',productRoutes)
app.use('/uploads',express.static('uploads') )

app.use("/",(req,res)=>{
    res.send("<h1>Welcome to INDIA<h1>")
})

app.listen(PORT,()=>{
    console.log(`server is running ${PORT}`)
})



