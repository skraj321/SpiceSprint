import User from "../models/User.js"
import Contact from "../models/Contact.js";

export const getCurrentUser = async (req,res)=>{
    try{
        const getUserId = req.user.id;
        if(!getUserId){
            return res.status(404).json({error: "UserId not found"});
        }
        const user = await User.findById(getUserId);
        if(!user){
            return res.status(404).json({error: "User not found"});
        }
        return res.status(200).json({user});
    }catch(err){
        return res.status(500).json({error: "Internal Server Error"});
    }
}

export const updateUserLocation = async(req,res) =>{
    try{
        const {lat,long}=req.body;
        const userId = req.user.id;
        const user = await User.findByIdAndUpdate(userId,{
            location:{
                type:"Point",
                coordinates:[long,lat]
            }
        },{new:true});
        if(!user){
            return res.status(404).json({error: "User not found"});
        }
        return res.status(200).json({message: "Location updated successfully"});
    }catch(err){
        return res.status(500).json({error: "Update Location Server Error"});
    }
}

export const sendContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const contact = await Contact.create({
      name,
      email,
      message,
    });
    res.status(200).json({
      msg: "Contact Data Saved",
      contact,
    });
  } catch (err) {
    console.error("Contact Error:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
