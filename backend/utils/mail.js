import dotenv from "dotenv";

dotenv.config();

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

export const sendOtpMail = async (to, otp) => {
  console.log("Before sending via Brevo API");
  
  if (!process.env.BREVO_API_KEY) {
    throw new Error("BREVO_API_KEY is missing in Render environment variables");
  }

  try {
    const response = await fetch(BREVO_API_URL, {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: { name: "SpiceSprint", email: "spicesprintsaheb@gmail.com" },
        to: [{ email: to }],
        subject: "Your OTP for SpiceSprint",
        htmlContent: `
          <h2>SpiceSprint OTP Verification</h2>
          <p>Your OTP is:</p>
          <h1>${otp}</h1>
          <p>This OTP is valid for 5 minutes.</p>
        `,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Brevo API Error: ${JSON.stringify(data)}`);
    }

    console.log("After sendMail. OTP Email Sent Successfully:", data.messageId || data);
  } catch (error) {
    console.error("Brevo API Connection Error:", error);
    throw error;
  }
};

export const sendDelOtpMail = async (user, otp) => {
  try {
    const response = await fetch(BREVO_API_URL, {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: { name: "SpiceSprint", email: "spicesprintsaheb@gmail.com" },
        to: [{ email: user.email }],
        subject: "Delivery OTP",
        htmlContent: `
          <h2>Delivery Verification</h2>
          <h1>${otp}</h1>
        `,
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(JSON.stringify(data));
    
    console.log("Delivery OTP Sent Successfully:", data.messageId || data);
  } catch (error) {
    console.error("Brevo API Connection Error:", error);
    throw error;
  }   
};