import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// Connecting to the mongodb server
const Connecttomongo = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI )
        console.log("The database has been connected");
    }catch(err){
        console.log("Error while connecting to the database",err);
    }
    
}

export default Connecttomongo;