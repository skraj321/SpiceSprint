import express from "express";
import { body, validationResult } from "express-validator";
import { register,login, logout, sendOtp, verifyOtp,resetPassword } from "../controller/userController.js";
import { isAuth } from "../middleware/authUser.js";
import { getCurrentUser, sendContactMessage } from "../controller/userDetails.js";
import { updateUserLocation } from "../controller/userDetails.js";
const router=express.Router();
router.post("/register",register);
router.post("/login",login);
router.get("/logout",logout);
router.post("/send-msg",isAuth,sendContactMessage);
router.post("/send-otp",sendOtp);
router.post("/verify-otp",verifyOtp);
router.post("/reset-password",resetPassword);
router.get("/me",isAuth,getCurrentUser);
router.post("/update-location",isAuth,updateUserLocation);


export default router;