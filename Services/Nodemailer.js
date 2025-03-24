import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

//Function to send mail to reset password
export const sendLink = async (email, token, userId) => {
  // Configure the email transporter with SMTP details
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.PASSMAIL,  // Sender email
      pass: process.env.PASSKEY,   // App password
    },
  });
  async function main(req, res) {
  try {
    const info = await transporter.sendMail({
      from: process.env.PASSMAIL,
      to: email,
      subject: "Reset Password",
      text: `https://tasty-trove-recipes.netlify.app/resetpassword/${userId}/${token}`,
      html: `<p>A request is made to reset your password. If it is made by you click the following link to proceed: <a href=https://tasty-trove-recipes.netlify.app/resetpassword/${userId}/${token}">Reset Password</a>. If it is not done by you, ignore the mail.</p>`,
    });
    console.log("Mail Sent Successfully:", info.response);
  } catch (error) {
    console.error("Error Sending Mail:", error);
  }
}
main()
};