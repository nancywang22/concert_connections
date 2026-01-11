import { Request, Response } from "express";
import {Post} from "../models/Post";
import { AuthRequest } from "../middleware/authMiddleware";

/**
 * Create a post for a selected concert.
 * Route: POST /posts
 */
export async function createPostHandler(req: AuthRequest, res: Response) {
  try {
    const { concertId, caption, imageUrl } = req.body;

    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!concertId || (!caption && !imageUrl)) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const post = new Post({
      concert: concertId,
      caption,
      imageUrl,
      user: req.userId,
    });

    await post.save();
    res.json(post);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

// Get posts for a concert
export async function getPostsForConcertHandler(req: Request, res: Response) {
  const { concertId } = req.params;
  if (!concertId) return res.status(400).json({ error: "concertId required" });

  try {
    const posts = await Post.find({ concert: concertId })
    .populate("user", "username")
    .populate("concert")
    .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get posts" });
  }
}

// Get all posts

export async function getAllPostsHandler(req: Request, res: Response) {
  try {
    const posts = await Post.find()
      .populate("user", "username")
      .populate("concert")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
}