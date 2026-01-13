import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

// Import route modules for different parts of the backend
import artistRoutes from "./routes/artistRoutes";
import concertRoutes from "./routes/concertRoutes";
import postRoutes from "./routes/postRoutes";
import authRoutes from "./routes/authRoutes";
import mainRoutes from "./routes/mainRoutes";

// Import the function to connect to MongoDB
import { connectDB } from "./db";

// ---------------------------
// Database connection
// ---------------------------
connectDB(); // Establish connection to MongoDB before handling any requests

// ---------------------------
// Express app setup
// ---------------------------
const app = express();

// Enable CORS so the frontend can call the backend
// For local dev: uncomment localhost line
// app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// Production CORS: only allow requests from your deployed frontend
app.use(cors({ origin: "https://concert-connections.vercel.app", credentials: true }));

// Enable parsing JSON bodies for incoming requests
app.use(express.json());

// ---------------------------
// Routes
// ---------------------------

app.use("/artists", artistRoutes);

app.use("/concerts", concertRoutes);

app.use("/auth", authRoutes);

app.use("/posts", postRoutes);

app.use("/", mainRoutes);

// Health check route for monitoring server status
app.get("/health", (_req, res) => res.json({ status: "ok" }));

// ---------------------------
// Server startup
// ---------------------------
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

// Minimal test route to quickly check server responsiveness
app.get("/ping", (_req, res) => {
  res.json({ message: "pong" });
});
