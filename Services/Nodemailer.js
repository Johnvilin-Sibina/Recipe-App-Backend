import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { errorHandler } from "../Utils/Error.js";

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
      text: `http://localhost:5173/resetpassword/${userId}/${token}`,
      html: `<p>A request is made to reset your password. If it is made by you click the following link to proceed: <a href=http://localhost:5173/resetpassword/${userId}/${token}">Reset Password</a>. If it is not done by you, ignore the mail.</p>`,
    });
    res.status(200).json({message:"Mail Sent Successfully"})
  } catch (error) {
    return next(errorHandler(500,"Something went wrong. Unable to Send Mail"))
  }
}
main()
};