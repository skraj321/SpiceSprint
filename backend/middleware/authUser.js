import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const isAuth = async(req,res,next) =>{
    try{
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({error: "Unauthorized"});
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(500).json({error: "Internal Server Error"});
    }
}
