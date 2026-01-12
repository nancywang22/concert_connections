import { Response } from "express";
import User from "../models/User";
import { Concert } from "../models/Concert";
import { Post } from "../models/Post";
import { AuthRequest } from "../middleware/authMiddleware"; // Custom request type with userId

/*
|--------------------------------------------------------------------------
| Get Main Page Data
|--------------------------------------------------------------------------
| This controller powers the main page of the application.
|
| Responsibilities:
| - Verify the user is authenticated
| - Fetch all concerts logged by the current user
| - Optionally fetch posts for a selected concert **not implemented yet**
|
| This endpoint supports:
| - Showing a user's concert history
| - Displaying posts associated with a selected concert
|--------------------------------------------------------------------------
*/
export async function getMainPageData(req: AuthRequest, res: Response) {
  // userId is attached by authMiddleware after JWT verification
  const userId = req.userId;

  // Optional query parameter used when a concert is selected
  const { concertId } = req.query;

  // Reject request if user is not authenticated
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  try {
    /*
    |--------------------------------------------------------------------------
    | Fetch the user and their concerts
    |--------------------------------------------------------------------------
    | - Retrieves the current user by ID
    | - Populates the user's concerts
    | - Each concert further populates its artist data
    */
    const user = await User.findById(userId).populate({
      path: "concerts",
      populate: { path: "artist", select: "name setlistFmId" },
    });

    // If the user does not exist, return a 404
    if (!user) return res.status(404).json({ error: "User not found" });

    // Default values when no concert is selected
    let selectedConcert = null;
    let posts: any[] = [];

    /*
    |--------------------------------------------------------------------------
    | If a concert is selected, fetch its data and posts
    |--------------------------------------------------------------------------
    | - Fetch the concert by ID
    | - Populate its artist information
    | - Fetch all posts associated with that concert
    | - Populate the posting user's username
    | - Sort posts newest-first
    */
    if (concertId) {
      selectedConcert = await Concert.findById(concertId).populate(
        "artist",
        "name setlistFmId"
      );

      posts = await Post.find({ concert: concertId })
        .populate("user", "username")
        .sort({ createdAt: -1 });
    }

    /*
    |--------------------------------------------------------------------------
    | Send aggregated data back to the frontend
    |--------------------------------------------------------------------------
    | concerts        → all concerts logged by the user
    | selectedConcert → detailed info for the chosen concert (if any)
    | posts           → posts tied to that concert
    */
    res.json({
      concerts: user.concerts,
      selectedConcert,
      posts,
    });
  } catch (err) {
    // Catch-all error handler for database or population failures
    console.error(err);
    res.status(500).json({ error: "Failed to fetch main page data" });
  }
}
