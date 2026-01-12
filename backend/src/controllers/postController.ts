import { Request, Response } from "express";
import { Post } from "../models/Post";
import { AuthRequest } from "../middleware/authMiddleware";

/**
 * Create a post for a selected concert.
 * Route: POST /posts
 */
export async function createPostHandler(req: AuthRequest, res: Response) {
  try {
    // Extract expected fields from the request body
    const { concertId, caption, imageUrl } = req.body;

    // Ensure the request is authenticated
    // authMiddleware should have attached userId to the request
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Validate required input:
    // - concertId must exist
    // - at least one of caption or imageUrl must be provided
    if (!concertId || (!caption && !imageUrl)) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Create a new Post document associated with:
    // - the selected concert
    // - the authenticated user
    const post = new Post({
      concert: concertId,
      caption,
      imageUrl,
      user: req.userId,
    });

    // Persist the post to the database
    await post.save();

    // Return the newly created post
    res.json(post);
  } catch (err: any) {
    // Log the error for debugging
    console.error(err);

    // Return a generic server error response
    res.status(500).json({ error: err.message });
  }
}

// ---------------------------
// Get posts for a specific concert
// ---------------------------
export async function getPostsForConcertHandler(req: Request, res: Response) {
  // Extract concertId from route parameters
  const { concertId } = req.params;

  // Validate required route parameter
  if (!concertId) return res.status(400).json({ error: "concertId required" });

  try {
    // Find all posts associated with the given concert
    const posts = await Post.find({ concert: concertId })
      // Populate the user reference, but only return the username field
      .populate("user", "username")
      // Populate the concert reference for contextual information
      .populate("concert")
      // Sort posts by creation date (newest first)
      .sort({ createdAt: -1 });

    // Return the list of posts
    res.json(posts);
  } catch (err) {
    // Log database or query errors
    console.error(err);

    // Return a server error response
    res.status(500).json({ error: "Failed to get posts" });
  }
}

// ---------------------------
// Get all posts (global feed)
// ---------------------------
export async function getAllPostsHandler(req: Request, res: Response) {
  try {
    // Fetch all posts from the database
    const posts = await Post.find()
      // Populate the user reference with username only
      .populate("user", "username")
      // Populate the concert reference for each post
      .populate("concert")
      // Sort posts by creation date (newest first)
      .sort({ createdAt: -1 });

    // Return all posts
    res.json(posts);
  } catch (err) {
    // Handle unexpected errors
    res.status(500).json({ error: "Failed to fetch posts" });
  }
}
