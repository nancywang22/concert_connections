import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import artistRoutes from "./routes/artistRoutes";
import concertRoutes from "./routes/concertRoutes";
import postRoutes from "./routes/postRoutes";
import authRoutes from "./routes/authRoutes";
import mainRoutes from "./routes/mainRoutes";
import { connectDB } from "./db";


connectDB();

const app = express();
//app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cors({ origin: "https://concert-connections.vercel.app", credentials: true }));

app.use(express.json());

app.use("/artists", artistRoutes);
app.use("/concerts", concertRoutes);
app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("", mainRoutes);
app.get("/health", (_req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));


// Minimal test route
app.get("/ping", (_req, res) => {
  res.json({ message: "pong" });
});