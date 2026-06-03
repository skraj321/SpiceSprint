import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verify SMTP connection when server starts
transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP Verify Error:", error);
  } else {
    console.log("SMTP Server Ready");
  }
});

export const sendOtpMail = async (to, otp) => {
  try {
    console.log("Before sendMail");

    const info = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: "Your OTP for SpiceSprint",
      text: `Your OTP for SpiceSprint is: ${otp}`,
    });

    console.log("After sendMail");
    console.log("Message Sent:", info.messageId);

    return true;
  } catch (error) {
    console.error("OTP Mail Error:", error);
    throw error;
  }
};

export const sendDelOtpMail = async (user, otp) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: user.email,
      subject: "Delivery OTP",
      text: `Your OTP for Delivery is: ${otp}`,
    });

    console.log("Delivery OTP Sent:", info.messageId);

    return true;
  } catch (error) {
    console.error("Delivery OTP Error:", error);
    throw error;
  }
};