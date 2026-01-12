import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { Concert } from "../models/Concert";
import { Post } from "../models/Post";

/*
|--------------------------------------------------------------------------
| Log Concert + Create Post Handler
|--------------------------------------------------------------------------
| This controller handles logging a concert AND creating a post
| in a single request.
|
| It is a protected route:
| - Requires a valid JWT
| - `req.userId` is injected by authMiddleware
|
| High-level flow:
| 1. Validate required fields
| 2. Ensure user is authenticated
| 3. Create and save a Concert document
| 4. Create and save a Post linked to that concert
| 5. Return both objects to the client
|--------------------------------------------------------------------------
*/
export async function logConcertHandler(req: AuthRequest, res: Response) {
  try {
    // Log request body for debugging frontend → backend data flow
    console.log("LOG CONCERT BODY:", req.body);

    // Destructure expected fields from the request body
    const { artistName, city, date, venue, caption, imageUrl } = req.body;

    /*
      Basic validation:
      A concert must always have an artist, city, and date.
      Caption and image are optional and belong to the post.
    */
    if (!artistName || !city || !date) {
      return res.status(400).json({
        error: "artistName, city, and date are required",
      });
    }

    /*
      Authentication check:
      authMiddleware attaches `userId` to the request if the JWT is valid.
      If it is missing, the request is unauthorized.
    */
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    /*
    |--------------------------------------------------------------------------
    | Step 1: Create and save the Concert
    |--------------------------------------------------------------------------
    | Each concert is stored in its own collection.
    | The concert is associated with the user who logged it.
    */
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

    /*
    |--------------------------------------------------------------------------
    | Step 2: Create and save the Post
    |--------------------------------------------------------------------------
    | The post references:
    | - the user who created it
    | - the concert it belongs to
    |
    | This creates a relational link between collections in MongoDB.
    */
    console.log("About to save post...");
    const post = new Post({
      user: req.userId,
      concert: concert._id,
      caption,
      imageUrl,
    });

    await post.save();
    console.log("Post saved:", post._id);

    /*
      Return both the concert and post so the frontend
      can immediately update UI state without refetching.
    */
    return res.status(201).json({ concert, post });
  } catch (err: any) {
    /*
      Catch-all error handler:
      Logs the full error server-side and sends a
      generic message to the client with details.
    */
    console.error("POST CREATION FAILED:", err);
    return res.status(500).json({
      error: "Failed to log concert",
      details: err.message,
    });
  }
}
