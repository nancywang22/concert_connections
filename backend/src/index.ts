import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import artistRoutes from "./routes/artistRoutes";
import concertRoutes from "./routes/concertRoutes";
import { connectDB } from "./db";


connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/artists", artistRoutes);
app.use("/concerts", concertRoutes);

app.get("/health", (_req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
