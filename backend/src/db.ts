// Database connection setup using Mongoose
import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables from a .env file
dotenv.config();

// Read the MongoDB connection URI from environment variables
// Fallback to a local MongoDB instance if MONGO_URI is not set
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/concert-connections";

// Function to connect to MongoDB
export const connectDB = async () => {
  try {
    // Use mongoose to connect to the database
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected"); // Log success
  } catch (err) {
    // If connection fails, log the error and exit the process
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit with failure code
  }
};
