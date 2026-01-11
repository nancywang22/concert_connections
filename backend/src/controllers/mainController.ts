import { Response } from "express";
import User from "../models/User";
import {Concert} from "../models/Concert";
import {Post} from "../models/Post";
import { AuthRequest } from "../middleware/authMiddleware"; // use your typed request

// Fetch main page data for a user
export async function getMainPageData(req: AuthRequest, res: Response) {
  const userId = req.userId; // TypeScript now knows this exists
  const { concertId } = req.query; // optional selected concert

  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  try {
    // Fetch user's concerts
    const user = await User.findById(userId).populate({
      path: "concerts",
      populate: { path: "artist", select: "name setlistFmId" },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    let selectedConcert = null;
    let posts: any[] = [];

    if (concertId) {
      selectedConcert = await Concert.findById(concertId).populate("artist", "name setlistFmId");

      // Fetch posts for this concert
      posts = await Post.find({ concert: concertId })
        .populate("user", "username")
        .sort({ createdAt: -1 });
    }

    res.json({
      concerts: user.concerts,       // User's logged concerts
      selectedConcert,               // Info about the selected concert
      posts,                         // Posts for that concert
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch main page data" });
  }
}
