import { Request, Response } from "express";
import { Concert } from "../models/Concert";
import  Post from "../models/Post";
import { getConcertsByArtist } from "../services/setlistfmService";
import { AuthRequest } from "../middleware/authMiddleware";

// GET concerts from Setlist.fm for a selected artist
export async function concertsByArtistHandler(req: Request, res: Response) {
  const { id: setlistFmId } = req.params; // Setlist.fm artist ID
  if (!setlistFmId) return res.status(400).json({ error: "Artist ID required" });

  try {
    const concerts = await getConcertsByArtist(setlistFmId);
    res.json(concerts);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch concerts", details: err.message });
  }
}

// POST: Log a concert and create a post
export async function logConcertHandler(req: AuthRequest, res: Response) {
  try {
    const { artistName, concertName, city, date, venue, setlistFmId, imageUrl, caption } = req.body;
    const userId = req.userId;

    if (!artistName || !concertName || !city || !date || !userId) {
      return res.status(400).json({ error: "artistName, concertName, city, date, and userId are required" });
    }

    // Create or reuse a concert document
    const concert = new Concert({
      artistName,
      concertName,
      city,
      date,
      venue,
      ...(setlistFmId ? { setlistFmId } : {}),
    });

    await concert.save();

    // Create the post linked to this concert
    const post = new Post({
      user: userId,
      concert: concert._id,
      caption,
      imageUrl,
    });

    await post.save();

    res.json({ message: "Concert logged successfully", concert, post });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Failed to log concert", details: err.message });
  }
}
