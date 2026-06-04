import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  connectionTimeout: 10000, // 10 seconds timeout
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

export const sendOtpMail = async (to, otp) => {
  console.log("SMTP_USER:", process.env.SMTP_USER);
console.log("SMTP_PASS EXISTS:", !!process.env.SMTP_PASS);
console.log("Before sendMail");
  try {
    const info = await transporter.sendMail({
      from: '"SpiceSprint" <spicesprintsaheb@gmail.com>',
      to,
      subject: "Your OTP for SpiceSprint",
      html: `
        <h2>SpiceSprint OTP Verification</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP is valid for 5 minutes.</p>
      `,
    });
console.log("After sendMail");
    console.log("OTP Email Sent:", info.messageId);
  } catch (error) {
    console.error("Brevo Error:", error);
    throw error;
  }
};

export const sendDelOtpMail = async (user, otp) => {
  try {
    const info = await transporter.sendMail({
      from: '"SpiceSprint" <spicesprintsaheb@gmail.com>',
      to: user.email,
      subject: "Delivery OTP",
      html: `
        <h2>Delivery Verification</h2>
        <h1>${otp}</h1>
      `,
    });

    console.log("Delivery OTP Sent:", info.messageId);
  } catch (error) {
    console.error("Brevo Error:", error);
    throw error;
  }
};