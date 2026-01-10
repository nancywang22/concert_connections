import { Request, Response } from "express";
import { Concert } from "../models/Concert";
import { Artist } from "../models/Artist";

// Create a concert (or attach memory if already exists for user)
export async function logConcertHandler(req: Request, res: Response) {
  try {
    const { artistId, date, venue, city, userId, memory, rating, photoUrl } = req.body;

    if (!artistId || !date || !venue || !city || !userId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if concert already exists for this artist + date + venue
    let concert = await Concert.findOne({ artist: artistId, date, venue });

    if (!concert) {
      // Create new concert
      concert = new Concert({
        artist: artistId,
        date,
        venue,
        city,
        userMemories: [{ userId, memory, rating, photoUrl }],
      });
    } else {
      // Add user memory if not already added by this user
      const existingMemory = concert.userMemories.find(m => m.userId === userId);
      if (!existingMemory) {
        concert.userMemories.push({ userId, memory, rating, photoUrl });
      }
    }

    await concert.save();

    res.json(concert);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

// Get concerts for a specific artist
export async function getArtistConcertsHandler(req: Request, res: Response) {
  try {
    const artistId = req.params.artistId;
    const concerts = await Concert.find({ artist: artistId }).populate("artist");
    res.json(concerts);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

// Get overlaps: concerts attended by multiple users
export async function getUserOverlapsHandler(req: Request, res: Response) {
  try {
    const userId = req.params.userId;

    // Find concerts attended by this user
    const userConcerts = await Concert.find({ "userMemories.userId": userId });

    const overlaps = [];

    for (const concert of userConcerts) {
      // Find other users who attended the same concert
      const otherUsers = concert.userMemories
        .filter(m => m.userId !== userId)
        .map(m => m.userId);

      if (otherUsers.length > 0) {
        overlaps.push({
          concertId: concert._id,
          artist: concert.artist,
          date: concert.date,
          venue: concert.venue,
          city: concert.city,
          otherUsers,
        });
      }
    }

    res.json(overlaps);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
