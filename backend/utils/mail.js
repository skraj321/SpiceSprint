import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendOtpMail = async (to, otp) => {
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject: "Your OTP for Spicesprint",
    text: `Your OTP for Spicesprint is: ${otp}`,
  })
}

export const sendDelOtpMail = async (user, otp) => {
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to:user.email,
    subject: "Delivery Otp",
    text: `Your OTP for Delivery is: ${otp}`,
  })
}