import jwt from "jsonwebtoken";
import { errorHandler } from "../Utils/Error.js";
import dotenv from "dotenv";

dotenv.config();

// Middleware to verify JWT token
export const verifyToken = (req, res, next) => {
  const token = req.headers.token;
  if (!token) {
    return next(errorHandler(401, "Unauthorized Access"));
  }
   // Verify JWT and extract user data
  jwt.verify(token, process.env.JWT_SECRET_KEY, (error, user) => {
    if (error) {
      return next(errorHandler(401, "Unauthorized Access"));
    }
    req.user = user;  // Attach user data to request object
    next();
  });
};
