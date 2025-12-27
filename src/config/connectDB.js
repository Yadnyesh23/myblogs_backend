import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);

    console.log(
      `Database connected successfully!\nDB Host: ${connectionInstance.connection.host}\nDB Name: ${connectionInstance.connection.name}`
    );
  } catch (error) {
    throw new ApiError(500, "Database connection error.", null, [error.message]);
  }
};

export default connectDB;
