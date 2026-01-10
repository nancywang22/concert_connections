import { Request, Response } from "express";
import Post from "../models/Post";
import { AuthRequest } from "../middleware/authMiddleware";

// Create a post
export async function createPostHandler(req: AuthRequest, res: Response) {
  const { concertId, imageUrl, caption } = req.body;

  if (!req.userId) return res.status(401).json({ error: "Unauthorized" });
  if (!concertId || !imageUrl || !caption)
    return res.status(400).json({ error: "concertId, imageUrl, caption required" });

  try {
    const post = new Post({
      user: req.userId,
      concert: concertId,
      imageUrl,
      caption,
    });

    await post.save();
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create post" });
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