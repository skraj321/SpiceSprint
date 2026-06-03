import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import generateToken from "../utils/token.js";
import { sendOtpMail } from "../utils/mail.js";
dotenv.config();

//newUser registration
const register = async (req, res) => {
  try {
    const { name, email, password, mobile, role = "user" } = req.body;
    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, mobile, role });
    await newUser.save();

    const token = await generateToken({ id: newUser._id, role: newUser.role });
    
    res.cookie("token", token, {
      secure: true,
      sameSite:"none",
      maxAge: 2 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    res
      .status(201)
      .json({
        message: `User registered successfully: Name - ${name}, Email - ${email}`,
      });
  } catch (err) {
    console.error("Error saving user:", err);
    res.status(500).json({ error: "Failed to save user" });
  }
};

//User login (if already exists)
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userEmail = await User.findOne({ email });
    if (!userEmail) {
      return res.status(400).json({ error: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, userEmail.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Password do not match!" });
    }
    const token = await generateToken({ id: userEmail._id, role: userEmail.role });
    
      
    res.cookie("token", token, {
      secure: true,
      sameSite:"none",
      maxAge: 2 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    res
      .status(200)
      .json({
        message: "Login successful",
        user: {
          name: userEmail.name,
          email: userEmail.email,
          role: userEmail.role,
        },
        token,
      });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ error: "Failed to login" });
  }
};
// Logout user
const logout = async(req,res)=>{
  try{
    res.clearCookie("token");
    res.status(200).json({message: "Logged out successfully"});
  }catch(err){
    console.error("Error during logout:", err);
    res.status(500).json({ error: "Failed to logout" });
  }
}
//forgot password
const sendOtp = async (req,res) =>{
  try{
    const {email} =req.body;
    const user = await User.findOne({email})
    if(!user){
      return res.status(400).json({error: "User not found"});
    }
    const otp=Math.floor(1000 + Math.random() * 9000).toString();
    user.resetOtp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;
    user.isOtpVerified = false;
    await user.save();
    await sendOtpMail(user.email, otp);
    res.status(200).json({message: "OTP sent successfully"});
  }catch(err){
    console.error("Error during OTP sending:", err);
    res.status(500).json({ error: "Failed to send OTP" });
  }
}
// verify otp 
const verifyOtp = async (req,res) =>{
  try{
    const {email,otp} = req.body;
    const user = await User.findOne({email})
    if(!user){
      return res.status(400).json({error: "User not found"});
    } 
    if(user.resetOtp !== otp || user.otpExpiry < Date.now()){
      return res.status(400).json({error: "Invalid or expired OTP"});
    }
    user.isOtpVerified = true;
    user.resetOtp = undefined;
    user.otpExpiry = undefined;
    await user.save();
    res.status(200).json({message: "OTP verified successfully"});
  }catch(err){
    console.error("Error during OTP verification:", err);
    res.status(500).json({ error: "Failed to verify OTP" });
  }
}
// Resert password
const resetPassword = async (req,res) =>{
  try{
    const {email, newPassword}=req.body;
    const user = await User.findOne({email})
    if(!user || !user.isOtpVerified){
      return res.status(400).json({error: "User not found"});
    }
    const hashedPassword = await bcrypt.hash(newPassword,10);
    user.password = hashedPassword;
    user.isOtpVerified = false;
    await user.save();
    res.status(200).json({message: "Password reset successfully"});
  }catch(err){
    console.error("Error during password reset:", err);
    res.status(500).json({ error: "Failed to reset password" });
  }
}
export { register, login, logout, sendOtp, verifyOtp, resetPassword };

