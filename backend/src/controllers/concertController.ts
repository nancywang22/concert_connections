import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { Concert } from "../models/Concert";
import { Post } from "../models/Post";

export async function logConcertHandler(req: AuthRequest, res: Response) {
  try {
    console.log("LOG CONCERT BODY:", req.body);

    const { artistName, city, date, venue, caption, imageUrl } = req.body;

    if (!artistName || !city || !date) {
      return res.status(400).json({
        error: "artistName, city, and date are required",
      });
    }

    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // 1️⃣ Save concert
    const concert = new Concert({
      artistName,
      city,
      date,
      venue,
      user: req.userId,
    });

    console.log("About to save concert...");
    await concert.save();
    console.log("Concert saved:", concert._id);

    // 2️⃣ Save post
    console.log("About to save post...");
    const post = new Post({
      user: req.userId,
      concert: concert._id,
      caption,
      imageUrl,
    });

    await post.save();
    console.log("Post saved:", post._id);

    return res.status(201).json({ concert, post });
  } catch (err: any) {
    console.error("POST CREATION FAILED:", err);
    return res.status(500).json({
      error: "Failed to log concert",
      details: err.message,
    });
  }
}
