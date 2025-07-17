import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoDB_URL = process.env.MONGODB_URL;

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(mongoDB_URL);
    console.log('MongoDB connected successfully')
    return connection;
  } catch (error) {
    console.log("MongoDB Connection Error: ",error.message)
  }
};

export default connectDB;
