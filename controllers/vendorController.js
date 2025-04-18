


const Vendor=require('../models/Vendor')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcryptjs')
const dotenv=require("dotenv")

dotenv.config();

const secretKey=process.env.WHATISYOURNAME

const vendorRegister=async(req,res)=>{
    console.log("Register Request Body:", req.body);
    const {username,email,password}=req.body;  
    
    try{
        const vendorEmail=await Vendor.findOne({email});
        if(vendorEmail){
            return res.status(400).json("Email Already taken")
        }
        const hashpassword=await bcrypt.hash(password,10)

        const newVendor=new Vendor({
            username,             //create a new instance and store database
            email,
            password:hashpassword
        })
        await newVendor.save();
        res.status(201).json({message:"Vendor register successfully"})
        console.log("registered")
    }catch(err){
        res.status(500).json({err:"Internal server Error in Backend"})
        console.err({err:"Vendor not registered"})
    }


}

/*

const vendorLogin=async(req,res)=>{
    const {email,password}=req.body;
    try{
        const vendor=await Vendor.findOne({email});
        if(!vendor || !(await bcrypt.compare(password,vendor.password))){
            res.status(401).json({error: "Invalid Username or password"})
        }
        const token=jwt.sign({vendorId:vendor._id},secretKey,{expiresIn:"1h"})

        res.status(200).json({success:"Login successful",token})

    }catch(err){
        console.log(err)
        res.status(500).json({err:"Internal server error"})
    }
}
    */


const vendorLogin = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const vendor = await Vendor.findOne({ email });
      if (!vendor || !(await bcrypt.compare(password, vendor.password))) {
        return res.status(401).json({ error: "Invalid email or password" }); // Add return here
      }
  
      const token = jwt.sign({ vendorId: vendor._id }, secretKey, { expiresIn: "1h" });
      return res.status(200).json({ success: "Login successful", token }); // Also return here
  
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  };
  

const getAllVendors=async(req,res)=>{
    try {
        const vendors = await Vendor.find().populate('firms');

        res.json({vendors})
    } catch (error) {
        console.log(error)
        res.status(500).json({error:"Internal server error"})
    }
}

const getVendorById=async(req,res)=>{
    const vendorId=req.params.id;
    try {
        const vendor=await Vendor.findById(vendorId).populate('firms')
        if(!vendor){
            return res.status(404).json({error:"Vendor not found"})

        }
        res.status(200).json({vendor})
    } catch (error) {
        console.log(error)
        res.status(500).json({error:"Internal server error"})

    }
}


module.exports={vendorRegister,vendorLogin,getAllVendors,getVendorById}