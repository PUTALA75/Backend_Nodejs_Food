
const Firm=require("../models/Firm")
const Vendor=require("../models/Vendor")
const multer=require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Directory where files will be stored
    },
    filename: function (req, file, cb) {
       cb(null, Date.now() +path.extname(file.originalname)); // Rename file
    }
  });

  const upload=multer({storage:storage})

const addFirm=async(req,res)=>{
   try {
    const {firmName,area,category,region,offer}=req.body
    const image=req.file? req.file.filename:undefined;

    const vendor=await Vendor.findById(req.vendorId)

    if(!vendor){
        res.status(404).json({message:"Vendor not Found"})
    }
    const firm=new Firm({
        firmName,area,category,region,offer,image,vendor:vendor._id
    })
    
    const savedFirm= await firm.save();
    
    vendor.firms.push(savedFirm._id);


    await vendor.save();
    
    return res.status(200).json({message:"Firm Added successfully"})
   } catch (error) {
    console.log(error)
    res.status(500).json("Internal server Error")
   }

}

const deleteFirmById=async(req,res)=>{
  try {
    const firmId=req.params.firmId;
    const deleteProduct=await Firm.findByIdAndDelete(firmId)

    if(!deleteProduct){
        return res.status(404).json({error:"No product found"})
    }
} catch (error) {
    console.error(error)
    res.status(500).json({error:"Internal Server Error"})

}
}

module.exports={addFirm:[upload.single("image"),addFirm],deleteFirmById}
