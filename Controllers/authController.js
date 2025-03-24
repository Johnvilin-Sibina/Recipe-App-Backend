import User from "../Models/userModel.js";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import {errorHandler} from "../Utils/Error.js";
import { sendLink } from "../Services/Nodemailer.js";

dotenv.config();


// Function to register a new user
export const registerUser = async (req, res, next) => {
  const { userName, email, password } = req.body;

  if (!userName || !email || !password) {
    return next(errorHandler(400, "All the fields are required"));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  try {
    const newUser = new User({
      userName:userName,
      email:email,
      password: hashedPassword
    });
    await newUser.save();
    res.status(200).json({ message: "User registered successfully",newUser });
  } catch (error) {
    return next(errorHandler(500, "Internal Server Error"));
  }
};


// Function to log in a user
export const loginUser = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(errorHandler(400, "All the Fields are Required"));
    }
    try {
      const userDetail = await User.findOne({ email });
      const userPassword = bcryptjs.compareSync(password, userDetail.password);
      if (!userDetail || !userPassword) {
        return next(errorHandler(400, "Invalid Credentials"));
      }
      const token = jwt.sign(
        { id: userDetail._id, },
        process.env.JWT_SECRET_KEY
      );
      const { password: passkey, ...rest } = userDetail._doc;
      res
        .status(200)
        .json({ message: "User Logged In Successfully", rest, token });
    } catch (error) {
      return next(errorHandler(error));
    }
  };


  // Function to handle Google authentication
  export const google = async (req, res, next) => {
    const { email, name, profilePic } = req.body;
    try {
      // Check if the user already exists in the database
      const user = await User.findOne({ email });

      if (user) {
        // If user exists, generate a JWT token with user ID and admin status
        const token = jwt.sign(
          { id: user._id, isAdmin: user.isAdmin },
          process.env.JWT_SECRET_KEY
        ); 

        // Exclude password from the response for security reasons
        const { password: passkey, ...rest } = user._doc;
        res
          .status(200)
          .json({ message: "User Logged In Successfully", rest, token });
      } else {
        // If user doesn't exist, generate a random secure password
        const generatePassword =
          Math.random().toString(36).slice(-8) +  // Generates an 8-character alphanumeric string
          Math.random().toString(36).slice(-8);  // Adds another 8 characters to increase security

        // Hash the generated password for security
        const hashedPassword = bcryptjs.hashSync(generatePassword, 10);

         // Create a unique username by removing spaces from the name and appending a random 4-digit number
        const newUser = new User({
          userName:
            name.split(" ").join("") +
            Math.random().toString(9).slice(-4),
          email,
          password: hashedPassword,
          profilePicture: profilePic,
        });
  
        await newUser.save();
  
         // Generate a JWT token for the newly registered user
        const token = jwt.sign(
          { id: newUser._id },
          process.env.JWT_SECRET_KEY
        );
        const { password: passkey, ...rest } = newUser._doc;
        res
          .status(200)
          .json({ message: "User Logged In Successfully", rest, token });
      }
    } catch (error) {
      return next(errorHandler(error));
    }
  };

  //Function to send email to reset password
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if(!email){
      return next(errorHandler(401,'E-mail address is missing.'))
    }
    const user = await User.findOne({ email });
    if (!user) {
      return next(errorHandler(401, "User not found"));
    }
    const userId = user._id;
    const token = jwt.sign({ _id: userId }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });
    await sendLink(email, token, userId);
    res.status(200).json({ message: "Mail Sent Successfully" });
  } catch (error) {
    return next(errorHandler(500,'Something went wrong. Cannot send mail.'));
  }
};

//Function to reset password
export const resetPassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { newPassword, confirmNewPassword } = req.body;
    if (newPassword !== confirmNewPassword) {
      return next(errorHandler(400, "Password does not match"));
    }
    const user = await User.findById(id);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    const hashPassword = await bcryptjs.hash(newPassword, 10);
    user.password = hashPassword;
    await user.save();
    res.status(200).json({ message: "Password Reset Successfully" });
  } catch (error) {
    return next(errorHandler(500, error.message));
  }
};